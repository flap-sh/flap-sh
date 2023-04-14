// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/INFTBridge.sol";
import "./polygon/IPolygonZKEVMBridge.sol";
import "./ZKEVMBridgeHelper.sol";
import "./interfaces/IPeggedNFT.sol";
import "hardhat/console.sol";

/// @title  The L1 endpoint of the NFTBridge
/// @author
/// @notice  This contract is deployed on L1
contract NFTBridgeL1 is INFTBridgeL1Endpoint, Ownable, ReentrancyGuard {

    /// @dev The address of the polygon zkEVM bridge
    IPolygonZkEVMBridge public zkEVMBridge;

    /// @dev The address of the NFTbridge L2 endpoint
    address public L2Endpoint;

    mapping(address => bool) public enabledCollections;

    /// @param _zkEVMBridge  - address of the PolygonZkEVM Bridge on L1
    /// @param _L2Endpoint   - address of the NFTBridge L2 endpoint
    constructor(address _zkEVMBridge, address _L2Endpoint) {
        zkEVMBridge = IPolygonZkEVMBridge(_zkEVMBridge);
        L2Endpoint = _L2Endpoint;
    }

    /// Bridge NFT from L1 to L2
    /// @dev  only enabled collection can be bridged
    /// @param _collection The address of the collection
    /// @param _id The id of the NFT
    /// @param _receiver The address of the receiver on L2
    function BridgeNFTToL2(address _collection, uint256 _id, address _receiver) external override {
        require(enabledCollections[_collection], "NFTBridgeL1: collection is not enabled");

        // transfer NFT to this contract
        IERC721Metadata(_collection).transferFrom(msg.sender, address(this), _id);

        // encode the message
        bytes memory data = abi.encode(
            MessageEnvelope(
                MessageType.MSG_TYPE_NFT_BRIDGE_L1ToL2, abi.encode(NFTBridgeMsgL1ToL2(_id, _collection, _receiver))
            )
        );

        // send the message to L2
        ZKEVMBridgeHelper.sendMessageFromL1ToL2(zkEVMBridge, L2Endpoint, data);

        emit NFTBridgedToL2(_collection, _id, _receiver);
    }

    /// Enable the collection to be bridged to L2
    /// @dev - Only the owner can call this function
    ///      - This may trigger the depolyment of a bridgedNFT contract on L2
    /// @param _collection - address of the collection
    function enableCollection(address _collection) external override onlyOwner {
        require(!enabledCollections[_collection], "NFTBridgeL1: collection is already enabled");

        enabledCollections[_collection] = true;

        string memory name = IERC721Metadata(_collection).name();
        string memory symbol = IERC721Metadata(_collection).symbol();

        // encode the message
        bytes memory data = abi.encode(
            MessageEnvelope(
                MessageType.MSG_TYPE_NFT_BRIDGE_ENABLE_COLLECTION,
                abi.encode(NFTBridgeMsgEnableCollection(name, symbol, _collection))
            )
        );

        // send the message to L2
        ZKEVMBridgeHelper.sendMessageFromL1ToL2(zkEVMBridge, L2Endpoint, data);

        emit CollectionEnabled(_collection);
    }

    // Disable the collection to be bridged to L2
    /// @dev only disable L1->L2 bridging, not L2->L1
    /// @param _collection - address of the collection
    function disableCollection(address _collection) external override onlyOwner {
        require(enabledCollections[_collection], "NFTBridgeL1: collection is not enabled");

        enabledCollections[_collection] = false;

        emit CollectionDisabled(_collection);
    }

    /// @dev - only the polygon zkevm bridge can call this function
    ///      - only accept the message of type MSG_TYPE_NFT_BRIDGE_L2ToL1
    /// @param _data abi encoding of the message (MessageEnvelope)
    /// @param _originAddress - address of the sender on L1
    /// @param _originNetwork - network id of the sender on L1
    ///
    /// @inheritdoc IBridgeMessageReceiver
    function onMessageReceived(address _originAddress, uint32 _originNetwork, bytes memory _data)
        external
        payable
        override
        nonReentrant
    {
        
        require(msg.sender == address(zkEVMBridge), "NFTBridgeL1: not zkEVM bridge");
        require(_originAddress == L2Endpoint, "NFTBridgeL1: not L2 endpoint");
        require(_originNetwork == ZKEVMBridgeHelper.L2_NETWORK_ID, "NFTBridgeL1: not from L2");

        (MessageEnvelope memory messageEnvelope) = abi.decode(_data, (MessageEnvelope));


        if (messageEnvelope.messageType == MessageType.MSG_TYPE_NFT_BRIDGE_L2ToL1) {
            (NFTBridgeMsgL2ToL1 memory message) = abi.decode(messageEnvelope.data, (NFTBridgeMsgL2ToL1));

            // transfer NFT to the receiver
            //
            // Every message from the zkEVM bridge is executed after "set as claimed".
            // I think there is not reentrancy attack here.
            // https://github.com/0xPolygonHermez/zkevm-contracts/blob/b1cefea1431e59b2121e543b786b93af99e859f4/contracts/PolygonZkEVMBridge.sol#L575
            IERC721Metadata(message.collection).transferFrom(address(this), message.receiver, message.id);

            emit NFTBridgedBackFromL2(message.collection, message.id, message.receiver);
        } else {
            revert("NFTBridgeL1: invalid message type");
        }
    }

    function onERC721Received(address _operator, address, uint256, bytes calldata)
        external
        view
        override
        returns (bytes4)
    {
        // avoid accidental transfer of NFT to this contract
        require(_operator == address(this), "NFTBridgeL1: not this contract");

        return this.onERC721Received.selector;
    }
}

contract NFTBridgeL2 is INFTBridgeL2Endpoint, Ownable, ReentrancyGuard {
    /// @dev The address of the polygon zkEVM bridge
    IPolygonZkEVMBridge public zkEVMBridge;

    /// @dev The address of the NFTbridge L1 endpoint
    address public L1Endpoint;

    /// @dev the implementation of the pegged NFT contract
    address public peggedNFTImpl;

    /// @dev mappings from L2 collection address to L1 collection address
    mapping(address => address) public L2ToL1Addresses;


    constructor(address _zkEVMBridge, address _L1Endpoint, address _peggedNFTImpl) {
        zkEVMBridge = IPolygonZkEVMBridge(_zkEVMBridge);
        L1Endpoint = _L1Endpoint;
        peggedNFTImpl = _peggedNFTImpl;
    }

    /// Bridge NFT back from L2 to L1
    /// @param _collection  The address of the collection on L2
    /// @param _id  The id of the NFT
    /// @param _receiver  The address of the receiver on L1
    function BridgeBackToL1(address _collection, uint256 _id, address _receiver) external override {
        address l1CollectionAddr = L2ToL1Addresses[_collection];

        require(l1CollectionAddr != address(0), "NFTBridgeL2: collection is not enabled");

        // burn the bridged NFT on L2
        IPeggedNFT(_collection).burn(msg.sender, _id);

        // encode the message
        bytes memory data = abi.encode(
            MessageEnvelope(
                MessageType.MSG_TYPE_NFT_BRIDGE_L2ToL1, abi.encode(NFTBridgeMsgL2ToL1(_id, l1CollectionAddr, _receiver))
            )
        );

        // send the message to L1
        ZKEVMBridgeHelper.sendMessageFromL2ToL1(zkEVMBridge, L1Endpoint, data);

        emit NFTBridgedBackToL1(_collection, _id, msg.sender, _receiver);
    }

    /// @dev - only the polygon zkevm bridge can call this function
    ///      - only accept the message of type MSG_TYPE_NFT_BRIDGE_L1ToL2 and MSG_TYPE_NFT_BRIDGE_ENABLE_COLLECTION
    /// @param _data abi encoding of the message (MessageEnvelope)
    /// @param _originAddress - address of the sender on L1
    /// @param _originNetwork - network id of the sender on L1
    ///
    /// @inheritdoc IBridgeMessageReceiver
    function onMessageReceived(address _originAddress, uint32 _originNetwork, bytes memory _data)
        external
        payable
        override
        nonReentrant
    {
        require(msg.sender == address(zkEVMBridge), "NFTBridgeL2: not zkEVM bridge");
        require(_originAddress == L1Endpoint, "NFTBridgeL2: not L1 endpoint");
        require(_originNetwork == ZKEVMBridgeHelper.L1_NETWORK_ID, "NFTBridgeL2: not from L1");

        (MessageEnvelope memory messageEnvelope) = abi.decode(_data, (MessageEnvelope));

        if (messageEnvelope.messageType == MessageType.MSG_TYPE_NFT_BRIDGE_ENABLE_COLLECTION) {
            (NFTBridgeMsgEnableCollection memory message) =
                abi.decode(messageEnvelope.data, (NFTBridgeMsgEnableCollection));

        
            (address expectedL2Addr, bytes32 salt)= _predictPeggedNFTAddress(message.collection);

            require(L2ToL1Addresses[expectedL2Addr] == address(0), "NFTBridgeL2: collection is already enabled");

            // depoly the bridged NFT contract
            address l2Collection = Clones.cloneDeterministic(peggedNFTImpl, salt);

            // initialize the bridged NFT contract
            IPeggedNFT(l2Collection).initialize(message.name, message.symbol);

            // enable the collection to be bridged to L1
            L2ToL1Addresses[l2Collection] = message.collection;
        } else if (messageEnvelope.messageType == MessageType.MSG_TYPE_NFT_BRIDGE_L1ToL2) {
            (NFTBridgeMsgL1ToL2 memory message) = abi.decode(messageEnvelope.data, (NFTBridgeMsgL1ToL2));
            
            (address expectedL2Addr,)= _predictPeggedNFTAddress(message.collection);

            require(L2ToL1Addresses[expectedL2Addr] == message.collection, "NFTBridgeL2: collection is not enabled");

            // mint the bridged NFT on L2
            IPeggedNFT(expectedL2Addr).mint(message.receiver, message.id);

            emit NFTBridgedFromL1(message.collection, message.id, message.receiver);
        } else {
            revert("NFTBridgeL2: invalid message type");
        }
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        // we do not lock any NFT on L2
        revert("NFTBridgeL2: not supported");
    }

    // a view function to predict the pegged NFT address based on the L1 collection address
    function predictPeggedNFTAddress(address _l1Addr) external view returns (address) {
           (address a, ) =  _predictPeggedNFTAddress(_l1Addr);
           return a;
    }

    // internal functions

    function _predictPeggedNFTAddress(address _l1Addr) internal view returns (address _l2Addr, bytes32 _salt) {
        bytes32 salt = _address2bytes32(_l1Addr);
        return (Clones.predictDeterministicAddress(peggedNFTImpl, salt), salt);
    }

    function _address2bytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }
}

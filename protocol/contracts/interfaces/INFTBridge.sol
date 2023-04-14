// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "../polygon/IBridgeMessageReceiver.sol";
import "./ICrossChainMessages.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


// The NFTBridge contracts on L1 and L2 are different. 

/// @title  NFT Bridge  L1 endpoint Interface
/// @author
/// @notice
interface INFTBridgeL1Endpoint is ICrossChainMessages, IBridgeMessageReceiver, IERC721Receiver {
    /// Bridge NFT from L1 to L2
    /// @dev  only enabled collection can be bridged
    /// @param _collection The address of the collection
    /// @param _id The id of the NFT
    /// @param _receiver The address of the receiver on L2
    function BridgeNFTToL2(address _collection, uint256 _id, address _receiver) external;

    /// Enable the collection to be bridged to L2
    /// @dev - Only the owner can call this function
    ///      - This may trigger the depolyment of a bridgedNFT contract on L2
    /// @param _collection - address of the collection
    function enableCollection(address _collection) external;

    /// Disable the collection to be bridged to L2
    /// @dev only disable L1->L2 bridging, not L2->L1
    /// @param _collection - address of the collection
    function disableCollection(address _collection) external;

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
        override;

    // events

    /// @dev Emitted when a collection is enabled
    /// @param _collection - address of the collection
    event CollectionEnabled(address _collection);

    /// @dev Emitted when a collection is disabled
    /// @param _collection - address of the collection
    event CollectionDisabled(address _collection);

    /// @dev Emitted when a NFT is bridged from L1 to L2
    /// @param _collection - address of the collection
    /// @param _id - id of the NFT
    /// @param _receiver - address of the receiver on L2
    event NFTBridgedToL2(address _collection, uint256 _id, address _receiver);

    /// @dev Emited when a NFT is bridged back from L2 to L1
    /// @param _collection - address of the collection
    /// @param _id - id of the NFT
    /// @param _receiver - address of the receiver on L1
    event NFTBridgedBackFromL2(address _collection, uint256 _id, address _receiver);
}

//// @title NFT Bridge  L2 endpoint Interface
/// @author
/// @notice
interface INFTBridgeL2Endpoint is ICrossChainMessages, IBridgeMessageReceiver, IERC721Receiver {
    /// Bridge NFT back from L2 to L1
    /// @param _collection  The address of the collection (only registered collection can be bridged back)
    /// @param _id  The id of the NFT
    /// @param _receiver  The address of the receiver on L1
    function BridgeBackToL1(address _collection, uint256 _id, address _receiver) external;

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
        override;

    // events

    /// @dev Emitted when a NFT is bridged back from L2 to L1
    /// @param _collection - address of the collection
    /// @param _id - id of the NFT
    /// @param _receiver - address of the receiver on L1
    event NFTBridgedBackToL1(address _collection, uint256 _id,  address _actor,address _receiver);

    /// @dev Emitted when a collection is enabled
    /// @param _collectionL1 - address of the collection on L1
    /// @param _collectionL2 - address of the bridged NFT contract on L2
    event CollectionEnabled(address _collectionL1, address _collectionL2);

    /// @dev Emited when a NFT is bridged from L1 to L2
    /// @param _collection - address of the collection on L1
    /// @param _id - id of the NFT
    /// @param _receiver - address of the receiver on L2
    event NFTBridgedFromL1(address _collection, uint256 _id,  address _receiver);
}

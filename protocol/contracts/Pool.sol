// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "./interfaces/IPool.sol";


import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./ShuffleLib.sol";
import "./ZKEVMBridgeHelper.sol";

/// @dev FIXME: it is better to make the base a pure storage contract. However, we want to 
/// reuse the oz upgradeable ERC721 implementation.  maybe after tokyo?
abstract contract PoolBase is
    IPoolFacetsERC721,
    ERC721Upgradeable,
    OwnableUpgradeable
{


    /// @dev mapping from facet id to facet address
    /// this is more gas saving than using a mapping from selector to facet address when we use a proxy
    mapping(FacetKey => address) internal _facets;

    /// @dev if _seedRequestId == INVALID_SEED_REQUEST_ID, it means the seed is not requested yet.
    uint256 constant INVALID_SEED_REQUEST_ID = 2 ** 256 - 1;

    /// @dev if _creatorFeePaid == FEE_PAID, it means the creator fee is paid.
    ///      if _treasuryFeePaid == FEE_PAID, it means the treasury fee is paid.
    uint64 constant FEE_PAID = 1;

    /// @dev the start time of the box pool
    ///      After this time, users can start to mint boxs
    uint256 internal _startTime;

    /// @dev After this time, if the boxs are not all minted, the pool will be in STATE_REFUNDABLE state.
    uint256 internal _mintEndTime;

    /// @dev the address of the polygon zkEVM bridge
    address internal _bridge;

    /// @dev the address of the seed provider on L1
    address internal _seedProvider;

    /// @dev the address of the pool creator
    address internal _creator;

    /// @dev the address of the protocol treasury
    address internal _protocolTreasury;

    /// @dev the id of the box pool
    uint256 internal _poolID;

    /// @dev the max supply of the box
    uint256 internal _maxSupply;

    /// @dev the current supply of the box
    uint256 internal _currentSupply;

    /// @dev the protocol fee rate in basis points (i.e, 100 = 1%)
    uint64 internal _feeRate;

    /// @dev the share of the protocol fee that goes to the creator
    uint64 internal _creatorFeeShare; // in basis points

    /// @dev the "buyOrders" in the box pool
    NFTOrderBatch[] internal _buyOrdersInternal;

    /// @dev the state of the pool
    PoolState internal _poolState;

    /// @dev seed request ID
    uint256 internal _seedRequestID;

    /// @dev the seed to shuffle the buy orders when the pool is in STATE_REDEEMABLE state
    bytes32 internal _seed;

    /// @dev orderFilledInfo
    struct OrderFilledInfo {
        uint64 filled; // is the order filled or not
        uint64 redeemed; // is the order redeemed or not
        uint128 tokenID; // the token ID of the bought NFT if the order is filled
    }

    /// @dev mapping from orderID to orderFilledInfo
    mapping(uint256 => OrderFilledInfo) internal _orderFilledInfos;

   /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address _operator,
        address,
        uint256,
        bytes calldata
    ) external view override returns (bytes4) {
        // avoid accidental transfer of NFT to this contract
        require(
            _operator == address(this),
            "Pool: unexpected NFT transfer"
        );
        return this.onERC721Received.selector;
    }

    function initFacets(address[] memory facets) external {
        require(_facets[FacetKey.FACET_PARAMS] == address(0), "already initialized");

        _facets[FacetKey.FACET_PARAMS] = facets[uint256(FacetKey.FACET_PARAMS)];
        _facets[FacetKey.FACET_REVEALS] = facets[uint256(FacetKey.FACET_REVEALS)];
        _facets[FacetKey.FACET_BUYORDER_BOX] = facets[uint256(FacetKey.FACET_BUYORDER_BOX)];
    }


    // maybe allow the subclass to hack the timestamp for the hachathon demo?
    // TODO: remove this function
    function _getBlockTimeStamp() internal view virtual returns (uint256) {
        return block.timestamp;
    }
    

}



/// @dev implement the params facet of the pool
contract PoolFacetParams is PoolBase, IPoolFacetParams {

    /// @dev We do not validate the parameters here, the factory is responsible for validating the parameters.
    /// @param _p the parameters of the box pool
    function initialize(PoolParams memory _p) public initializer {

        // FIXME: We don't validate the parameters here 
        //        because we will validate them in the factory contract.

        // initialize the ERC721 contract
        __ERC721_init(
            _catString("Pool #", StringsUpgradeable.toString(_p.poolID)),
            _catString("BOX-", StringsUpgradeable.toHexString(_p.poolID))
        );

        // new owner
        _transferOwnership(_p.protocolTreasury);

        // copy the parameters

        _mintEndTime = _p.mintEndTime;
        _bridge = _p.bridge;
        _seedProvider = _p.seedProvider;
        _creator = _p.creator;
        _protocolTreasury = _p.protocolTreasury;
        _feeRate = uint64(_p.feeRate);
        _poolID = _p.poolID;
        _creatorFeeShare = uint64(_p.creatorFeeShare);

        uint256 maxBoxSupply = 0;

        for (uint i = 0; i < _p.nftOrderBatches.length; ++i) {
            _buyOrdersInternal.push(_p.nftOrderBatches[i]);
            maxBoxSupply += _p.nftOrderBatches[i].count;
        }

        // gas saving
        _maxSupply = maxBoxSupply;

        // init the seed request ID
        _seedRequestID = INVALID_SEED_REQUEST_ID;

        _poolState = PoolState.STATE_MINTABLE; // the pool is in STATE_MINTABLE state


        // TODO: If it takes too long for the tx to be included, 
        //       it may be timeout after initializtion.
        // _transitState();
        
    }

    /// @notice get the params of the box pool
    /// @return the params of the box pool
    function params() external view override returns (PoolParams memory) {

        // @copilot return the params of the box pool
        return
            PoolParams({
                nftOrderBatches: _buyOrdersInternal,
                mintEndTime: _mintEndTime,
                feeRate: _feeRate,
                creatorFeeShare: _creatorFeeShare,
                poolID: _poolID,
                creator: _creator,
                protocolTreasury: _protocolTreasury,
                bridge: _bridge,
                seedProvider: _seedProvider
            });
    }

    // a helper function to concatenate two strings
    function _catString(
        string memory _a,
        string memory _b
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(_a, _b));
    }
}


contract PoolFacetReveal is PoolBase, IPoolFacetReveal{

    /// @dev a box pool only acccepts crosschain messages if the pool is in STATE_REVEALABLE
    ///      a box pool only accepts the following types of cross chain messages:
    ///       - MSG_TYPE_REVEAL_SEED_REQUEST : a seed is requested from L1
    ///       - MSG_TYPE_REVEAL_SEED_DELIVERY : a seed is delivered
    function onMessageReceived(
        address originAddress,
        uint32 originNetwork,
        bytes memory data
    ) external payable override {
        require(
            msg.sender == _bridge,
            "Pool: only bridge can call this function"
        );

        require(
            originAddress == _seedProvider &&
                originNetwork == ZKEVMBridgeHelper.L1_NETWORK_ID,
            "Pool: only seed provider on L1 can call this function"
        );

        require(
            _poolState == PoolState.STATE_REVEALABLE,
            "Pool: pool is not in STATE_REVEALABLE"
        );

        // decode the message envelope
        MessageEnvelope memory envelope = abi.decode(data, (MessageEnvelope));

        if (envelope.messageType == MessageType.MSG_TYPE_REVEAL_SEED_REQUEST) {
            require(
                _seedRequestID == INVALID_SEED_REQUEST_ID,
                "Pool: seed request is already in progress"
            );

            // decode  RevealSeedRequestMsg
            RevealSeedRequestMsg memory m = abi.decode(
                envelope.data,
                (RevealSeedRequestMsg)
            );

            _seedRequestID = m.requestID;

            emit SeedRequestReceived(m.requestID);
        } else if (
            envelope.messageType == MessageType.MSG_TYPE_REVEAL_SEED_DELIVERY
        ) {
            require(
                _seedRequestID != INVALID_SEED_REQUEST_ID,
                "Pool: seed request is not in progress"
            );

            // decode  RevealSeedDeliveryMsg
            RevealSeedDeliveryMsg memory m = abi.decode(
                envelope.data,
                (RevealSeedDeliveryMsg)
            );

            require(
                m.requestID == _seedRequestID,
                "Pool: invalid requestID"
            );

            _seed = m.seed;
            _poolState = PoolState.STATE_REDEEMABLE;

            emit SeedDelivered(m.requestID, m.seed);
            emit StateTransited(
                PoolState.STATE_REVEALABLE,
                PoolState.STATE_REDEEMABLE
            );
        } else {
            revert("Pool: invalid message type");
        }
    }


    /// @dev restart the reveal process
    ///
    ///      - this function can only be called when the pool is in STATE_REVEALABLE
    ///      - Only the DAO can call this function
    ///      - After calling this function, the last seed request will be cleared
    ///
    ///      In most of the cases, this function should not be used.
    ///
    ///      Why do we need this function?
    ///      - On L1 we can only verify the seed in a specific set of blocks.
    ///        The seed is the randao reveal of some block. We can only (limited by EVM) verify the randao reveal
    ///        in a tx which is included in one of the 256 blocks after the block containning the seed.
    ///
    ///        If we miss the chance to verify the seed, we have to restart the reveal process.
    ///
    ///      - learn more: https://www.paradigm.xyz/2023/01/eth-rng
    ///
    /// FIXME: for tokyo, better to reserve some time to test it in the testnet
    function restartReveal() external override onlyOwner {
        require(
            _poolState == PoolState.STATE_REVEALABLE,
            "Pool: pool is not in STATE_REVEALABLE"
        );
        require(_seed == 0, "Pool: seed is already delivered");

        _seedRequestID = INVALID_SEED_REQUEST_ID;
        _seed = 0;

        emit RevealRestarted();
    }

}


// TODO: the heavy work lies in the IPoolFacetBuyOrderBox 
// Let's implement other facets first




// stubs for @clearloop to test the factory 

contract Pool is PoolBase{

    // @copilot the fallback function for the proxy 
    fallback() external payable {

        bytes4 selector = msg.sig;

        // default to the buyOrder and Box facet 
        address facet = _facets[FacetKey.FACET_BUYORDER_BOX]; 


        if(selector == IPoolFacetParams.initialize.selector || 
            selector == IPoolFacetParams.params.selector){
            facet = _facets[FacetKey.FACET_PARAMS];
        } else if (selector == IPoolFacetReveal.onMessageReceived.selector ||
            selector == IPoolFacetReveal.restartReveal.selector){
            facet = _facets[FacetKey.FACET_REVEALS];
        }

        assembly {
            // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // get any return value
            returndatacopy(0, 0, returndatasize())
            // return any return value or error back to the caller
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }


    receive() external payable{
        revert("Pool: fallback function is not payable");
    }
}


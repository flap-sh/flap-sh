// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "../polygon/IBridgeMessageReceiver.sol";
import "./ICrossChainMessages.sol";
import "./IPoolTypes.sol";


/// @dev   A box Pool is a collection of boxs, which are ERC721 tokens.
///        After the pool is revealed, each box will have a "buyorder" in it.
///        If the "buyorder" in a box is filled, the box owner can redeem the NFT by burning the box.
///        If the "buyorder" in a box is not filled, the box owner can redeem the ethers by burning the box.
/// @author flap.sh team & github copilot :)
interface IPool is IPoolTypes{

    /// @notice emitted when a box is redeemed
    /// @param boxID - the ID of the box
    /// @param owner - the owner of the box
    event BoxRedeemed(uint256 indexed boxID, address owner);

    /// @notice emitted when a box is refunded
    /// @param boxID - the ID of the box
    /// @param owner - the owner of the box
    event BoxRefunded(uint256 indexed boxID, address owner);

    /// @notice emitted when the state of the pool is changed
    /// @param from - the previous state of the pool
    /// @param to - the new state of the pool
    event StateTransited(PoolState indexed from, PoolState indexed to);

    /// @notice emitted when a buyorder is filled
    /// @param buyOrderID - the ID of the buy order
    event BuyOrderFilled(uint256 indexed buyOrderID);

    /// @notice emitted when the protocol fees are distributed
    /// @param amount0 - the amount of ethers distributed to the DAO
    /// @param amount1 - the amount of tokens distributed to the pool creator
    event ProtocolFeesDistributed(uint256 amount0, uint256 amount1);

    /// @notice emitted when a seed request from L1 is received
    /// @param seedRequestID - the ID of the seed request
    event SeedRequestReceived(uint256 indexed seedRequestID);

    /// @notice emitted when a seed from L1 is delivered
    /// @param seedRequestID - the ID of the seed request
    /// @param seed - the seed
    event SeedDelivered(uint256 indexed seedRequestID, bytes32 seed);

    /// @notice emitted when the reveal process is restarted
    event RevealRestarted();

    /// @notice get the params of the box pool 
    /// @return the params of the box pool 
    function params() external view returns (PoolParams memory);

    /// @dev a box pool only acccepts crosschain messages if the pool is in STATE_REVEALABLE
    ///      a box pool only accepts the following types of cross chain messages:
    ///       - MSG_TYPE_REVEAL_SEED_REQUEST : a seed is requested from L1
    ///       - MSG_TYPE_REVEAL_SEED_DELIVERY : a seed is delivered from L1
    function onMessageReceived(address originAddress, uint32 originNetwork, bytes memory data)
        external
        payable;

    /// @dev restart the reveal process
    ///
    ///      - this function can only be called when the pool is in STATE_REVEALABLE
    ///      - Only the owner can call this function
    ///      - After calling this function, the last seed request will be cleared
    ///
    ///      In most of the cases, this function should not be used.
    ///
    ///      Why do we need this function?
    ///      - On L1 we can only verify the seed in a specific set of blocks.
    ///        The seed is the randao reveal of some block. We can only (limited by EVM) verify the randao reveal
    ///        in a tx which is included in one of the 256 blocks after the block of the randao reveal.
    ///
    ///        If we miss the chances to verify the seed, we have to restart the reveal process.
    ///
    ///      - learn more: https://www.paradigm.xyz/2023/01/eth-rng
    function restartReveal() external;

    /// @return the price of each box
    function mintPrice() external view returns (uint256);

    /// @dev This returns the cached state (prefered to use the alternative pollState() function)
    /// @return the cached state of the pool
    function poolCachedState() external view returns (PoolState);

    /// @dev The state may change when you call this function.
    /// @return the state of the pool
    function poolState() external returns (PoolState);

    /// @notice mint a box
    /// @dev  - can only be called when the pool is in STATE_MINTABLE
    ///       - msg.value must be gt or eq to mintPrice()
    function mintBox() external payable;

    /// @notice get a "buy order"
    /// @param buyOrderID - the ID of the buy order
    function getNFTBuyOrder(uint256 buyOrderID) external view returns (NFTBuyorder memory);


    /// @dev - can only be called when the pool is in STATE_REDEEMABLE  
    /// 
    /// @param _boxID - the ID of the box 
    /// @return the NFTBuyorder in the box 
    function getRevealedBox(uint256 _boxID) external view returns (NFTBuyorder memory);

    /// @notice take a "buy order"
    /// @dev  - can only be called when the pool is in STATE_REDEEMABLE or STATE_REVEALABLE
    /// @param orderID The id of the buy order to fill
    /// @param tokenID The id of the NFT selling to the pool
    function fillOrder(uint256 orderID, uint256 tokenID) external;

    /// @dev The creator claims its fee. 
    ///      this function can only be called when the pool is in STATE_REDEEMABLE
    function claimCreatorFee() external;

    /// @dev Treasury claims its fee 
    ///      this function can only be called when the pool is in STATE_REDEEMABLE 
    function claimTreasuryFee() external;

    /// @dev redeem the NFT/ethers by burning the box
    ///      this function can only be called when the pool is in STATE_REDEEMABLE
    /// @param _boxID - the ID of the box to redeem
    function redeem(uint256 _boxID) external;

    /// @dev refund the ethers by burning the box
    ///       this function can only be called when the pool is in STATE_REFUNDABLE
    /// @param _boxID - the ID of the box to refund
    function refund(uint256 _boxID) external;

    /// @dev get the current supply of the box 
    function currentSupply() external view returns (uint256);

}





// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

interface IPoolTypes {

    /// The state of the box pool
    enum PoolState {
        STATE_MINTABLE, // You can only mint a box if the pool is in this state
        STATE_REFUNDABLE, // If the boxs are not all minted and the pool is timed out, you can refund the mint owner
        STATE_REVEALABLE, // If the boxs are all minted, anyone can request a seed from L1 to reveal the boxs
        STATE_REDEEMABLE // If the boxs are all revealed, you can redeem your NFT/ethers by burning the box
    }


    /// When you create a box pool, you describe the "NFTBuyOrder" that you want to include
    /// in the pool by provoding an array of NFTOrderBatch structs.
    struct NFTOrderBatch {
        address collection; // NFT collection address
        uint128 count; // number of NFTs in the batch
        uint128 price; // the price of each NFT in the batch,
        //this does not include the protocol fee

        // TODO: Maybe Add an on-demand oracle price feed to set
        //       the lowest allowed price for this collection
        // 
        // Maybe after ethglobal tokyo, we can add a "minPrice" oracle feed
    }

    /// @dev the parameters of a box pool
    struct BoxPoolParams {
        NFTOrderBatch[] nftOrderBatches; // the "NFTBuyOrder"s that you want to include in the pool
        uint256 mintEndTime; // the end time of the minting period
        uint256 feeRate; // the protocol fee rate in basis points (i.e, 100 = 1%)
        uint256 creatorFeeShare; // the share of the protocol fee that goes to the creator
        uint256 poolID; // the pool ID
        address creator; // the address of the creator
        address protocolTreasury; // the address of the protocol treasury
        address bridge; // the address of the polygon zkevm bridge
        address seedProvider; // the address of the seed provider 
        address boxDescriptor; // the address of the box descriptor contract  
    }

    /// @notice a "buy order"
    struct NFTBuyorder {
        address collection; // the address of the NFT collection (could possibly be a bridged collection)
        uint256 price; // maker price
        uint256 filled; // is the order filled or not
        uint256 tokenID; // the token ID of the bought NFT if the order is filled
        uint256 redeemed; // is the box containing the buyOrder redeemed or not
    }

}



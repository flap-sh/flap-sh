// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "./IPoolTypes.sol";

interface IPoolFactory is IPoolTypes {
    
    /// create a new Pool
    /// @param _nftOrderBatches  The "NFTBuyOrder"s that you want to include in the pool
    /// @dev question??? @TODO: does block.timestamp behvave differently on polygon zkevm ?
    function newPool(NFTOrderBatch[] memory _nftOrderBatches)
        external
        returns (address poolAddress);

    // only the collections on the whitelist can be used to create a pool

    /// @dev only the DAO can add or remove collections from the whitelist
    function addCollectionToWhitelist(address _collection) external;

    /// @dev only the DAO can add or remove collections from the whitelist
    function removeCollectionFromWhitelist(address _collection) external;


    /// @dev is a collection on the whitelist ?
    /// @param _collection  - address of the collection
    function isCollectionOnWhitelist(address _collection) external view returns (bool);


    /// @dev get the info of a box pool 
    function getPoolInfo(uint256 _poolID) external view returns (PoolParams memory);
    

    /// @dev return the total number of box pools
    function numPool() external view returns(uint256);

    // events

    /// @dev Emitted when a new box pool is created
    /// @param _boxPoolAddress  - address of the box pool
    /// @param _creator           - address of the creator
    /// @param _poolID             - the ID of the pool
    event NewPoolCreated(
        address indexed _boxPoolAddress,
        address indexed _creator,
        uint256 indexed _poolID
    );

    /// @dev Emitted when a collection is added to the whitelist
    /// @param _collection  - address of the collection
    event CollectionAddedToWhitelist(address indexed _collection);

    /// @dev Emitted when a collection is removed from the whitelist
    /// @param _collection  - address of the collection
    event CollectionRemovedFromWhitelist(address indexed _collection);
}

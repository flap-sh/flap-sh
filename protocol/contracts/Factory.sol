// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "./interfaces/IFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./interfaces/IPool.sol";

contract Factory is IPoolFactory, Ownable {

    /// @dev The maximum time that a pool can be open for minting 
    /// FIXME: 10 min for testing, should be 1 week
    uint constant public POOL_MINT_TIMEOUT = 10 minutes; 

    /// @dev The fee rate in basis points (10%)
    uint constant public FEE_RATE = 1000;

    /// @dev The creator' fee share in basis points (30%)
    uint constant public CREATOR_FEE_SHARE = 3000;


    address internal _bridge; // PolygonZkEVM Bridge address
    address internal _L1SeedProvider; // L1 Seed Provider address

    uint internal  _numPools; // The number of created pools and also the next pool ID 

    // mapping from pool ID to pool address 
    mapping(uint => address) internal _pools;


    // facets of a box pool 
    // TODO: Better way to manage facets? 
    mapping(FacetKey => address) public poolFacets;

    
    // whitelisted collections
    mapping(address => bool) internal _collectionWhitelist;

    constructor(
        address _bridgeAddress,
        address _L1SeedProviderAddress,
        address[] memory _facets
    ) {
        _bridge = _bridgeAddress;
        _L1SeedProvider = _L1SeedProviderAddress;


        // init facets
        // set facets
        poolFacets[FacetKey.FACET_ENTRY_POINT] = _facets[uint256(FacetKey.FACET_ENTRY_POINT)];
        poolFacets[FacetKey.FACET_PARAMS] = _facets[uint256(FacetKey.FACET_PARAMS)];
        poolFacets[FacetKey.FACET_REVEALS] = _facets[uint256(FacetKey.FACET_REVEALS)];
        poolFacets[FacetKey.FACET_BUYORDER_BOX] = _facets[uint256(FacetKey.FACET_BUYORDER_BOX)];

    }



    /// create a new Pool
    /// @param _nftOrderBatches  The "NFTBuyOrder"s that you want to include in the pool
    /// @dev Note that block.timestamp on L2 may behave differently than L1
    function newPool(
        NFTOrderBatch[] memory _nftOrderBatches
    ) external override returns (address boxPoolAddress) {

        // validate prameters
        {
            uint counts = 0; // total number of buyOrder in the pool
            uint totalValue = 0; // total value of the buyOrder in the pool

            for (uint i = 0; i < _nftOrderBatches.length; ++i) {

                NFTOrderBatch memory o = _nftOrderBatches[i];

                require(
                    isCollectionOnWhitelist(o.collection),
                    "Factory: collection not on whitelist"
                );

                require(
                    o.price > 0 && o.count > 0,
                    "Factory: invalid price or count"
                );

                counts += o.count; 
                totalValue += o.price * o.count;
            }


            require(
                counts > 0 && totalValue > 0 && counts < type(uint128).max && totalValue < type(uint128).max,
                "Factory: invalid counts or totalValue"
            );

        }

        // create a new box pool
        address pool = Clones.clone(poolFacets[IPoolTypes.FacetKey.FACET_ENTRY_POINT]);

        // init-1.1 => set all other facets 

        address[] memory facets = new address[](4); 
        facets[uint256(IPoolTypes.FacetKey.FACET_PARAMS)] = poolFacets[IPoolTypes.FacetKey.FACET_PARAMS];
        facets[uint256(IPoolTypes.FacetKey.FACET_REVEALS)] = poolFacets[IPoolTypes.FacetKey.FACET_REVEALS];
        facets[uint256(IPoolTypes.FacetKey.FACET_BUYORDER_BOX)] = poolFacets[IPoolTypes.FacetKey.FACET_BUYORDER_BOX];

        IPool(pool).initFacets(facets);

        // init-1.2 => call initializer 

        IPoolTypes.PoolParams memory params = IPoolTypes.PoolParams({
            nftOrderBatches: _nftOrderBatches,
            mintEndTime: block.timestamp + POOL_MINT_TIMEOUT,
            feeRate: FEE_RATE,
            creatorFeeShare: CREATOR_FEE_SHARE,
            poolID: _numPools,
            creator: msg.sender,
            protocolTreasury: owner(),
            bridge: _bridge,
            seedProvider: _L1SeedProvider
        });
        IPool(pool).initialize(params);
        

        // emit NewPoolCreated 
        emit NewPoolCreated(pool, msg.sender, _numPools++);

        return pool;
    }

    // only the collections on the whitelist can be used to create a pool

    /// @dev only the DAO can add or remove collections from the whitelist
    function addCollectionToWhitelist(address _collection) external onlyOwner{

        require(
            !isCollectionOnWhitelist(_collection),
            "Factory: collection already on whitelist"
        );

        _collectionWhitelist[_collection] = true;
    
        emit CollectionAddedToWhitelist(_collection);

    }

    /// @dev only the owner can set the facets 
    function setFacets(address[] memory _facets) external onlyOwner{

        require(
            _facets.length == 5,
            "Factory: invalid number of facets"
        );

        poolFacets[IPoolTypes.FacetKey.FACET_ENTRY_POINT] = _facets[0];
        poolFacets[IPoolTypes.FacetKey.FACET_PARAMS] = _facets[1];
        poolFacets[IPoolTypes.FacetKey.FACET_REVEALS] = _facets[2];
        poolFacets[IPoolTypes.FacetKey.FACET_BUYORDER_BOX] = _facets[3];

    }

    /// @dev only the DAO can add or remove collections from the whitelist
    function removeCollectionFromWhitelist(address _collection) external onlyOwner{
            
            require(
                isCollectionOnWhitelist(_collection),
                "Factory: collection not on whitelist"
            );
    
            _collectionWhitelist[_collection] = false;
        
            emit CollectionRemovedFromWhitelist(_collection);
    
    }

        /// @dev get the info of a box pool 
    function getPoolInfo(uint256 _poolID) external view returns (PoolParams memory){

        require(
            _poolID < _numPools,
            "Factory: invalid poolID"
        );

        return IPool(_pools[_poolID]).params();
    }
    

    /// @dev return the total number of box pools
    function numPool() external view returns(uint256){
        return _numPools;
    }


    /// @dev is a collection on the whitelist ?
    /// @param _collection  - address of the collection
    function isCollectionOnWhitelist(
        address _collection
    ) public view returns (bool) {
        return _collectionWhitelist[_collection];
    }

}

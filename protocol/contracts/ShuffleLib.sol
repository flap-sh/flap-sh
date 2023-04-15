// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;


/// @dev This library implements the "swap-or-not" shuffling algorithm.
/// @author flap.sh & github copilot
library ShuffleLib {


    /// @dev Compute the shuffled index 
    /// Imagine that the numbers from 0 to indexCount-1 are stored in "array A" in ascending order. 
    /// i.e, The length of "array A" is indexCount and the elements in it are: 0,1,2... indexCount-1. 
    /// We shuffle "array A" by using the seed as a source of randomness, we call the resulted array "shuffled array".
    /// You can "access" the "shuffled Array" with this function.
    /// ref: https://eth2book.info/bellatrix/part2/building_blocks/shuffling/
    /// @param index  Then index you want to access 
    /// @param indexCount The length of "array A" (it is also the length of "shuffled array")
    /// @param seed The seed used to shuffle "array A" 
    function computeShuffledIndex(uint256 index, uint256 indexCount, bytes32 seed) pure internal returns (uint256){

        require(index < indexCount, "index out of range");

        uint roundCount = getRoundCount(indexCount);
        
        for(uint i=0; i < roundCount; ++i){

            // The pivot is used to find the flip of the "index"
            uint pivot =  uint256(keccak256(abi.encodePacked(seed, i))) % indexCount;
            uint flip = (pivot + indexCount - index) % indexCount;

            uint position = index > flip ? index : flip; 

            // We should have a large bitmap with at least indexCount bits 
            // The "large bitmap" is sliced into several shards, each shard has 256 bits.
            uint source = uint256(keccak256(abi.encodePacked(
                    seed, // seed  
                    i, // round 
                    position / 256   // "shard"  
                    )));
            
            uint bit = (source >> (position % 256)) & 1; // "bit"

            index = (bit > 0)? flip: index;

        }

        return index; 

    }


    function getRoundCount(uint256 indexCount) pure internal returns (uint256 roundCount){

        // Vitalik says "Expert cryptographer advice told us 4log_2(N) is sufficient for safety

    
        roundCount = 0;

        while (indexCount != 0) {
            indexCount = indexCount >> 1;
            roundCount++;
        }

        return roundCount * 4;
        
    }
}
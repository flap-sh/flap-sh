// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "./interfaces/ISeedProvider.sol";
import "./ZKEVMBridgeHelper.sol";
import "./3rdparty/RLPReader.sol";

/// @title The seed provider provides the seed on L1 and send it to L2
/// @author
/// @notice
contract SeedProvider is ISeedProvider {

    using RLPReader for RLPReader.RLPItem;
    using RLPReader for RLPReader.Iterator;
    using RLPReader for bytes;

    /// @notice The total requests have been made, it is also the id of the next request
    uint256 public totalRequests;

    /// @dev mapping from request id to SeedRequest
    mapping(uint256 => SeedRequest) public requests;

    /// The minimum lookahead block numbers
    uint256 public constant MIN_LOOKAHEAD_BLOCK_NUMBER = 4 * 32 + 4;

    /// @dev PolygonZkEVM Bridge on L1
    IPolygonZkEVMBridge public bridge;


    constructor(address _bridge) {
        bridge = IPolygonZkEVMBridge(_bridge);
    }

    /// @dev When you call requestSeed, a "SeedRequest" will be stored in this contract.
    /// Besides, a message including the request id will be sent to the L2 side.
    ///
    /// Anyone can request a seed for any L2 contract.
    /// But the L2 contract may refuse to accept the seed.
    ///
    /// @param _receiver - L2 address of the receiver
    function requestSeed(address _receiver) external returns (uint256) {

        uint256 requestID = totalRequests++;

        // save the request
        requests[requestID].targetBlockNumber =
            block.number +
            MIN_LOOKAHEAD_BLOCK_NUMBER;
        requests[requestID].l2Receiver = _receiver;


        // encode the message
        bytes memory message = abi.encode(
            MessageEnvelope(
                MessageType.MSG_TYPE_REVEAL_SEED_REQUEST,
                abi.encode(
                    RevealSeedRequestMsg(
                        block.number,
                        block.timestamp,
                        requestID
                    )
                )
            )
        );

        // send message to L2 side
        ZKEVMBridgeHelper.sendMessageFromL1ToL2(
            IPolygonZkEVMBridge(bridge),
            _receiver,
            message
        );


        // emit event
        emit SeedRequested(requestID, requests[requestID].targetBlockNumber, _receiver);

        return requestID;
    }


    /// @dev Submit the randao reveal of a request.
    ///      - This function verifies the randao reveal with supplied block header.
    ///      - If the verification is successful, the seed will be sent to the L2 side.
    /// learn more:  https://www.paradigm.xyz/2023/01/eth-rng
    ///
    /// @param  _requestID    request id)
    /// @param _randaoReveal  randao reveal
    /// @param _rlpBlock  the rlp encoding of the block header
    function sendSeedToL2(uint256 _requestID, bytes32 _randaoReveal, bytes memory _rlpBlock) external{

        // check if the request exists
        require(requests[_requestID].targetBlockNumber != 0, "SeedProvider: request not found");

        // check if the target block number is reached
        require(block.number >= requests[_requestID].targetBlockNumber, "SeedProvider: target block number not reached");

        // check if the request has been sent
        require(!requests[_requestID].sent, "SeedProvider: request already sent");

        bytes32 expectedBlockHash = blockhash(requests[_requestID].targetBlockNumber);

        require(expectedBlockHash != bytes32(0), "SeedProvider: blockhash not available");

        // verify the randao reveal 
        _verifyRandaoRevealWithHash(
            expectedBlockHash,
            _randaoReveal,
            _rlpBlock
        );


        requests[_requestID].sent = true; // mark the request as delivered

        // send the seed to L2
        bytes memory message = abi.encode(
            MessageEnvelope(
                MessageType.MSG_TYPE_REVEAL_SEED_DELIVERY,
                abi.encode(
                    RevealSeedDeliveryMsg(
                        requests[_requestID].targetBlockNumber,
                        _requestID,
                        _randaoReveal
                    )
                )
            )
        );

        ZKEVMBridgeHelper.sendMessageFromL1ToL2(
            IPolygonZkEVMBridge(bridge),
            requests[_requestID].l2Receiver,
            message
        );

        // mark the request as delivered
        requests[_requestID].sent = true;

        // emit event  
        emit SeedSentToL2(_requestID, _randaoReveal, requests[_requestID].l2Receiver);
    }



    /// @dev verify the randao reveal of a block 
    ///      ref: https://www.paradigm.xyz/2023/01/eth-rng
    /// 
    /// @param _blockHash  the hash of the block header
    /// @param _randaoReveal  the randao reveal
    /// @param _rlpBlock  the rlp encoding of the block header
    function _verifyRandaoRevealWithHash(bytes32 _blockHash, bytes32 _randaoReveal, bytes memory _rlpBlock) pure internal{

            // verify that the RLP encoded block matches with the provided block number
            bytes32 actualHash = keccak256(_rlpBlock);
            require(actualHash == _blockHash, "block hash mismatch");

            RLPReader.RLPItem[] memory items =_rlpBlock.toRlpItem().toList();

            // Header Fields: 
            //     ParentHash  common.Hash    
            //     UncleHash   common.Hash    
            //     Coinbase    common.Address 
            //     Root        common.Hash    
            //     TxHash      common.Hash    
            //     ReceiptHash common.Hash    
            //     Bloom       Bloom          
            //     Difficulty  *big.Int   [7]  => This is zero post the Merge
            //     Number      *big.Int   [8]  => block number
            //     GasLimit    uint64         
            //     GasUsed     uint64         
            //     Time        uint64         
            //     Extra       []byte         
            //     MixDigest   common.Hash  [13]  => This is the randao reveal post the Merge
            //     Nonce       BlockNonce     
            //     BaseFee *big.Int    
            //
            // After Shanghai.... 
            //     withdrawalsRoot   

            require(items[7].toUint() == 0, "difficulty should be zero");

            require(bytes32(items[13].toUint()) == _randaoReveal, "randao reveal mismatch");
    }



}

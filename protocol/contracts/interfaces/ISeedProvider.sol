// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "./ICrossChainMessages.sol";

/// @title Seed Provider Interface
/// @author flap.sh & github copilot 
/// @notice The seed provider is responsible for providing random seeds to the L2 side.
interface ISeedProvider is ICrossChainMessages {
    /// A "seed request" is a request for a future randao reveal.
    /// A "seed request" has a "target block number", in which the
    /// randao reveal is retrieved from.
    struct SeedRequest {
        uint256 targetBlockNumber;
        address l2Receiver;
        bool    sent;
    }

    /// @dev When you call requestSeed, a "SeedRequest" will be stored in this contract.
    /// Besides, a message including the request id will be sent to the L2 side.
    ///
    /// The L2 side should remember the request id. 
    /// 
    /// @param _receiver - L2 address of the receiver
    function requestSeed(address _receiver) external returns (uint256);

    /// @dev Submit the randao reveal of a request.
    ///      - This function verifies the randao reveal with supplied rlp encoded block header.
    ///      - If the verification is successful, the seed will be sent to the L2 side.
    /// 
    /// learn more:  https://www.paradigm.xyz/2023/01/eth-rng
    ///
    /// @param  _requestID    request id
    /// @param _randaoReveal  randao reveal
    /// @param _rlpBlock  the rlp encoding of the block header
    function sendSeedToL2(uint256 _requestID, bytes32 _randaoReveal, bytes memory _rlpBlock) external;

    // events

    /// @dev Emitted when a seed request is submitted
    /// @param _requestID - request id
    /// @param _targetBlockNumber - target block number
    /// @param _l2Receiver - L2 address of the receiver
    event SeedRequested(uint256 _requestID, uint256 _targetBlockNumber, address _l2Receiver);

    /// @dev Emitted when a seed is sent to L2
    /// @param _requestID - request id
    /// @param _seed - seed
    /// @param _l2Receiver - L2 address of the receiver
    event SeedSentToL2(uint256 _requestID, bytes32 _seed, address _l2Receiver);
}

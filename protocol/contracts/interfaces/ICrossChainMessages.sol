// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

interface ICrossChainMessages {
    enum MessageType {
        MSG_TYPE_NFT_BRIDGE_L1ToL2, // bridge NFT from L1 to L2
        MSG_TYPE_NFT_BRIDGE_L2ToL1, // bridge NFT from L2 to L1
        MSG_TYPE_NFT_BRIDGE_ENABLE_COLLECTION, // enable collection to be bridged from L1 to L2
        MSG_TYPE_REVEAL_SEED_REQUEST, // request to reveal the seed
        MSG_TYPE_REVEAL_SEED_DELIVERY // deliver the seed
    }

    struct MessageEnvelope {
        MessageType messageType;
        bytes data; // abi encoding of the message
    }

    // MSG_TYPE_NFT_BRIDGE_L1ToL2
    struct NFTBridgeMsgL1ToL2 {
        uint256 id;
        address collection; // the address of the collection on L1
        address receiver;
    }

    // MSG_TYPE_NFT_BRIDGE_L2ToL1
    struct NFTBridgeMsgL2ToL1 {
        uint256 id;
        address collection; // the address of the collection on L1
        address receiver;
    }

    // MSG_TYPE_NFT_BRIDGE_ENABLE_COLLECTION
    struct NFTBridgeMsgEnableCollection {
        string symbol;
        string name;
        address collection; // the address of the collection on L1
    }

    // MSG_TYPE_REVEAL_SEED_REQUEST
    struct RevealSeedRequestMsg {
        uint256 l1BlockNumber; // The block number that the seed is requested
        uint256 l1BlockTimestamp; // The block timestamp that the seed is requested
        uint256 requestID; // The request ID
    }

    // MSG_TYPE_REVEAL_SEED_DELIVERY
    struct RevealSeedDeliveryMsg {
        uint256 l1SeedBlockNumber; // The block number that the seed is generated
        uint256 requestID;
        bytes32 seed;
    }
}

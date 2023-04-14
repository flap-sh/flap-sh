// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

import "./polygon/IPolygonZKEVMBridge.sol";

library ZKEVMBridgeHelper {
    uint32 public constant L1_NETWORK_ID = 0;
    uint32 public constant L2_NETWORK_ID = 1;

    /// @dev - send message from L1 to L2
    /// @param _bridge  - PolygonZkEVM Bridge on L1
    /// @param _target  - target contract address
    /// @param _data    - data to be sent to the target contract
    function sendMessageFromL1ToL2(IPolygonZkEVMBridge _bridge, address _target, bytes memory _data) internal {
        _bridge.bridgeMessage(L2_NETWORK_ID, _target, true, _data);
    }

    ///   @dev - send message from L2 to L1
    ///   @param _bridge  - PolygonZkEVM Bridge on L2
    ///   @param _target  - target contract address
    ///   @param _data    - data to be sent to the target contract
    function sendMessageFromL2ToL1(IPolygonZkEVMBridge _bridge, address _target, bytes memory _data) internal {
        _bridge.bridgeMessage(L1_NETWORK_ID, _target, true, _data);
    }
}

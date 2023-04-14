// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;

interface IBasePolygonZkEVMGlobalExitRoot {
    /**
     * @dev Thrown when the caller is not the allowed contracts
     */
    error OnlyAllowedContracts();

    function updateExitRoot(bytes32 newRollupExitRoot) external;

    function globalExitRootMap(bytes32 globalExitRootNum) external view returns (uint256);

    function getLastGlobalExitRoot() external view returns (bytes32);
}

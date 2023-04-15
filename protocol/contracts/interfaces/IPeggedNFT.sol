// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;


import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";


/// @title  Pegged NFT Interface 
/// @author flap.sh & github copilot
/// @notice This is an NFT on L2, which represents an NFT bridged from L1
interface IPeggedNFT is IERC721MetadataUpgradeable {
    
    function initialize(string memory _name, string memory _symbol) external;

    /// mint
    /// @dev - only the  NFTBRidgeL2Endpoint can call this function
    /// @param _to   - address of the receiver
    /// @param _id   - id of the NFT
    function mint(address _to, uint256 _id) external;

    /// burn
    /// @dev - only the  NFTBRidgeL2Endpoint can call this function
    ///      - revert if the _who does not have the permission to burn the NFT
    /// @param _who - address of the owner
    /// @param _id  - id of the NFT
    function burn(address _who, uint256 _id) external;

    // events

    /// @dev Emitted when a NFT is minted
    /// @param _to   - address of the receiver
    /// @param _id   - id of the NFT
    event Mint(address _to, uint256 _id);

    /// @dev Emitted when a NFT is burned
    /// @param _who  - address of the owner
    /// @param _id   - id of the NFT
    event Burn(address _who, uint256 _id);
}

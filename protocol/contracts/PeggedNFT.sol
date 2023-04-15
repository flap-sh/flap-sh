// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;


import "./interfaces/IPeggedNFT.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


/// @title A PeggedNFT represents an NFT on L2, which is bridged from L1 
contract PeggedNFT is ERC721Upgradeable,IPeggedNFT,OwnableUpgradeable {

    /// The initialize function is called only once by the NFTBRidgeL2Endpoint
    function initialize(string memory _name, string memory _symbol) external initializer{
        __Ownable_init();
        __ERC721_init(_catString(_name,"-bridged"), _catString(_symbol,"-bridged"));
    }

    /// mint
    /// @dev - only the  NFTBRidgeL2Endpoint can call this function
    /// @param _to   - address of the receiver
    /// @param _id   - id of the NFT
    function mint(address _to, uint256 _id) external onlyOwner{
        _mint(_to, _id);
        emit Mint(_to, _id);
    }

    /// burn
    /// @dev - only the  NFTBRidgeL2Endpoint can call this function
    ///      - revert if the _who does not have the permission to burn the NFT
    /// @param _who - address of the owner
    /// @param _id  - id of the NFT
    function burn(address _who, uint256 _id) external onlyOwner {
        require(_isApprovedOrOwner(_who,_id), "PeggedNFT: burn: not owner");
        _burn(_id);
        emit Burn(_who, _id);
    }


    // @copilot a helper function to concatenate two strings
    function _catString(
        string memory _a,
        string memory _b
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(_a, _b));
    }

}
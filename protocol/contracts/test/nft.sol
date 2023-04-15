// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.17;


import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract TestNFT is ERC721Upgradeable, OwnableUpgradeable {

    uint256 public totalSupply;

    constructor(string memory _name, string memory _symbol) initializer {
        __ERC721_init(_name, _symbol);
        __Ownable_init();
    }

    function mint(address _to) onlyOwner public {
        _mint(_to, totalSupply++);
    }

    function mintMulti(address _to, uint256 _amount) onlyOwner public {
        for (uint256 i = 0; i < _amount; i++) {
            _mint(_to, totalSupply++);
        }
    }

}
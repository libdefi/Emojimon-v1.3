// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardNFT is ERC721, Ownable {
    mapping(address => bool) public allowList;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function addToAllowList(address user) public onlyOwner {
        allowList[user] = true;
    }

    function isInAllowList() public view returns (bool) {
        return allowList[msg.sender];
    }

    function mint(address to, uint256 tokenId) public {
        require(allowList[msg.sender], "Sender is not allowed to mint");
        _safeMint(to, tokenId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyToken is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    //string[] private uris;

    string public baseURI;
    string public unrevealedURI;
    //string public baseExtension = ".json";
    uint256 public cost = 0.05 ether;
    uint256 public maxSupply = 5000;
    uint256 public maxMintAmount = 20;
    bool public paused = false;
    bool public revealed = false;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        string memory _unrevealedURI
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        setUnrevealedURI(_unrevealedURI);
        safeMint(5);
    }
    
    function safeMint(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        require(supply + _mintAmount <= maxSupply);

        if(msg.sender != owner()) {
            require(msg.value >= cost * _mintAmount);
        }

        for(uint256 i = 0; i < _mintAmount; ++i) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, unrevealedURI);
        }
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory) 
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for(uint256 i; i < ownerTokenCount; ++i) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function getCost() public view returns (uint256) {
        return cost;
    }

    // onlyOwner functions

    function reveal(string[] memory arr) public onlyOwner {
        require(!revealed);
        revealed = true;
        pause(true);
        for(uint256 i = 0; i < totalSupply(); ++i) {
            _setTokenURI(i, arr[i]);
        }
    }

    function setCost(uint256 _cost) public onlyOwner {
        cost = _cost;
    }

    function setMaxMinAmount(uint _maxMintAmount) public onlyOwner {
        maxMintAmount = _maxMintAmount;
    }

    function setUnrevealedURI(string memory _unrevealedURI) public onlyOwner {
        unrevealedURI = _unrevealedURI;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
    
    // internal

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) onlyOwner {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
}


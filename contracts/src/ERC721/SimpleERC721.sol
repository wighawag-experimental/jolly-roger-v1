// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.7.1;

import "./ERC721Base.sol";

contract SimpleERC721 is ERC721Base {
    uint256 _lastId;

    function tokenURI(uint256 tokenId) external pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    'data:text/plain,{"name":"wighawag","description":"wighawag","image":"data:image/bmp;base64,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"}'
                )
            );
    }

    function symbol() external pure returns (string memory) {
        return "SIMPLE";
    }

    function name() external pure returns (string memory) {
        return "SIMPLE ERC721";
    }

    /// @notice Check if the contract supports an interface.
    /// 0x01ffc9a7 is ERC-165.
    /// 0x80ac58cd is ERC-721
    /// 0x5b5e139f is ERC-721 Metadata (tokenURI, symbol, name)
    /// @param id The id of the interface.
    /// @return Whether the interface is supported.
    function supportsInterface(bytes4 id) public pure virtual override returns (bool) {
        return id == 0x01ffc9a7 || id == 0x80ac58cd || id == 0x5b5e139f;
    }

    function mint() external {
        uint256 id = _lastId++;
        _mint(msg.sender, id);
    }
}

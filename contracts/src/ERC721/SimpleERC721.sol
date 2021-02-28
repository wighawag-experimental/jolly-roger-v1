// SPDX-License-Identifier: AGPL-1.0
pragma solidity 0.7.1;

import "./ERC721Base.sol";

contract SimpleERC721 is ERC721Base {
    uint256 _lastId;

    function mint() external {
        uint256 id = _lastId++;
        _mint(msg.sender, id);
    }
}

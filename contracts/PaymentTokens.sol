// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PaymentToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("PaymentToken", "PTKN") {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function decimals() public view override  virtual returns (uint8) {
        return 0;
    }
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UserWallet {
    address public owner;
    address public companyWallet;
    address public tokenAddress;
    uint256 public lastPaymentTime;
    uint256 public dueDate;
    bool public isActive;
    // uint256 public monthlyAmount = 100 * 10 ** 18; // Example: 100 tokens

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyCompany() {
        require(msg.sender == companyWallet, "Only company can deduct payment");
        _;
    }

    constructor(address _owner, address _companyWallet, address _tokenAddress) {
        owner = _owner;
        companyWallet = _companyWallet;
        tokenAddress = _tokenAddress;
        isActive=true;
        dueDate = block.timestamp;
    }

    function deposit(uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
    }

    function cancelSubsctiption()external onlyOwner{
        isActive=false;
    }

    function payMonthlyFee(uint monthlyAmount) external onlyCompany {
        require(isActive,"subscription cancelled or not taken");
        require(block.timestamp >= lastPaymentTime + 30 days, "Payment already made this month");

        IERC20 token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= monthlyAmount, "Insufficient token balance");

        lastPaymentTime = block.timestamp;
        dueDate += 30 days;
        token.transfer(companyWallet, monthlyAmount);
    }

    function withdraw(uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner, amount);
    }

    function getBalance() external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}

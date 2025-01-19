// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UserWallet.sol";

contract WalletFactory {
    mapping(address => address) public userWallets;
    address public companyWallet;
    address public tokenAddress;

    event WalletCreated(address indexed user, address indexed wallet);

    constructor(address _companyWallet, address _tokenAddress) {
        companyWallet = _companyWallet;
        tokenAddress = _tokenAddress;
    }

    function createWallet() external {
        require(userWallets[msg.sender] == address(0), "Wallet already exists");

        UserWallet newWallet = new UserWallet(msg.sender, companyWallet, tokenAddress);
        userWallets[msg.sender] = address(newWallet);

        emit WalletCreated(msg.sender, address(newWallet));
    }

    function getWalletAddress(address user) external view returns (address) {
        return userWallets[user];
    }
}

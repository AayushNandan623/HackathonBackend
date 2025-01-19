const express = require("express");
const cron = require("node-cron");
const User = require("../models/User.js");
const { ethers } = require("ethers");

const walletFactoryAddress = "0xfc918e603cF84f18f4d19685e01fdc5b46FcF58A";
const walletFactoryABI = [
  {
    inputs: [],
    name: "createWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_companyWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "WalletCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "companyWallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getWalletAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userWallets",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const userWalletABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_companyWallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "cancelSubsctiption",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "companyWallet",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dueDate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isActive",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastPaymentTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "monthlyAmount",
        type: "uint256",
      },
    ],
    name: "payMonthlyFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const paymentTokenAddress = "0x623B95d8fe3CbDF0164ECb243f095045F925Ae3a";
const companyAddress = "0x4689520E1cDeCC43EcbB0789364Ab8427550c5e6";
const deployer = "0x47b91A7A5Fb6756837a0A94edB54f9a6B63673F9";
const customerAddress = "0x0b35C3575833BDb9804cA18F210148494Db5DD72";

const router = express.Router();

// Initialize provider and wallet
const provider = new ethers.providers.JsonRpcProvider(
  "https://evmtestnet.confluxrpc.com"
);

const adminWallet = new ethers.Wallet(adminPrivateKey, provider);

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily subscription check...");
  try {
    const now = new Date();
    const users = await User.find();

    for (const user of users) {
      if (!user.validUntil || user.validUntil < now) {
        const userWalletContract = new ethers.Contract(
          user.address,
          userWalletABI,
          adminWallet // Use admin wallet to send transactions
        );

        try {
          // Send transaction to pay subscription fee
          const tx = await userWalletContract.paySubscriptionFee(
            
          );

          console.log(
            `Charged subscription fee for user: ${user.address}`
          );
          await tx.wait(); // Wait for transaction confirmation

          // Update the validUntil date
          const newValidUntil = new Date();
          newValidUntil.setDate(newValidUntil.getDate() + 30);

          user.validUntil = newValidUntil;
          await user.save();
        } catch (error) {
          console.error(
            `Failed to charge user: ${user.address}, ${error.message}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in daily subscription check:", error.message);
  }
});

router.post("/autoPay", async (req, res) => {
  try {
    const now = new Date();
    const users = await User.find();

    for (const user of users) {
      if (!user.validUntil || user.validUntil < now) {
        const userWalletContract = new ethers.Contract(
          user.address,
          userWalletABI,
          adminWallet
        );

        try {
          // Send transaction to pay subscription fee
          const tx = await userWalletContract.paySubscriptionFee(
          
          );

          console.log(
            `Charged subscription fee for user: ${user.address}`
          );
          await tx.wait(); // Wait for transaction confirmation

          // Update the validUntil date
          const newValidUntil = new Date();
          newValidUntil.setDate(newValidUntil.getDate() + 30);

          user.validUntil = newValidUntil;
          await user.save();
        } catch (error) {
          console.error(
            `Failed to charge user: ${user.address}, ${error.message}`
          );
        }
      }
    }
    res.status(200).json({ message: "Subscription check completed manually" });
  } catch (error) {
    console.error("Error in manual subscription check:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


let provider, signer, walletFactory, userWallet,userWalletAddress;

async function createUserACC(){
    userWalletAddress =await walletFactory.getWalletAddress("0x0b35C3575833BDb9804cA18F210148494Db5DD72")
        userWallet = new ethers.Contract(userWalletAddress,userWalletABI,signer);
}
document.getElementById("connectButton").addEventListener("click", async () => {
    try {
        if (window.ethereum) {
            provider = new ethers.BrowserProvider(window. ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            signer = await provider.getSigner();

            document.getElementById("output").innerText = `Connected: ${await signer.getAddress()}`;
            walletFactory = new ethers.Contract(walletFactoryAddress, walletFactoryABI, signer);
            // await getWalletAddress();
        } else {
            alert("Please install MetaMask!");
        }
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "Error connecting wallet.";
    }
});



document.getElementById("createWalletButton").addEventListener("click", async () => {
    try {
        const tx = await walletFactory.createWallet();
        await tx.wait();

        document.getElementById("output").innerText = `Wallet created! Transaction Hash: ${tx.hash}`;
        userWalletAddress =await walletFactory.getWalletAddress(await signer.getAddress())
        userWallet = new ethers.Contract(userWalletAddress,userWalletABI,signer);

    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "Error creating wallet.";
    }
});

document.getElementById("getWalletAddressButton").addEventListener("click", async () => {
    try {
        const userAddress = await signer.getAddress();
        const walletAddress = await walletFactory.getWalletAddress(userAddress);

        if (walletAddress =="0x0000000000000000000000000000000000000000") {
            document.getElementById("output").innerText = "No wallet found for this user.";
        } else {
            document.getElementById("output").innerText = `Your Wallet Address: ${walletAddress}`;
            userWallet = new ethers.Contract(walletAddress, userWalletABI, signer);
            // console.log(userWallet)
        }
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "Error fetching wallet address.";
    }
});

// document.getElementById("depositButton").addEventListener("click", async () => {
//     try {
//         const amount = prompt("Enter the amount of tokens to deposit:");
//         const tx = await userWallet.deposit(ethers.utils.parseUnits(amount, 18));
//         await tx.wait();

//         document.getElementById("output").innerText = `Deposited ${amount} tokens successfully.`;
//     } catch (error) {
//         console.error(error);
//         document.getElementById("output").innerText = "Error depositing tokens.";
//     }
// });

document.getElementById("withdrawButton").addEventListener("click", async () => {
    try {
        const amount = prompt("Enter the amount of tokens to withdraw:");
        const tx = await userWallet.withdraw(amount);
        await tx.wait();

        document.getElementById("output").innerText = `Withdrew ${amount} tokens successfully.`;
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "Error withdrawing tokens.";
    }
});

document.getElementById("cancelSubscriptionButton").addEventListener("click", async () => {
    try {
        const tx = await userWallet.cancelSubsctiption();
        await tx.wait();

        document.getElementById("output").innerText = "Subscription canceled successfully.";
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "Error canceling subscription.";
    }
});

document.getElementById("payMonthlyFeeButton").addEventListener("click", async () => {
    try {
        const monthlyAmount = prompt("Enter the monthly fee amount:");
        const tx = await userWallet.payMonthlyFee(monthlyAmount);
        await tx.wait();

        document.getElementById("output").innerText = `Monthly fee of ${monthlyAmount} tokens paid successfully.`;
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "Error paying monthly fee.";
    }
});

document.getElementById("getBalanceButton").addEventListener("click", async () => {
    try {
        console.log(userWallet)
        const balance = await userWallet.getBalance();
        document.getElementById("output").innerText = `Wallet Balance: ${balance} tokens.`;
    } catch (error) {
        console.error(error);
        document.getElementById("output").innerText = "Error fetching wallet balance.";
    }
});

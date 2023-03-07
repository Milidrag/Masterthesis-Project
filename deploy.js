const ethers = require("ethers");
const fs = require("fs-extra");
require('dotenv').config();


async function main() {
    //compile them in our code 
    //compile them separately 
    //http://0.0.0.0:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_GANACHE);
    const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY_GANACHE_BOB,
        provider
    );
    const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");
    const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy(); // STOP here! Wait for contract to deploy
    const transactionReceipt = await contract.deployTransaction.wait(1);
    console.log("Here is the deployment transaction (transaction response): ");
    console.log(transactionReceipt);
    console.log("Here is the contract address: " + contract.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
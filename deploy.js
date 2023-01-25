const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
    //compile them in our code 
    //compile them separately 
    //http://0.0.0.0:7545
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(
        "0c34e1f54d39a6bdab4096df4b3af227995bc981c7d6989e69dd19f2d6df9798",
        provider
    );
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.deploy(); // STOP here! Wait for contract to deploy
    const transactionReceipt = await contract.deployTransaction.wait(1);
    console.log("Here is the deployment transaction (transaction response): ")
    console.log(contract.deployTransaction);
    console.log("Here is the transcation receipt: ");
    console.log(transactionReceipt);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
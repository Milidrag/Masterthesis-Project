const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
    //compile them in our code 
    //compile them separately 
    //http://0.0.0.0:7545
    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
    const wallet = new ethers.Wallet(
        "57706c2256741b7b7c864828765611ed181edc6c84be23820a5bba08c388f1fc",
        provider
    );
    const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");
    const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");

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
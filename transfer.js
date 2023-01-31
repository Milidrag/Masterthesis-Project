const ethers = require("ethers");
const fs = require("fs-extra");
require('dotenv').config();


async function main() {
    //compile them in our code 
    //compile them separately 
    //http://0.0.0.0:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
    const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY,
        provider
    );
    const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");
    const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.attach(
        process.env.CONTRACT_ADDRESS
    ); // STOP here! Wait for contract to deploy
    console.log("Here is the deployment transaction (transaction response): ")
    const result = await contract.store("test");
    console.log(result);
    console.log("new-------------");

    const nonce = await wallet.getTransactionCount();
    const tx = await contract.transfer({
        value: ethers.utils.parseUnits("1", "ether")
    });



    console.log(tx);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
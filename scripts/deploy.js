const hre = require("hardhat");

//deploy to polygon mainnet
async function main() {

    const Storage = await hre.ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();

    await storage.deployed();

    console.log("Here is the contract address: " + storage.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {

    const SimpleStorage = await ethers.getContractFactory("Storage");
    const contract = await SimpleStorage.attach(
        "0x2fba9ff0D2a46Be7bC3869f8b2143269364598bD" // The deployed contract address
    );

    // Now you can call functions of the contract
    result = await contract.transfer({
        value: ethers.utils.parseUnits("1", "ether")
    });

    console.log(result);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

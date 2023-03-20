const { ethers } = require("hardhat")

describe("Gas cost measurement for store function", function () {
    let storageFactory, storage
    beforeEach(async function () {
        storageFactory = await ethers.getContractFactory("Storage")
        storage = await storageFactory.deploy()
    })
    it("Gas cost measurement for store function", async function () {
        const iotData = JSON.stringify({
            "Axis-X": 1067,
            "Axis-Y": 1670,
            "Axis-Z": 1179
        });

        // Measure gas cost of store function
        const startTime = Date.now();
        const tx = await storage.store(iotData);
        const receipt = await tx.wait();
        const duration = Date.now() - startTime;

        console.log("Gas used for store function:", receipt.gasUsed.toString());
        console.log("Duration of store function:", duration.toString(), "ms");
    });
})
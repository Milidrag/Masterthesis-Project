const { expect } = require("chai");
const hre = require("hardhat");

describe("Gas cost measurement for store function", function () {
  it("Should measure gas cost of store function", async function () {
    const Storage = await hre.ethers.getContractFactory("Storage");
    const storage = await Storage.deploy();

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
});

const { ethers } = require("hardhat")
const { INFURA_PROJECT_ID, INFURA_API_SECRET, CONTRACT_ADDRESS_POLYGON_MAINNET } = process.env;


describe("Gas cost measurement", function () {
    let storageFactory, storage, hashOldData, client, ipfsData

    it("Should create a client connection", async function () {
        const { create } = await import('ipfs-http-client')

        client = await create(
            {
                host: "ipfs.infura.io",
                port: 5001,
                protocol: "https",
                headers: {
                    "Authorization": `Basic ${Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_API_SECRET).toString("base64")}`
                }
            })
    })

    it("Should deploy contract", async function () {  //want to deploy only once
        storageFactory = await ethers.getContractFactory("Storage")
        storage = await storageFactory.attach(CONTRACT_ADDRESS_POLYGON_MAINNET);

    })

    it("Should store content on IPFS and take hash", async function () {

        const iotData = JSON.stringify([{
            "Axis-X": 1067,
            "Axis-Y": 1670,
            "Axis-Z": 1179
        }]);

        await client.add(iotData).then(async (res) => {
            console.log("Sending new hash to contract...")
            console.log(res)
            const startSetHash = Date.now();
            const tx = await storage.setHash(res.path)
            const endSetHash = Date.now()
            const receipt = await tx.wait();
            const duration = endSetHash - startSetHash

            console.log("Gas used for sendHash function:", receipt.gasUsed.toString());
            console.log("Duration of sendHash function:", duration.toString(), "ms");
        });
    })


    it("Should measure gas cost of transfer function", async function () {

        // Measure gas cost of store function
        const startTime = Date.now();
        const tx = await storage.transfer({
            value: hre.ethers.utils.parseUnits("0.001", "ether"),
        });
        const receipt = await tx.wait();
        const duration = Date.now() - startTime;


        console.log("Gas used for transfer function:", receipt.gasUsed.toString());
        console.log("Duration of transfer function:", duration.toString(), "ms");

    });
})
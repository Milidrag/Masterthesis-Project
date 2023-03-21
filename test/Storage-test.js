const { ethers } = require("hardhat")
const { INFURA_PROJECT_ID, INFURA_API_SECRET } = process.env;
const fs = require("fs");


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
        storage = await storageFactory.deploy()
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
            const tx = await storage.sendHash(res.path)
            const endSetHash = Date.now()
            const receipt = await tx.wait();
            const duration = endSetHash - startSetHash

            console.log("Gas used for sendHash function:", receipt.gasUsed.toString());
            console.log("Duration of sendHash function:", duration.toString(), "ms");
        });
    })

    it("Should get hash from contract", async function () {
        const startGetHash = Date.now();
        hashOldData = await storage.getHash();
        const endGetHash = Date.now()
        const duration = endGetHash - startGetHash;

        console.log("Duration of getHash function:", duration.toString(), "ms");
    })

    it("Should get data from IPFS", async function () {
        const ipfsObject = await client.get(hashOldData)
        // loop over incoming data
        let contents = ""
        for await (const item of ipfsObject) {
            // turn string buffer to string and append to contents
            contents += new TextDecoder().decode(item)
        }

        // remove null characters
        contents = contents.replace(/\0/g, "")
        ipfsData = JSON.parse(contents.substring(contents.indexOf('['))) //find array and construct a substring

    })

    it("Should concat data", async function () {
        const iotDataNew = {
            "Axis-X": 1578,
            "Axis-Y": 1227,
            "Axis-Z": 431
        };

        ipfsData.push(iotDataNew)
    })

    it("Should send the concat data to IPFS", async function () {
        await client.add(JSON.stringify(ipfsData)).then(async (res) => {
            console.log("Sending new hash to contract...")
            console.log(res)
            const startSetHash = Date.now();
            const tx = await storage.sendHash(res.path)
            const endSetHash = Date.now()
            const receipt = await tx.wait();
            const duration = endSetHash - startSetHash

            console.log("Gas used for sendHash function with concat data:", receipt.gasUsed.toString());
            console.log("Duration of sendHash function with concat data:", duration.toString(), "ms");
        });
    })
})
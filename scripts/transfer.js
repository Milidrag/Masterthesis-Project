const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
const hre = require("hardhat"); //use ether library to interact with the BC
const fs = require("fs-extra");
require('dotenv').config();
const fetch = require("node-fetch");


const { API_KEY_POLYGON_MAINNET, PRIVATE_KEY_POLYGON_MAINNET_MILO, TRANSFER_SC_FUNCTION, INFURA_PROJECT_ID, INFURA_API_SECRET, CONTRACT_ADDRESS_POLYGON_MAINNET } = process.env;
const settings = {
    apiKey: API_KEY_POLYGON_MAINNET,
    network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);
const wallet = new Wallet(PRIVATE_KEY_POLYGON_MAINNET_MILO, alchemy);



async function main(contract) {
    jsonString = fs.readFileSync("./data.json", "utf-8");
    jsonStringFirst = JSON.parse(jsonString)[0];

    console.log("Start creating connection to IPFS client...")
    //IPFS start
    const { create } = await import('ipfs-http-client')
    const client = await create(
        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
                "Authorization": `Basic ${Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_API_SECRET).toString("base64")}`
            }
        })

    console.log("IPFS client Connection established")

    console.log("Start calling getHash-Function...")
    //take the hash from the contract and call with the client the data
    const startGetHash = Date.now();
    const hashOldData = await contract.getHash();
    const endGetHash = Date.now()
    const durationGetHash = endGetHash - startGetHash;
    console.log("Writing duration of calling getHash function inside duration-GET-HASH.txt...")
    fs.appendFile("./duration-GET-HASH.txt", durationGetHash.toString() + "\n", err => {     //writing duration to file
        if (err) {
            s
            console.log(err)
        }
    })

    // create a string to append contents to
    let contents = ""
    console.log("here")
    console.log(hashOldData)
    if (hashOldData.length > 2) {
        console.log("Get IPFS data with the hash stored on the SC...")
        const startGetHashFromIpfs = Date.now();
        const ipfsObject = await client.get(hashOldData)
        const endGetHashFromIpfs = Date.now();
        const durationGetHashFromIpfs = endGetHashFromIpfs - startGetHashFromIpfs;
        console.log("Writing duration of getting hash from ipfs inside duration-GET-HASH-FROM-IPFS.txt...")
        fs.appendFile("./duration-GET-HASH-FROM-IPFS.txt", durationGetHashFromIpfs.toString() + "\n", err => {     //writing duration to file
            if (err) {
                console.log(err)
            }
        })

        // loop over incoming data
        for await (const item of ipfsObject) {
            // turn string buffer to string and append to contents
            contents += new TextDecoder().decode(item)
        }

        // remove null characters
        contents = contents.replace(/\0/g, "")
    }

    console.log("Constructing new data for IPFS...")


    //concat old values with jsonStringFirst
    let jsonArray = []
    console.log("concat..")
    if (contents.length > 2) { //in case a new contract is deployed and the hash value is empty
        const ipfsData = JSON.parse(contents.substring(contents.indexOf('['))) //find array and construct a substring
        ipfsData.push(jsonStringFirst) //push new value to exisiting array
        jsonArray = ipfsData //assign to 
    } else {
        jsonArray.push(jsonStringFirst)
    }

    console.log("Sending data to IPFS...")
    //send data
    await client.add(JSON.stringify(jsonArray)).then(async (res) => {
        //here I have to call the contract and send the hash
        console.log("Sending new hash to contract...")
        console.log(res)
        const startSetHash = Date.now();
        transactionReceiptSetHash = await contract.setHash(res.path)
        const endSetHash = Date.now()
        const durationSetHash = endSetHash - startSetHash
        console.log("Writing duration of calling setHash function inside duration-SET-HASH.txt...")
        fs.appendFile("./duration-SET-HASH.txt", durationSetHash.toString() + "\n", err => {     //writing duration to file
            if (err) {
                console.log(err)
            }
        })
        console.log("Calling block confirmation time of the SET Hash function...")
        const BlockConfirmationTimeSetHashStart = Date.now()
        await transactionReceiptSetHash.wait()
        const BlockConfirmationTimeSetHashEnd = Date.now()
        console.log("Writing block confirmation time inside duration-BlockConfirmationTime-SETHASH file...")
        const BlockConfirmationTimeSetHashDuration = BlockConfirmationTimeSetHashEnd - BlockConfirmationTimeSetHashStart
        fs.appendFile("./duration-BlockConfirmationTime-SETHASH.txt", BlockConfirmationTimeSetHashDuration.toString() + "\n", err => {     //writing duration to file
            if (err) {
                console.log(err)
            }
        })
    });




    //IPFS end



    const response = await fetch('https://gasstation-mainnet.matic.network/v2');
    const json = await response.json();

    console.log(json)

    fastValue = ethers.utils.parseUnits(Math.ceil(json.fast.maxPriorityFee).toString(), 'gwei');
    maxFee = ethers.utils.parseUnits(Math.ceil(json.fast.maxFee).toString(), 'gwei');

    const transaction = {
        to: CONTRACT_ADDRESS_POLYGON_MAINNET,
        data: TRANSFER_SC_FUNCTION,
        gasLimit: 200000,
        maxPriorityFeePerGas: fastValue,
        maxFeePerGas: maxFee,
        value: Utils.parseEther("0.001"),
        chainId: 137, // Corresponds to Mumbai
    };


    console.log("Start calling transfer function...")
    const startTransfer = Date.now();
    let transactionReceiptTransfer = await wallet.sendTransaction(transaction);
    const endTransfer = Date.now()
    console.log("End calling transfer function")
    const durationTransfer = endTransfer - startTransfer;
    console.log("Writing duration of calling store function inside duration-TRANSFER.txt...")
    fs.appendFile("./duration-TRANSFER.txt", durationTransfer.toString() + "\n", err => {
        if (err) {
            console.log(err)
        }
    })

    console.log("Calling block confirmation time of the TRANSFER function...")
    const BlockConfirmationTimeTransferStart = Date.now()
    await transactionReceiptTransfer.wait()
    const BlockConfirmationTimeTransferEnd = Date.now()
    console.log("Writing block confirmation time inside duration-BlockConfirmationTime-TRANSFER file...")
    const BlockConfirmationTimeTransferDuration = BlockConfirmationTimeTransferEnd - BlockConfirmationTimeTransferStart
    fs.appendFile("./duration-BlockConfirmationTime-TRANSFER.txt", BlockConfirmationTimeTransferDuration.toString() + "\n", err => {     //writing duration to file
        if (err) {
            console.log(err)
        }
    })
}



async function attach() {

    contractFactory = await hre.ethers.getContractFactory("Storage");
    console.log("Attaching contract...")
    const contract = await contractFactory.attach(CONTRACT_ADDRESS_POLYGON_MAINNET);

    return contract;
}

var i = 1;                                                                              //  set your counter to 1
function myLoop(contract) {                                                             //  create a loop function
    setTimeout(function () {                                                            //  call a 3s setTimeout when the loop is called
        main(contract)
            .then(() => console.log(""))
            .catch((error) => {
                console.error(error)
                process.exit(1)
            })
        i++;                                                                             //  increment the counter
        if (i < 4) {                                                                    //  if the counter < 20, call the loop function
            jsonReader("./data.json", (err, data) => {                                  //jsonReader takes the next line of data.json                
                if (err) {
                    console.log(err);
                } else {
                    data.shift();                                                       //data.shift is called to pop the first entry as it will be stored on the BC
                    fs.writeFile("./data.json", JSON.stringify(data, null, 2), err => { //write the json (minus one entry) back to data.json
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            });
            myLoop(contract);             //  ..  again which will trigger another 
        }

    }, 60000)  //the function is called every second from new     

}

const promise1 = Promise.resolve(attach())  //calling attach. As the contract object is returned as a promise the promise has to be resolved
promise1.then((contract) => {
    myLoop(contract)
});

function jsonReader(filePath, cb) {
    fs.readFile(filePath, "utf-8", (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    })
}
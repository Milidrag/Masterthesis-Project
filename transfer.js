const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
const ethers = require("ethers");
const fs = require("fs-extra");
require('dotenv').config();



const { API_KEY, PRIVATE_KEY_GOERLI_ALICE, TRANSFER_SC_FUNCTION, CONTRACT_ADDRESS_GOERLI_IPFS_2, INFURA_PROJECT_ID, INFURA_API_SECRET } = process.env;
const settings = {
    apiKey: API_KEY,
    network: Network.ETH_GOERLI,
};

const alchemy = new Alchemy(settings);
const wallet = new Wallet(PRIVATE_KEY_GOERLI_ALICE, alchemy);
const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");
const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");


async function main(contract) {
    jsonString = fs.readFileSync("./data.json", "utf-8");
    jsonStringFirst = JSON.parse(jsonString)[0];

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

    //take the hash from the contract and call with the client the data
    const hashOldData = await contract.getHash();
    // create a string to append contents to
    let contents = ""

    if (hashOldData.length > 2) {
        const ipfsObject = await client.get(hashOldData)

        // loop over incoming data
        for await (const item of ipfsObject) {
            // turn string buffer to string and append to contents
            contents += new TextDecoder().decode(item)
        }

        // remove null characters
        contents = contents.replace(/\0/g, "")
    }

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

    console.log(jsonArray)

    //send data
    await client.add(JSON.stringify(jsonArray)).then((res) => {
        //here I have to call the contract and send the hash
        console.log("res...");
        console.log(res)
        contract.sendHash(res.path)
    });
    //IPFS end

    /*     const transaction = {
            to: CONTRACT_ADDRESS_GOERLI_IPFS,
            data: TRANSFER_SC_FUNCTION,
            value: Utils.parseEther("0.001"),
            maxPriorityFeePerGas: Utils.parseUnits("15", "wei"),
            type: 2,
            chainId: 5, // Corresponds to ETH_GOERLI
        };
    
        const sentTx = await wallet.sendTransaction(transaction);
    
        const hashResultBack = await contract.getHash();
    
        console.log("here is your hash: please try it " + hashResultBack) */
}



async function attach() {
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Attaching contract...")
    const contract = await contractFactory.attach(CONTRACT_ADDRESS_GOERLI_IPFS_2);

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
        if (i < 5) {                                                                    //  if the counter < 20, call the loop function
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
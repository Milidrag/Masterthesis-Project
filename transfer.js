const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
const ethers = require("ethers");
const fs = require("fs-extra");
require('dotenv').config();



async function main() {
    //compile them in our code 
    //compile them separately 
    //http://0.0.0.0:7545

    const { API_KEY, PRIVATE_KEY_GOERLI_BOB } = process.env;
    const settings = {
        apiKey: API_KEY,
        network: Network.ETH_GOERLI, // Replace with your network.
    };

    const alchemy = new Alchemy(settings);
    const wallet = new Wallet(PRIVATE_KEY_GOERLI_BOB, alchemy);


    const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");
    const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    const contract = await contractFactory.attach(
        process.env.CONTRACT_ADDRESS_GOERLI_IPFS
    );

    jsonString = fs.readFileSync("./data.json", "utf-8");
    jsonStringFirst = JSON.parse(jsonString)[0];


    //const result = await contract.store(jsonStringFirst);
    //now with IPFS
    console.log(JSON.stringify(jsonStringFirst));
    //ipfsClient(JSON.stringify(jsonStringFirst));


    //IPFS start
    const { create } = await import('ipfs-http-client')
    const { INFURA_PROJECT_ID, INFURA_API_SECRET } = process.env;

    const client = await create(
        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
                "Authorization": `Basic ${Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_API_SECRET).toString("base64")}`
            }
        })

    let result = await client.add(JSON.stringify(jsonStringFirst)).then((res) => {
        /*         return res.data;
         */
        contract.sendHash(res.data)
    });

    /*     console.log("here ist the result" + result);
    
        const hashResult = await contract.sendHash(result); */

    //IPFS end


    /* 
        const transaction = {
            to: "0x1FaDaBd1e0783B3B19bd610B3263B5fdE5f4202B",
            data: "0x8a4068dd",
            value: Utils.parseEther("0.001"),
            maxPriorityFeePerGas: Utils.parseUnits("15", "wei"),
            type: 2,
            chainId: 5, // Corresponds to ETH_GOERLI
        };
    
        const sentTx = await wallet.sendTransaction(transaction); */

    const hashResultBack = await contract.getHash();

    console.log("here is your hash: please try it " + hashResultBack)


    console.log("-------------------------------");
    jsonReader("./data.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            data.shift();
            fs.writeFile("./data.json", JSON.stringify(data, null, 2), err => {
                if (err) {
                    console.log(err)
                }
            })

        }
    });


}



var i = 1;                  //  set your counter to 1

function myLoop() {         //  create a loop function
    setTimeout(function () {   //  call a 3s setTimeout when the loop is called
        main()
            .then(() => console.log("hello"))
            .catch((error) => {
                console.error(error)
                process.exit(1)
            })//mycode
        i++;                    //  increment the counter
        if (i < 2) {           //  if the counter < 10, call the loop function
            myLoop();             //  ..  again which will trigger another 
        }                       //  ..  setTimeout()
    }, 2000)
}

myLoop();                   //  start the loop

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

async function ipfsClient(transfer) {
    const { create } = await import('ipfs-http-client')
    const { INFURA_PROJECT_ID, INFURA_API_SECRET } = process.env;

    const client = await create(
        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: "https",
            headers: {
                "Authorization": `Basic ${Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_API_SECRET).toString("base64")}`
            }
        })

    client.add(transfer).then((res) => {
        console.log(res);
    });
};
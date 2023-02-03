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
        process.env.CONTRACT_ADDRESS_GOERLI
    );

    jsonString = fs.readFileSync("./data.json", "utf-8");
    jsonStringFirst = JSON.parse(jsonString)[0];
    console.log(jsonStringFirst);


    const result = await contract.store(jsonStringFirst);
    console.log(result);
    console.log("-------------new-------------");

    const transaction = {
        to: "0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd",
        nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
        value: Utils.parseEther("0.001"),
        maxPriorityFeePerGas: Utils.parseUnits("15", "wei"),
        type: 2,
        chainId: 5, // Corresponds to ETH_GOERLI
    };

    console.log(transaction);

    const dataStorage = await contract.getArr();
    console.log("Here ist the datastorage");
    console.log(dataStorage);
    console.log("new-------------");

    console.log("--------------test-----------------");
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
        if (i < 10) {           //  if the counter < 10, call the loop function
            myLoop();             //  ..  again which will trigger another 
        }                       //  ..  setTimeout()
    }, 5000)
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
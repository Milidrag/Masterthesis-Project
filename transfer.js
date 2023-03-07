const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");
const ethers = require("ethers");
const fs = require("fs-extra");
require('dotenv').config();


const { API_KEY, PRIVATE_KEY_GOERLI_ALICE } = process.env;
const settings = {
    apiKey: API_KEY,
    network: Network.ETH_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);
const wallet = new Wallet(PRIVATE_KEY_GOERLI_ALICE, alchemy);


const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");
const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");


async function main(contract) {


    jsonString = fs.readFileSync("./data.json", "utf-8");
    jsonStringFirst = JSON.parse(jsonString)[0];

    const startStore = Date.now();
    const result = await contract.store(jsonStringFirst);
    const endStore = Date.now()
    const durationStore = endStore - startStore;
    fs.appendFile("./duration-store.txt", durationStore.toString() + "\n", err => {     //writing duration to file
        if (err) {
            console.log(err)
        }
    })

    const transaction = {
        to: "0x1FaDaBd1e0783B3B19bd610B3263B5fdE5f4202B",
        data: "0x8a4068dd",
        value: Utils.parseEther("0.001"),
        gasLimit: 50000,
        maxPriorityFeePerGas: Utils.parseUnits("15", "wei"),
        type: 2,
        chainId: 5, // Corresponds to ETH_GOERLI
    };
    const startTransfer = Date.now();
    const sentTx = await wallet.sendTransaction(transaction);
    const endTransfer = Date.now()
    const durationTransfer = endTransfer - startTransfer;
    fs.appendFile("./duration-transfer.txt", durationTransfer.toString() + "\n", err => {
        if (err) {
            console.log(err)
        }
    })
    console.log(sentTx);

    /*     const dataStorage = await contract.getArr();
        console.log("Here ist the datastorage");
        console.log(dataStorage);
        console.log("Das konvertierte datastorage");
        const BigNumber = ethers.BigNumber;
        var storageValue = BigNumber.from(dataStorage[0][0]);
        console.log("test " + storageValue);
    
        console.log("-------------------------------"); */
}

async function attach() {


    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    const contract = await contractFactory.attach(
        process.env.CONTRACT_ADDRESS_GOERLI_NEW_ALICE
    );

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

    }, 5000)  //the function is called every second from new     

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
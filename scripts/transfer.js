const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");       //use Alchemy library to interact with the BC - Görli
const ethers = require("ethers");
const fs = require("fs-extra");
require('dotenv').config();


const { API_KEY, PRIVATE_KEY_GOERLI_ALICE, TRANSFER_SC_FUNCTION, CONTRACT_ADDRESS_GOERLI_3 } = process.env;
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

    console.log("Start calling store function...")
    const startStore = Date.now();
    let transactionResponseStore = await contract.store(jsonStringFirst);
    const endStore = Date.now()
    console.log("End calling store function")
    const durationStore = endStore - startStore;
    console.log("Writing duration of calling store function inside duration-STORE.txt...")
    fs.appendFile("./duration-STORE.txt", durationStore.toString() + "\n", err => {     //writing duration to file
        if (err) {
            console.log(err)
        }
    })


    const gasUsedStore = transactionResponseStore.gasUsed;
    console.log(gasUsedStore)
    console.log(`Gas used by store function: ${gasUsedStore}`);

    console.log("Calling block confirmation time of the STORE function...")
    const BlockConfirmationTimeStoreStart = Date.now()
    await transactionResponseStore.wait()
    const BlockConfirmationTimeStoreEnd = Date.now()
    console.log("Writing block confirmation time inside duration-BlockConfirmationTime-STORE file...")
    const BlockConfirmationTimeStoreDuration = BlockConfirmationTimeStoreEnd - BlockConfirmationTimeStoreStart
    fs.appendFile("./duration-BlockConfirmationTime-STORE.txt", BlockConfirmationTimeStoreDuration.toString() + "\n", err => {     //writing duration to file
        if (err) {
            console.log(err)
        }
    })

    const estimation = await contract.estimateGas.store(jsonString);
    console.log(`Estimation value of STORE-funciton is: ${ethers.utils.formatEther(estimation)}`);

    const transaction = {
        to: CONTRACT_ADDRESS_GOERLI_3,
        data: TRANSFER_SC_FUNCTION,
        value: Utils.parseEther("0.001"),
        gasLimit: 50000, //better not to set the values manually. the price will be calculated automatically at a fair fee. 
        maxPriorityFeePerGas: Utils.parseUnits("15", "wei"),
        type: 2,
        chainId: 5, // Corresponds to ETH_GOERLI
    };



    console.log("Start calling transfer function...")
    const startTransfer = Date.now();
    let transactionResponseTransfer = await wallet.sendTransaction(transaction);
    const endTransfer = Date.now()
    console.log("End calling transfer function")
    const durationTransfer = endTransfer - startTransfer;
    console.log("Writing duration of calling store function inside duration-TRANSFER.txt...")
    fs.appendFile("./duration-TRANSFER.txt", durationTransfer.toString() + "\n", err => {
        if (err) {
            console.log(err)
        }
    })

    const gasUsedTransfer = transactionResponseTransfer.gasUsed;
    console.log(`Gas used by transfer function: ${gasUsedTransfer}`);

    console.log("Calling block confirmation time of the TRANSFER function...")
    const BlockConfirmationTimeTransferStart = Date.now()
    await transactionResponseTransfer.wait()
    const BlockConfirmationTimeTransferEnd = Date.now()
    console.log("Writing block confirmation time inside duration-BlockConfirmationTime-TRANSFER file...")
    const BlockConfirmationTimeTransferDuration = BlockConfirmationTimeTransferEnd - BlockConfirmationTimeTransferStart
    fs.appendFile("./duration-BlockConfirmationTime-TRANSFER.txt", BlockConfirmationTimeTransferDuration.toString() + "\n", err => {     //writing duration to file
        if (err) {
            console.log(err)
        }
    })




    //Recommend to reduce the loop to one circulation. Then comment in the lines below to receive an output. Reason is to have a reduced output for better legibility
    /*     console.log("Start calling getArr-Function...")
        const startGetArr = Date.now()
        const dataStorage = await contract.getArr();
        const endGetArr = Date.now()
        const durationGetArr = endGetArr - startGetArr;
        fs.appendFile("./duration-getArr.txt", durationGetArr.toString() + "\n", err => {
            if (err) {
                console.log(err)
            }
        })
    
        console.log("Here ist the datastorage");
        console.log(dataStorage);
        console.log("Converted datastorage");
        const BigNumber = ethers.BigNumber;
        var storageValue = BigNumber.from(dataStorage[0][0]);
        console.log("Value " + storageValue); */
}

async function attach() {


    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Attaching contract...")
    const contract = await contractFactory.attach(CONTRACT_ADDRESS_GOERLI_3);

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
        if (i < 2) {                                                                    //  if the counter < 20, call the loop function
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

    }, 1000)  //the function is called every second from new     

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
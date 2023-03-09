const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs-extra");    //fs-extra package is a library to interact with the local file storage
require('dotenv').config();        //dotenv package is used to hide private data on public repository. the ".env"-file is not committed on the repository


const { CONTRACT_ADDRESS_IOTA } = process.env;


async function main(contract) {

    jsonString = fs.readFileSync("./data.json", "utf-8");                              //reading from the local FS
    jsonStringFirst = JSON.parse(jsonString)[0];                                       //take the first value
    console.log("This value will be stored on the BC ");
    console.log(jsonStringFirst);


    console.log("Start calling store-function...")
    const startStore = Date.now();
    const transactionResponseStore = await contract.store(JSON.stringify(jsonStringFirst));
    const endStore = Date.now()
    const durationStore = endStore - startStore;
    console.log("Writing duration of store-function to duration-store.txt file...")
    fs.appendFile("./duration-store.txt", durationStore.toString() + "\n", err => {     //writing duration to file
        if (err) {
            console.log(err)
        }
    })


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



    console.log("Transaction started...")
    const startTransfer = Date.now();
    const transactionResponseTransfer = await contract.transfer({
        value: ethers.utils.parseUnits("1", "ether"),
    });
    const endTransfer = Date.now()
    console.log("Transaction completed")
    const durationTransfer = endTransfer - startTransfer;
    fs.appendFile("./duration-transfer.txt", durationTransfer.toString() + "\n", err => {
        if (err) {
            console.log(err)
        }
    })

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
        const dataArr = await contract.getArr();
        const endGetArr = Date.now()
        const durationGetArr = endGetArr - startGetArr;
        console.log(dataArr);
        fs.appendFile("./duration-getArr.txt", durationGetArr.toString() + "\n", err => {
            if (err) {
                console.log(err)
            }
        }) */


    /*     const estimation = await contract.estimateGas.store(jsonStringFirst);
        console.log(ethers.utils.formatEther(estimation)) */

}




async function attach() {
    const SimpleStorage = await ethers.getContractFactory("StorageString");
    console.log("Attaching, please wait...");
    const contract = await SimpleStorage.attach(
        CONTRACT_ADDRESS_IOTA
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
        if (i < 6) {                                                                    //  if the counter < 20, call the loop function
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

    }, 10000)  //the function is called every second from new     

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
const hre = require("hardhat"); //use ether library to interact with the BC
const fs = require("fs-extra");    //fs-extra package is a library to interact with the local file storage
require('dotenv').config();        //dotenv package is used to hide private data on public repository. the ".env"-file is not committed on the repository

//async functions are needed to use the await function
async function main(contract) {


    jsonString = fs.readFileSync("./data.json", "utf-8");                              //reading from the local FS
    jsonStringFirst = JSON.parse(jsonString)[0];                                       //take the first value
    console.log("This value will be stored on the BC ");
    console.log(jsonStringFirst)
    const startStore = Date.now();
    await contract.store(JSON.stringify(jsonStringFirst), {
        gasPrice: 1000,                                                                 //setting gasPrice and gasLimit is important for Ganache 
        gasLimit: 900000
    });

    const endStore = Date.now()
    const durationStore = endStore - startStore;
    fs.appendFile("./duration-store.txt", durationStore.toString() + "\n", err => {     //writing duration to file
        if (err) {
            console.log(err)
        }
    })
    /*     console.log(result)
        console.log(hre.ethers.utils.formatEther(result.gasPrice)) //the gasPrice and gasLimit is set by me in case of local environment. 
        console.log(hre.ethers.utils.formatEther(result.gasLimit)) */

    console.log("Transaction started...")
    const startTransfer = Date.now();
    await contract.transfer({
        value: hre.ethers.utils.parseUnits("1", "ether"),
    });
    const endTransfer = Date.now()
    console.log("Transaction completed")
    const durationTransfer = endTransfer - startTransfer;
    fs.appendFile("./duration-transfer.txt", durationTransfer.toString() + "\n", err => {
        if (err) {
            console.log(err)
        }
    })
}



async function attach() {
    const provider = new hre.ethers.providers.JsonRpcProvider(process.env.PROVIDER_GANACHE); //provider is the host with the port
    const wallet = new hre.ethers.Wallet(                                                    //wallet object contains the PK and the provider
        process.env.PRIVATE_KEY_GANACHE_BOB,
        provider
    );
    const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");                //ABI is the abstraction of the contract
    const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");             //binary file of the contract

    const contractFactory = new hre.ethers.ContractFactory(abi, binary, wallet);           //contractFactory can be deployment or for connection to a contract
    console.log("Attaching, please wait...");
    const contract = await contractFactory.attach(                                     //here the contract object is attached to contract address 
        process.env.CONTRACT_ADDRESS_GANACHE
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

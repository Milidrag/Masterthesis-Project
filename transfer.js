const ethers = require("ethers");  //use ether library to interact with the BC
const fs = require("fs-extra");    //fs-extra package is a library to interact with the local file storage
require('dotenv').config();        //dotenv package is used to hide private data on public repository. the ".env"-file is not committed on the repository

//async functions are needed to use the await function
async function main(contract) {


    jsonString = fs.readFileSync("./data.json", "utf-8");                              //reading from the local FS
    jsonStringFirst = JSON.parse(jsonString)[0];                                       //take the first value
    console.log("This value will be stored on the BC ");
    console.log(jsonStringFirst)
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_GANACHE); //provider is the host with the port

    //  const options = { nonce: await provider.getTransactionCount(process.env.PUBLIC_KEY_GANACHE_BOB), gas: 35000000, gasPrice: 3000000000 };
    const start = Date.now();

    await contract.store(jsonStringFirst, {
        gasPrice: 1000,
        gasLimit: 900000
    });                              //store the value on the BC
    const end = Date.now()
    const duration = end - start;
    console.log("This is the duration of the store function");
    console.log(duration)
    console.log("--------------------");
    /*     console.log(result)
        console.log(ethers.utils.formatEther(result.gasPrice))
        console.log(ethers.utils.formatEther(result.gasLimit)) */

    console.log("This is the transaction: ");
    const start2 = Date.now();

    await contract.transfer({
        value: ethers.utils.parseUnits("1", "ether"),
/*         nonce: await provider.getTransactionCount(process.env.PUBLIC_KEY_GANACHE_BOB)
 */    });
    const end2 = Date.now()
    const duration2 = end2 - start2;
    console.log("This is the duration of the transfer function");
    console.log(duration2)
    console.log("--------------------");
    console.log("--------------------");

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



async function attach() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_GANACHE); //provider is the host with the port
    const wallet = new ethers.Wallet(                                                    //wallet object contains the PK and the provider
        process.env.PRIVATE_KEY_GANACHE_BOB,
        provider
    );
    const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");                //ABI is the abstraction of the contract
    const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");             //binary file of the contract

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);           //contractFactory can be deployment or for connection to a contract
    console.log("Attaching, please wait...");
    const contract = await contractFactory.attach(                                     //here the contract object is attached to contract address 
        process.env.CONTRACT_ADDRESS_GANACHE
    );

    return contract;
}

var i = 1;                  //  set your counter to 1
function myLoop(contract) {         //  create a loop function
    setTimeout(function () {   //  call a 3s setTimeout when the loop is called
        main(contract)
            .then(() => console.log(""))
            .catch((error) => {
                console.error(error)
                process.exit(1)
            })//mycode
        i++;                    //  increment the counter
        if (i < 20) {           //  if the counter < 10, call the loop function
            myLoop(contract);             //  ..  again which will trigger another 
        }                       //  ..  setTimeout()
    }, 5000)
}

const promise1 = Promise.resolve(attach())
promise1.then((contract) => {
    myLoop(contract)
});


/* myLoop();     */               //  start the loop

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
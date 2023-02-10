const ethers = require("ethers");  //use ether library to interact with the BC
const fs = require("fs-extra");    //fs-extra package is a library to interact with the local file storage
require('dotenv').config();        //dotenv package is used to hide private data on public repository. the ".env"-file is not committed on the repository

//async functions are needed to use the await function
async function main() {
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

    jsonString = fs.readFileSync("./data.json", "utf-8");                              //reading from the local FS
    jsonStringFirst = JSON.parse(jsonString)[0];                                       //take the first value
    console.log("This value will be stored on the BC " + jsonStringFirst);
    const options = { nonce: await provider.getTransactionCount(process.env.PUBLIC_KEY_GANACHE_BOB) };
    const result = await contract.store(jsonStringFirst, options);                              //store the value on the BC
    console.log(result);                                                               //log the result 

    /*     console.log("This is the transaction: ");
        const tx = await contract.transfer({
            value: ethers.utils.parseUnits("1", "ether"),
            nonce: await provider.getTransactionCount(process.env.PUBLIC_KEY_GANACHE_BOB)
        });
        console.log(tx); */


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
        if (i < 5) {           //  if the counter < 10, call the loop function
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
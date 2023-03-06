// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs-extra");    //fs-extra package is a library to interact with the local file storage
require('dotenv').config();        //dotenv package is used to hide private data on public repository. the ".env"-file is not committed on the repository

async function main() {

    const SimpleStorage = await ethers.getContractFactory("Storage");
    const contract = await SimpleStorage.attach(
        "0x3c1638Da06b7F1d92e0a45dc36E3D2006AA66bb3" // The deployed contract address
    );
    /* 
        // Now you can call functions of the contract
        result = await contract.transfer({
            value: ethers.utils.parseUnits("1", "ether")
        });
    
        console.log(result); */

    jsonString = fs.readFileSync("./data.json", "utf-8");                              //reading from the local FS
    jsonStringFirst = JSON.parse(jsonString)[0];                                       //take the first value
    console.log(jsonStringFirst);
    console.log("This value will be stored on the BC " + jsonStringFirst);
    const resultStore = await contract.store(jsonStringFirst);
    console.log(resultStore);                                                               //log the result 
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
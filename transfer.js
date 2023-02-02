const ethers = require("ethers");
const fs = require("fs-extra");
require('dotenv').config();


async function main() {
    //compile them in our code 
    //compile them separately 
    //http://0.0.0.0:7545
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_ALCHEMY);
    const wallet = new ethers.Wallet(
        process.env.PRIVATE_KEY_GOERLI_BOB,
        provider
    );
    const abi = fs.readFileSync("./1_Storage_sol_Storage.abi", "utf8");
    const binary = fs.readFileSync("./1_Storage_sol_Storage.bin", "utf8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract = await contractFactory.attach(
        process.env.CONTRACT_ADDRESS_GOERLI
    ); // STOP here! Wait for contract to deploy
    console.log("Here is the deployment transaction (transaction response): ")

    jsonString = fs.readFileSync("./data.json", "utf-8");
    jsonStringFirst = JSON.parse(jsonString)[0];
    console.log(jsonStringFirst);


    const result = await contract.store(jsonStringFirst);
    console.log(result);
    console.log("new-------------");

    const nonce = await wallet.getTransactionCount();
    const tx = await contract.transfer({
        value: ethers.utils.parseUnits("10000", "gwei"),
        nonce: nonce //TODO nonce failure check it whether I can fix it with async somehow
    });
    console.log(tx);

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
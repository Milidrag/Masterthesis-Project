# Masterthesis-Project - Ethereum main network branch

This document desribes the necessary steps to install and run the project locally. 

## Following tools need to be installed as a requirement
- [x] [GIT](https://git-scm.com/book/de/v2/Erste-Schritte-Git-installieren)
- [x] [NodeJS](https://nodejs.org/en/download)

## Download the repository and switch to the IOTA branch 
1. Download the repository `git clone https://github.com/Milidrag/Masterthesis-Project.git`
2. Change the working directory into the downloaded folder `cd Masterthesis-Project`
3. Switch the repository to the IOTA branch 'git switch ethereum-mainnet'

## Install the project
1. Install the required dependencies `npm install`

## Deploy the contract
In case you want to deploy a new contract 
1. You have to run the following command `npm run deploy`
2. In the terminal the new contract address should be displayed
3. Copy the contract address
4. Open the `.env` -file 
5. Paste the copied address as a value of the key `CONTRACT_ADDRESS_ETHEREUM_MAINNET` 
6. You should now have `CONTRACT_ADDRESS_ETHEREUM_MAINNET=0x5FbCebACD98fC1a22aB825cA666B75733D3B2C01` but with your contract address 

## Change accounts
You can either run the contract with your contract or the already existing contract deployed contract. You have to make sure that enough money is on the accounts.
1. In case you want to use other accounts exchange the used address in the transfer.js file. 
2. For that you have to change the key-value of PRIVATE_KEY_MAINNET_ETHEREUM_BARBARA in the `.env` file. 
3. Next you have to update the hard coded public address in the smart contract. 

## Run the transfer 
To run the transfer use `npm run transfer` and the data is sent to the Ethereum main network and the money is transfered to the contract partner  

## data.json is empty
In case the data.json is empty, which is the buffer file, just copy & paste the content from `data-backup.json` into the `data.json` file
Then the transfer routine should run again


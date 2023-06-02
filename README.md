# Masterthesis-Project - IOTA Branch

This document desribes the necessary steps to install and run the project locally. 

## Following tools need to be installed as a requirement
- [x] [GIT](https://git-scm.com/book/de/v2/Erste-Schritte-Git-installieren)
- [x] [NodeJS](https://nodejs.org/en/download)

## Download the repository and switch to the IOTA branch 
1. Download the repository `git clone https://github.com/Milidrag/Masterthesis-Project.git`
2. Change the working directory into the downloaded folder `cd Masterthesis-Project`
3. Switch the repository to the IOTA branch 'git switch iota'

## Install the project
1. Install the required dependencies `npm install`

## Run the project 
In case the contract is deleted from the Shimmer test network, you have to deploy it again 

1. First deploy the contract on the tangle from the Shimmer test network "npm run deploy"
2. In the terminal the new contract address should be displayed
3. Copy the contract address
4. Open the `.env` -file 
5. Paste the copied address as a value of the key `CONTRACT_ADDRESS_IOTA_3` 
6. You should now have `CONTRACT_ADDRESS_IOTA_3=0xD2e1b57affAB75BC4cd571e6A8C2AcbfAc73016B` but with your contract address 
7. Now you can run "npm run transfer" and the data is sent to the tangle 

## data.json is empty
In case the data.json is empty, which is the buffer file just copy & paste the content from `data-backup.json` into the `data.json` file

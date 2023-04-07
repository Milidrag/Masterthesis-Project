require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter")


const { PRIVATE_KEY_POLYGON_MAINNET_MILO, PROVICER_ALCHEMY_POLYGON_MAINNET, COINMARKET, ETHEREUM_EXPLORER_API_KEY } = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: PROVICER_ALCHEMY_POLYGON_MAINNET,
      accounts: [PRIVATE_KEY_POLYGON_MAINNET_MILO],
      chainID: 137
    }
  },
  etherscan: {
    apiKey: ETHEREUM_EXPLORER_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    coinmarketcap: COINMARKET,
    token: "MATIC",
    gasPriceApi: "https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice"
  }
};
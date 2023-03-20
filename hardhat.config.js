require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter")


const { PRIVATE_KEY_GOERLI_ALICE, PROVIDER_ALCHEMY, COINMARKET, ETHEREUM_EXPLORER_API_KEY, SEPOLIA_RPC_URL } = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: PROVIDER_ALCHEMY,
      accounts: [PRIVATE_KEY_GOERLI_ALICE],
      chainID: 5
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY_GOERLI_ALICE],
      chainId: 11155111,
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
    coinmarketcap: COINMARKET
  }
};

require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("hardhat-gas-reporter")


const { PRIVATE_KEY_MAINNET_ETHEREUM_BARBARA, COINMARKET, ETHEREUM_EXPLORER_API_KEY, PROVIDER_ALCHEMY_ETHEREUM_MAINNET } = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "main",
  networks: {
    main: {
      url: PROVIDER_ALCHEMY_ETHEREUM_MAINNET,
      accounts: [PRIVATE_KEY_MAINNET_ETHEREUM_BARBARA],
      chainID: 1
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

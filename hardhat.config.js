require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { PRIVATE_KEY_GOERLI_ALICE, PROVIDER_ALCHEMY, COINMARKET } = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: PROVIDER_ALCHEMY,
      accounts: [PRIVATE_KEY_GOERLI_ALICE],
      chainID: 5
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: COINMARKET
  }
};

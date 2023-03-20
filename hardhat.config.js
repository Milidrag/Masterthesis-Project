require("@nomicfoundation/hardhat-toolbox");

const { PROVIDER_GANACHE, PROVIDER_ALCHEMY, COINMARKET } = process.env


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: PROVIDER_ALCHEMY,
      accounts: [PRIVATE_KEY_GANACHE_BOB],
      chainID: 5
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: COINMARKET
  }
};

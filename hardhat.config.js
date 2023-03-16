require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const { PROVIDER_GANACHE, PRIVATE_KEY_GANACHE_BOB } = process.env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: PROVIDER_GANACHE,
      accounts: [PRIVATE_KEY_GANACHE_BOB],
      chainID: 1337
    }
  }
};

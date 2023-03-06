require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "shimmerTest",
  networks: {
    shimmerTest: {
      url: "https://api.sc.testnet.shimmer.network/evm/jsonrpc",
      accounts: ["0xe1ec520d880d5f95b17e97fcfd56ed9a77ecca3c455a9bcaca72ab8543483537"],
      timeout: 60000
    }
  }
};

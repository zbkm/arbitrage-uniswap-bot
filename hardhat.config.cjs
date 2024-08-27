const hardhat = require("hardhat/config");
require("@nomicfoundation/hardhat-toolbox-viem");
const PRIVATE_KEY = hardhat.vars.get("PRIVATE_KEY");

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "paris",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    polygon: {
      url: "https://1rpc.io/matic",
      accounts: [PRIVATE_KEY]
    }
  }
};
module.exports = config

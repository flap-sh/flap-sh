import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// This adds support for typescript paths mappings
import "tsconfig-paths/register";
import "hardhat-storage-layout";

const config: HardhatUserConfig = {
  solidity:{
    compilers: [{
      version: "0.8.18",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        outputSelection: {
          "*": {
              "*": ["storageLayout"],
          },
        },
      },
    }],
  }

};

export default config;

import { HardhatUserConfig } from "hardhat/config";
import {HardhatNetworkAccountsUserConfig} from "hardhat/types/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    polygonAmoy: {
      url: `https://polygon-amoy.infura.io/v3/${process.env.INFURA_AMOY}`,
      accounts:[process.env.PRIVATE_KEY!]
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.ETHERSCAN_POLYGON_API_KEY!,
    },
  }  
};

export default config;

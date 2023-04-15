import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import { Log } from "@ethersproject/abstract-provider";
import dotenv from "dotenv";
import { Factory__factory, IPoolFactory__factory, IPool__factory, NFTBridgeL1__factory, PeggedNFT__factory } from "@tc/index";
import { ADDR_AZUKI_L2, ADDR_BAYC_L2, ADDR_CRYPTOPUNKS_L2, ADDR_DOODLES_L2, ADDR_NFTBRIDGE_L1, ADDR_PENNY_L2, ADDR_POOL_FACTORY, ADDR_SEEDPROVIDER } from "scripts/deployed";
import { utils } from "ethers";
import { NewPoolCreatedEventObject } from "@tc/contracts/interfaces/IFactory.sol/IPoolFactory";
import { IPoolTypes } from "@tc/contracts/Factory";
import { parsePoolState } from "./state";

dotenv.config();



async function main() {

    const provider =  getProviders();
    const signer = getSigners();
  
  
    const factory = IPoolFactory__factory.connect(ADDR_POOL_FACTORY, provider.l2);

    // get the number of pools created
    const poolCount = await factory.numPool();

    // number of pools 
    console.log(`There are ${poolCount.toNumber()} pools created.`);

    // print each pool's params
    for (let i = 0; i < poolCount.toNumber(); i++) {
        const p = await factory.getPoolInfo(i);

        console.log("====================================");
        console.log(`Pool #${i}:  ${p.poolAddress}`);
        console.log(" nft batch orders:");
        for (let i = 0; i < p.meta.nftOrderBatches.length; i++) {
          console.log(`  batch ${i}:  `);
          console.log(`    collection: ${p.meta.nftOrderBatches[i].collection} ($)`);
          console.log(`    price: ${ethers.utils.formatEther(p.meta.nftOrderBatches[i].price)} ETH`);
          console.log(`    conut: ${p.meta.nftOrderBatches[i].count}`);
        }
        console.log(` mint timeout time: ${p.meta.mintEndTime}`);
        console.log(` fee rate: ${p.meta.feeRate.toNumber() / 100}%`);
        console.log(` creatorFeeshare: ${p.meta.creatorFeeShare.toNumber() / 100}%`);
        console.log(` id: ${p.meta.poolID}`);
        // creator address
        console.log(` creator: ${p.meta.creator}`);
        // protocol treasury address
        console.log(` treasury: ${p.meta.protocolTreasury}`);
        // seed provider address
        console.log(` Seed Provider: ${p.meta.seedProvider}`);
        // bridge address
        console.log(` zkEVM Bridge: ${p.meta.bridge}`);
        // state 
        console.log(` state: ${parsePoolState(p.state)}`);

        console.log("====================================");
    }
  
  
  
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

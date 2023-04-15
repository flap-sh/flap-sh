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

/**
 * Get deployed pool address from the transaction receipt
 * @param logs  logs from the transaction receipt
 * @returns
 */
function getDepolyedPoolAddress(logs: Log[]) {

    for (let i = 0; i < logs.length; i++) {
  
      const l = Factory__factory.createInterface().parseLog(logs[i])
      if (l != null && l.name == "NewPoolCreated") {
  
        return (l.args as unknown as NewPoolCreatedEventObject)._boxPoolAddress;

      }
    }
  
    return null;
  
  }

async function main() {

  const provider =  getProviders();
  const signer = getSigners();


  const factory = Factory__factory.connect(ADDR_POOL_FACTORY, signer.l2);

  const timeOutDuration = 60 * 60 * 24 * 7; // 7 days

  // set timeout duration
  await (await factory.setMintTimeout(timeOutDuration)).wait(1);

  
  // create a pool  

  const tx = await factory.newPool([
    {
        collection: ADDR_PENNY_L2,
        count: 9,
        price: utils.parseEther("0.1"),
    },
    {
        collection: ADDR_DOODLES_L2,
        count: 1,
        price: utils.parseEther("3"),
    }
  ]);

  const receipt = await tx.wait();

  const pool = IPool__factory.connect(
    getDepolyedPoolAddress(
        receipt.logs.filter(
            (l)=> l.address.toLocaleLowerCase() == ADDR_POOL_FACTORY.toLocaleLowerCase() 
        ))!,signer.l2);

  // print pool's address
  console.log(`pool address: ${pool.address}`);


  // get the state of the pool 
  const state = await pool.poolCachedState();

  // print parsed pool state 
  console.log(`pool state: ${parsePoolState(state)}`);

  // get the mint price 
  const mintPrice = await pool.mintPrice();

  // print mint price
  console.log(`mint price: ${utils.formatEther(mintPrice)}`);


  // get actor 
  const actor = getSigners(process.env.ACTOR_PKEY || "INVALID");
  
  await (await pool.connect(actor.l2).mintBox({
    value: mintPrice,
  })).wait(1);

  // check the actor's balance of the box 
  const balance = await pool.balanceOf(actor.address);
  // print 
  console.log(`actor's balance: ${balance}`);

}





// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

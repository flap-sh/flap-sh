import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import dotenv from "dotenv";
import { NFTBridgeL1__factory, TestNFT__factory } from "@tc/index";
import { TestAzukiAddr } from "./constants";
import { ADDR_AZUKI, ADDR_BAYC, ADDR_CRYPTOPUNKS, ADDR_DOODLES, ADDR_NFTBRIDGE_L1 } from "scripts/deployed";
import { fastestGas } from "scripts/helper/gasPrice";

dotenv.config();

async function main() {

  const provider =  getProviders();
  const signer = getSigners();


  const nftBridgeL1 = NFTBridgeL1__factory.connect(ADDR_NFTBRIDGE_L1,signer.l1);


  const waitList = [
    ADDR_AZUKI,
    ADDR_BAYC,
    ADDR_DOODLES,
    ADDR_CRYPTOPUNKS,
  ]


  for(const collection of waitList){

    // enable collection 
    const tx = await nftBridgeL1.enableCollection(collection,fastestGas);
    await tx.wait();

    console.log(`collection ${collection} enabled`);


    // approve collection to be spent by nftBridgeL1

    await (
        await TestNFT__factory
            .connect(collection, signer.l1)
            .setApprovalForAll(ADDR_NFTBRIDGE_L1, true,fastestGas)
    ).wait();


    // bridge the first 5 nfts to L2 
    for(let i = 0; i < 5; i++){
        await (
            await nftBridgeL1.BridgeNFTToL2(collection, i, signer.address,fastestGas)
        ).wait();
    }

  }


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

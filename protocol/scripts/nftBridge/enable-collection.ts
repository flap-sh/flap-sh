import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import dotenv from "dotenv";
import { NFTBridgeL1__factory } from "@tc/index";
import { TestAzukiAddr } from "./constants";

dotenv.config();

async function main() {

  const provider =  getProviders();
  const signer = getSigners();


  const nftBridgeL1 = NFTBridgeL1__factory.connect("0x0A50FcE142a00bF220F8e0107Fe0F5b6557f69f2",signer.l1);


  // enable collection 
  const tx = await nftBridgeL1.enableCollection(TestAzukiAddr);
  const receipt = await tx.wait();

  // print receipt
  console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

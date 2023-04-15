import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import dotenv from "dotenv";
import { NFTBridgeL1__factory, PeggedNFT__factory } from "@tc/index";

dotenv.config();

async function main() {

  const provider =  getProviders();
  const signer = getSigners();


  // depoly test NFT 
  const facotry = await ethers.getContractFactory("TestNFT",signer.l1);

  const fastestGas = {
    // 100 gwei 
    gasPrice:  ethers.utils.parseUnits("100", "gwei"),
  }


  // deploy multiple NFTs 
  // and mint the 10 NFTs of each collection to the signer address

  const nft1 = await facotry.deploy("Penny", "Penny",fastestGas);
  await nft1.deployed();
  console.log("Penny deployed to:", nft1.address);


  await (await nft1.mintMulti(signer.address, 20,fastestGas)).wait();

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

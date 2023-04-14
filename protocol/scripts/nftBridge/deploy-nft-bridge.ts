import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import dotenv from "dotenv";

dotenv.config();

async function main() {

  const provider =  getProviders();
  const signer = getSigners();


  // deploy PeggedNFT Contract
  const peggedNFT = await (await ethers.getContractFactory("PeggedNFT")).connect(signer.l2).deploy();
  await peggedNFT.deployed();
  console.log(`PeggedNFT deployed to: ${peggedNFT.address}`);


  // we should predetermine the NFTBridgeL1 address 
  const nftBridgeL1Addr = ethers.utils.getContractAddress(
    { from: signer.address, nonce: await signer.l1.getTransactionCount() });

  // deploy NFTBridge L2 endpoint 
  const nftBridgeL2 = await (await ethers.getContractFactory("NFTBridgeL2")).connect(signer.l2).deploy(
    ZKEVM_BRIDGE_ADDRESS, 
    nftBridgeL1Addr, // NFTBridgeL1 address
    peggedNFT.address, // PeggedNFT address
  );
  await nftBridgeL2.deployed();

  console.log(`NFTBridgeL2 deployed to: ${nftBridgeL2.address}`)


  // then we deploy NFTBridge L1 endpoint
  const nftBridgeL1 = await (await ethers.getContractFactory("NFTBridgeL1")).connect(signer.l1).deploy(
    ZKEVM_BRIDGE_ADDRESS,
    nftBridgeL2.address // NFTBridgeL2 address
  );
  await nftBridgeL1.deployed();
  console.log(`NFTBridgeL1 deployed to: ${nftBridgeL1.address}`)


 //   PeggedNFT deployed to: 0x0A50FcE142a00bF220F8e0107Fe0F5b6557f69f2
 // NFTBridgeL2 deployed to: 0xE3091BcA4ff306b6848594CA51e41EEcC381F3E0
 // NFTBridgeL1 deployed to: 0x0A50FcE142a00bF220F8e0107Fe0F5b6557f69f2

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

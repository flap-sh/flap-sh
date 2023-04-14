import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import dotenv from "dotenv";
import { NFTBridgeL1__factory, NFTBridgeL2__factory, PeggedNFT__factory } from "@tc/index";
import { TestAzukiAddr } from "./constants";

dotenv.config();

async function main() {

  const provider =  getProviders();
  const signer = getSigners();

  const nftBridgeL2 = NFTBridgeL2__factory.connect("0xE3091BcA4ff306b6848594CA51e41EEcC381F3E0",signer.l2);

  const tx = await nftBridgeL2.BridgeBackToL1("0x0c77925a16032ff4ccfee65adce433c97d189776", 1686, signer.address);
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

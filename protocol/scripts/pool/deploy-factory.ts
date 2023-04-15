import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import dotenv from "dotenv";
import { NFTBridgeL1__factory, PeggedNFT__factory } from "@tc/index";
import { ADDR_NFTBRIDGE_L1, ADDR_SEEDPROVIDER } from "scripts/deployed";

dotenv.config();

async function main() {

  const provider =  getProviders();
  const signer = getSigners();


  const facets = [
    '0x63D32B95b77711cC3Ce77445A5Ca7521A4896581',
    '0x9De6817587DB75e4Df15785Efba145Fa0DCE75cD',
    '0xa26F06f8706F975eb1CC0a303407a8BaE8614D6f',
    '0x4cf1D978cc00E221cb8364E26C2c80f214471F76'
  ]

  const factory = await (
    await ethers.getContractFactory("Factory",signer.l2)
  ).deploy(ZKEVM_BRIDGE_ADDRESS,ADDR_SEEDPROVIDER,facets);

  await factory.deployed();

  console.log("Factory deployed to:", factory.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

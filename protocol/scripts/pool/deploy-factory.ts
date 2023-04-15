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
    '0x9992e7d19B8c342053c42aF873B0E05B9EC5B40f',
    '0xef605905a74B05CD227CB9F23640FC41E3C2Cc0c',
    '0x41147c750768D881F951016F68e10425c078FB0a',
    '0xAA522b36ee2da9fd52C273A77e9a4e38666fC654'
  ];

  const factory = await (
    await ethers.getContractFactory("Factory",signer.l2)
  ).deploy(ADDR_NFTBRIDGE_L1,ADDR_SEEDPROVIDER,facets);

  await factory.deployed();

  console.log("Factory deployed to:", factory.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

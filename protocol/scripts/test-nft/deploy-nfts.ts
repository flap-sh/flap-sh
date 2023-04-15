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

  const nft1 = await facotry.deploy("Azuki", "Azuki",fastestGas);
  await nft1.deployed();
  console.log("Azuki deployed to:", nft1.address);


  // mint 10 NFTs to signer address
  await (await nft1.mintMulti(signer.address, 20,fastestGas)).wait();

  const nft2 = await facotry.deploy("BoredApeYachtClub", "BAYC",fastestGas);
  await nft2.deployed();

  console.log("BoredApeYachtClub deployed to:", nft2.address);

  // mint 10 NFTs to signer address
  await (await nft2.mintMulti(signer.address, 20,fastestGas)).wait();

  const nft3 = await facotry.deploy("CryptoPunks", "Punk",fastestGas);
  await nft3.deployed();

  console.log("CryptoPunks deployed to:", nft3.address);

  // mint 10 NFTs to signer address
  await (await nft3.mintMulti(signer.address, 10,fastestGas)).wait();


  const nft4 = await facotry.deploy("Doodles", "Doodles",fastestGas);
  await nft4.deployed();

  console.log("Doodles deployed to:", nft4.address);

  // mint 10 NFTs to signer address
  await (await nft4.mintMulti(signer.address, 10,fastestGas)).wait();

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

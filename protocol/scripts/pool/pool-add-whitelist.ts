import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import { ZKEVM_BRIDGE_ADDRESS } from "../polygon/constants";
import dotenv from "dotenv";
import { IPoolFactory__factory, IPool__factory, NFTBridgeL1__factory, PeggedNFT__factory } from "@tc/index";
import { ADDR_AZUKI_L2, ADDR_BAYC_L2, ADDR_CRYPTOPUNKS_L2, ADDR_DOODLES_L2, ADDR_NFTBRIDGE_L1, ADDR_POOL_FACTORY, ADDR_SEEDPROVIDER } from "scripts/deployed";

dotenv.config();

async function main() {

  const provider =  getProviders();
  const signer = getSigners();


  const factory = IPoolFactory__factory.connect(ADDR_POOL_FACTORY, signer.l2);


  // add all the "pegged NFT" of the pre-deployed NFTs to the whitelist

  const peggedNFTs = [
    ADDR_AZUKI_L2,
    ADDR_BAYC_L2,
    ADDR_CRYPTOPUNKS_L2,
    ADDR_DOODLES_L2
  ];

    for(const peggedNFT of peggedNFTs){
        await (
            await factory.addCollectionToWhitelist(peggedNFT)
        ).wait();
        
        console.log(`peggedNFT ${peggedNFT} added to whitelist`);
        
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

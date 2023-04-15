
import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import dotenv from "dotenv";
import { ZKEVM_BRIDGE_ADDRESS } from "scripts/polygon/constants";
import { fastestGas } from "scripts/helper/gasPrice";

dotenv.config();

async function main() {

    const provider = getProviders();
    const signer = getSigners();



    const  seedProvider =  await(
        (await ethers.getContractFactory("SeedProvider", signer.l1))
        .deploy(ZKEVM_BRIDGE_ADDRESS,fastestGas)
    );

    // print the address of the deployed contract
    console.log("SeedProvider deployed to:", seedProvider.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

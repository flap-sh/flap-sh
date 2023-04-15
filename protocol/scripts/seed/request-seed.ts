
import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import dotenv from "dotenv";
import { ZKEVM_BRIDGE_ADDRESS } from "scripts/polygon/constants";
import { fastestGas } from "scripts/helper/gasPrice";
import { ISeedProvider__factory } from "@tc/index";
import { ADDR_SEEDPROVIDER } from "scripts/deployed";

dotenv.config();

async function main() {

    const provider = getProviders();
    const signer = getSigners();


    const pool = "0x980B595C17712f4357C72ea64b8f0E5ed852D838";
    const seed = ISeedProvider__factory.connect(ADDR_SEEDPROVIDER, signer.l1);

    const receipt = await (await seed.requestSeed(pool,fastestGas)).wait(1);

    console.log(receipt);


    console.log("Seed requested at block #", receipt.blockNumber);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

import { ethers } from "hardhat";
import { getProviders, getSigners } from "../helper/getProviders";
import dotenv from "dotenv";
import { ZKEVM_BRIDGE_ADDRESS } from "scripts/polygon/constants";
import { fastestGas } from "scripts/helper/gasPrice";
import { IPool__factory, ISeedProvider__factory } from "@tc/index";
import { ADDR_POOL_FACTORY, ADDR_SEEDPROVIDER } from "scripts/deployed";
import { Pool__factory } from "@tc/factories/contracts/Pool_BACKUP_15169.sol";
import { utils } from "ethers";

dotenv.config();

async function main() {

    const provider = getProviders();
    const signer = getSigners();


    const fallback  = await (await ethers.getContractFactory("Fallback", signer.l2)).deploy();
    await fallback.deployed();
    const fallbackAddr = fallback.address;


    const poolAddr = "0x065Bf07082127921c47d790D3187829b74512447";

    const slot  = await provider.l2.send("eth_getStorageAt", [poolAddr, utils.hexlify(204)]);

    console.log(`Slot 204: ${slot}`);

    // A holy shit bug haunted me for almost 3 hours!!! 

    await provider.l2.send(
        "hardhat_setStorageAt",
        [poolAddr, utils.hexlify(204), utils.hexZeroPad(ZKEVM_BRIDGE_ADDRESS, 32)]
    );


    const newSlot  = await provider.l2.send("eth_getStorageAt", [poolAddr, utils.hexlify(204)]);

    console.log(`Slot 204: ${newSlot}`);






    



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

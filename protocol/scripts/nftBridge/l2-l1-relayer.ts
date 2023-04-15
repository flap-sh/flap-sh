import { BridgeEventEventObject } from "@tc/contracts/polygon/IPolygonZKEVMBridge.sol/IPolygonZkEVMBridge";
import { realpath } from "fs";
import { getProviders, getSigners } from "scripts/helper/getProviders";
import { BridgeRelayer } from "scripts/polygon/bridgeRelayer";
import { BridgeService, BridgeServiceType } from "scripts/polygon/bridgeService";
import { ZKEVM_BRIDGE_ADDRESS } from "scripts/polygon/constants";
import dotenv from "dotenv";
import { ADDR_NFTBRIDGE_L2 } from "scripts/deployed";


dotenv.config();


async function main(){

    const provider = getProviders();
    const signer = getSigners();

      
    const relayer = new BridgeRelayer({
        srcNetworkID: 1,
        dstNetworkID: 0,
        srcBridgeAddress: ZKEVM_BRIDGE_ADDRESS,
        dstBridgeAddress: ZKEVM_BRIDGE_ADDRESS,
        srcProvider: provider.l2,
        dstProvider: provider.l1,
        dstRelayerSigner: signer.l1,
        bridgeService: new BridgeService(BridgeServiceType.TESTNET),
        log: console.log,
        lastBlock: 583797,
        confirmationBlocks: 3, 
        filter: (o:BridgeEventEventObject) => o.originAddress.toLowerCase() == ADDR_NFTBRIDGE_L2.toLowerCase()
    });

    await relayer.run();


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
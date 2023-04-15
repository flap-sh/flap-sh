import { BridgeEventEventObject } from "@tc/contracts/polygon/IPolygonZKEVMBridge.sol/IPolygonZkEVMBridge";
import { realpath } from "fs";
import { getProviders, getSigners } from "scripts/helper/getProviders";
import { BridgeRelayer } from "scripts/polygon/bridgeRelayer";
import { BridgeService, BridgeServiceType } from "scripts/polygon/bridgeService";
import { ZKEVM_BRIDGE_ADDRESS } from "scripts/polygon/constants";
import dotenv from "dotenv";


dotenv.config();


async function main(){

    const provider = getProviders();
    const signer = getSigners();

      
    const relayer = new BridgeRelayer({
        srcNetworkID: 0,
        dstNetworkID: 1,
        srcBridgeAddress: ZKEVM_BRIDGE_ADDRESS,
        dstBridgeAddress: ZKEVM_BRIDGE_ADDRESS,
        srcProvider: provider.l1,
        dstProvider: provider.l2,
        dstRelayerSigner: signer.l2,
        bridgeService: new BridgeService(BridgeServiceType.TESTNET),
        log: console.log,
        lastBlock: 8829921,
        filter: (o:BridgeEventEventObject) => o.originAddress.toLowerCase() == "0x0A50FcE142a00bF220F8e0107Fe0F5b6557f69f2".toLowerCase()
    });

    await relayer.run();


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
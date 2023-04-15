import { BridgeEventEventObject } from "@tc/contracts/polygon/IPolygonZKEVMBridge.sol/IPolygonZkEVMBridge";
import { IPolygonZkEVMBridge__factory } from "@tc/index";
import { ethers } from "ethers";
import { BridgeServiceInterface } from "./bridgeService";
import { fastestGas } from "scripts/helper/gasPrice";


const DURATION_ONE_MINUTE = 60 * 1000;

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}



const MAX_BATCH_BLOCKS = 100;
const MIN_DELAY_BLOCKS = 5;
const CONFIRMATION_BLOCKS = 3;



export interface RelayerOpts {

    srcNetworkID: number;
    dstNetworkID: number;

    srcProvider: ethers.providers.Provider;
    dstProvider: ethers.providers.Provider;

    srcBridgeAddress: string;
    dstBridgeAddress: string;

    // we use the signer to send transaction for claiming messages on dst chain
    dstRelayerSigner: ethers.Signer;


    // polygon zk evm bridge service 
    bridgeService: BridgeServiceInterface

    // last processed block 
    lastBlock: number;


    // filter

    // return true, if the relayer should help claim the message on dst
    filter(args: BridgeEventEventObject): boolean;

    // log 

    // log a message
    log(message: string): void;


    // sleep duration when there is no new block (in ms)
    sleepDuration?: number;
    minDelayBlocks?: number;
    confirmationBlocks?: number;
}



export class BridgeRelayer {

    opts: RelayerOpts;
    started = false;


    constructor(opts: RelayerOpts) {
        this.opts = opts;
    }

    async run() {

        if (this.started) {
            return;
        }

        this.started = true;

        const sleepDuration = this.opts.sleepDuration == null ? DURATION_ONE_MINUTE : this.opts.sleepDuration;
        const minDelayBlocks = this.opts.minDelayBlocks == null ? MIN_DELAY_BLOCKS : this.opts.minDelayBlocks;
        const confirmationBlocks = this.opts.confirmationBlocks == null ? CONFIRMATION_BLOCKS : this.opts.confirmationBlocks;

        const { log, 
                srcBridgeAddress, dstBridgeAddress, 
                srcProvider, dstProvider, 
                bridgeService, 
                filter,
                srcNetworkID, dstNetworkID,
                dstRelayerSigner } = this.opts;

        let lastBlock = this.opts.lastBlock;

        while (true) {

            // get the chain head block 
            const chainHeadBlock = await srcProvider.getBlockNumber();

            log(`last processed lock: ${lastBlock}, chain head block: ${chainHeadBlock}`);

            // wait for a minute if we are too close to the chain head block
            if (chainHeadBlock - lastBlock <= minDelayBlocks) {
                log(`Waiting for new blocks`);
                await sleep(sleepDuration);
                continue;
            }


            // process current batch 

            const targetBlock = Math.min(lastBlock + MAX_BATCH_BLOCKS, chainHeadBlock);

            const srcBridge = IPolygonZkEVMBridge__factory.connect(srcBridgeAddress, srcProvider);

            // get all deposit events from lastBlock+1 to targetBlock
            const events = await srcBridge.queryFilter(srcBridge.filters.BridgeEvent(), lastBlock + 1, targetBlock);

            log(`Processing batch: ${lastBlock + 1} - ${targetBlock}, events_count: ${events.length}`);

            // apply the filter
            const filteredEvents = events.filter((args) => {
                return filter(args.args as BridgeEventEventObject);
            });


            for (let i = 0; i < filteredEvents.length; ++i) {

                const e = filteredEvents[i];
                const args = e.args as BridgeEventEventObject;


                log(`Processing message: ${args.depositCount}, originAddress: ${args.originAddress}, destinationAddress: ${args.destinationAddress}`);

                // claim the message

                // get the destination bridge
                const dstBridge = IPolygonZkEVMBridge__factory.connect(dstBridgeAddress, dstProvider);


                // inner loop to wait for the message to be ready for claiming 
                while (true) {

                    // get the deposit information
                    const deposit = await bridgeService.getDeposit(srcNetworkID, args.depositCount);
                    if (deposit.ready_for_claim) {

                        // get the proof 
                        const proof = await bridgeService.getProof(srcNetworkID, args.depositCount);


                        console.log(`data: ${args.metadata}`);

                        // claim the message
                        const tx = await dstBridge.connect(dstRelayerSigner).claimMessage(
                            proof.merkle_proof,
                            args.depositCount,
                            proof.main_exit_root,
                            proof.rollup_exit_root,
                            args.originNetwork,
                            args.originAddress,
                            args.destinationNetwork,
                            args.destinationAddress,
                            args.amount,
                            args.metadata);

                        const receipt = await tx.wait(confirmationBlocks);
                        if (receipt.status != 1) {
                            // the transaction is reverted
                            // this message is not able to be claimed 

                            // FIXME: ingore this messsage and mark it as claimed to avoid DOS attack

                            throw new Error(`claim message failed ${receipt.transactionHash}}`);
                        }

                        lastBlock = e.blockNumber;

                        log(`Message claimed: ${args.depositCount}`);


                        break; // break the inner loop
                    }

                    log(`Waiting for message to be ready for claiming: ${args.depositCount}`);

                    // wait for a minute
                    await sleep(sleepDuration);

                }// end of the inner loop


            }// the outter events loop


            // update last processed block
            lastBlock = targetBlock;

        }// the outter loop

    }

}

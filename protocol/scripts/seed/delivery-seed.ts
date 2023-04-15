
import { ethers } from "hardhat";
import {utils, providers, BigNumber} from "ethers";
import { getProviders, getSigners } from "../helper/getProviders";
import dotenv from "dotenv";
import { ZKEVM_BRIDGE_ADDRESS } from "scripts/polygon/constants";
import { fastestGas } from "scripts/helper/gasPrice";
import { ISeedProvider__factory, SeedProvider__factory } from "@tc/index";
import { ADDR_SEEDPROVIDER } from "scripts/deployed";

dotenv.config();

async function main() {

    const provider = getProviders();
    const signer = getSigners();

    const requestID = 0;
    const seed = SeedProvider__factory.connect(ADDR_SEEDPROVIDER, signer.l1);

    const req  = await seed.requests(requestID);

    console.log(`the target block of request 0 is ${req.targetBlockNumber}`);


    while(true){

        const latestBlock =  await provider.l1.getBlockNumber();

        // if the latest block is greater than the target block, we can get the seed
        // or, sleep for 1 min and check again 

        if(latestBlock > req.targetBlockNumber.toNumber()){
            const {rlpHeader,randaoReveal}=  await getRandaoReveal(provider.l1, req.targetBlockNumber.toNumber());

            // deliver the seed 
            const tx = await (await seed.sendSeedToL2(requestID,randaoReveal,rlpHeader,fastestGas)).wait(1);

            // print 
            console.log(`seed delivered at block #${tx.blockNumber}`);
            break;
        }else{
            console.log(`the latest block is ${latestBlock} < ${req.targetBlockNumber}, waiting for 1 min`);
            await new Promise(r => setTimeout(r, 60000));
        }

    }



}



interface rpcBlock {
    parentHash: string // [0] parentHash 
    sha3Uncles: string // [1] UncleHash 
    miner: string // [2] Coinbase
    stateRoot: string // [3] Root
    transactionsRoot: string // [4] TxHash
    receiptsRoot: string // [5] ReceiptHash
    logsBloom: string // [6] Bloom
    difficulty: string // [7] Difficulty
    number: string // [8] Number => bigInt
    gasLimit: string // [9] GasLimit => uint64 
    gasUsed: string // [10] GasUsed => uint64
    timestamp: string // [11] Time => uint64
    extraData: string // [12] Extra
    mixHash: string // [13] MixDigest => i.e: randao reveal
    nonce: string // [14] Nonce 
    baseFeePerGas: string // [15] BaseFee
    withdrawalsRoot: string // [16] WithdrawalsHash


    // This is the keccak256 hash of the RLP encoded block header (the fields above)
    hash: string // the block hash 

}


function bigNumberToHex(n: BigNumber) {
    if(n.isZero()){
        return "0x"; // 0 as zero length str 
        // FIXME: Why?? I saw go-ethereum did this, but I don't know why
    }
    return n.toHexString();
}


export async function getRandaoReveal(provider: providers.JsonRpcProvider, blockNumber: number) {

    const block = await provider.send(
        "eth_getBlockByNumber",
        [
            utils.hexlify(blockNumber), 
            false
        ]
    ) as rpcBlock;


    const fields = [
        utils.hexlify(block.parentHash),
        utils.hexlify(block.sha3Uncles),
        utils.hexlify(block.miner),
        utils.hexlify(block.stateRoot),
        utils.hexlify(block.transactionsRoot),
        utils.hexlify(block.receiptsRoot),
        utils.hexlify(block.logsBloom),
        bigNumberToHex(BigNumber.from(block.difficulty)),
        bigNumberToHex(BigNumber.from(block.number)),
        bigNumberToHex(BigNumber.from(block.gasLimit)),
        bigNumberToHex(BigNumber.from(block.gasUsed)),
        bigNumberToHex(BigNumber.from(block.timestamp)),
        utils.hexlify(block.extraData),
        utils.hexlify(block.mixHash),
        utils.hexlify(block.nonce),
        bigNumberToHex(BigNumber.from(block.baseFeePerGas)),
    ]; 

    // after shanghai update 
    if(block.withdrawalsRoot != null){
        fields.push(utils.hexlify(block.withdrawalsRoot));
    }

    const rlpHeader = utils.RLP.encode(fields);

    const hash = utils.keccak256(rlpHeader);

    if(hash != utils.hexlify(block.hash)) {
        throw new Error(`Hash mismatch ${hash} != ${block.hash}`);
    }


    return {
        rlpHeader,
        randaoReveal: utils.hexlify(block.mixHash),
    }
    
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

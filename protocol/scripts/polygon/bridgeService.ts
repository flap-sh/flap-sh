import {Axios} from "axios";
import { ethers } from "ethers";


// This file is a simple wrapper around the bridge service


// The bridge service (https://github.com/0xPolygonHermez/zkevm-bridge-service) 
// depolyed by the official Polygon team
const ProofGenearatorBaseURL = "https://proof-generator.polygon.technology";
  
export interface Proof {
    merkle_proof: string[]
    main_exit_root: string
    rollup_exit_root: string
}

interface ProofEnvelope{
    proof: Proof
}

interface DepositEnvelope {
    deposit: Deposit
}
  
export interface Deposit {
    leaf_type: number
    orig_net: number
    orig_addr: string
    amount: string
    dest_net: number
    dest_addr: string
    block_num: string
    deposit_cnt: string
    network_id: number
    tx_hash: string
    claim_tx_hash: string
    metadata: string
    ready_for_claim: boolean
}

export interface ErrorMessage{
    error: boolean
    message: string
    http_code: number
}
  

export enum BridgeServiceType {
    TESTNET = "testnet",
    // MAINNET = "mainnet",  // TODO: we only need testnet at tokyo
}


export interface BridgeServiceInterface {
    // get the proof to claim message 
    getProof(networkID:number, depositId: number): Promise<Proof>;
    // get the deposit information 
    getDeposit(networkID:number, depositId: number): Promise<Deposit>;
}


export class BridgeService implements BridgeServiceInterface {

    private con: Axios;
    private t: BridgeServiceType;

    constructor(t:BridgeServiceType = BridgeServiceType.TESTNET) {

        this.t = t;
        this.con = new Axios({
            baseURL: ProofGenearatorBaseURL,
            responseType: "json",
            transformResponse: (d) => JSON.parse(d),
        });
    }

    async getProof(networkID:number, depositId: number): Promise<Proof> {


        // https://github.com/0xPolygonHermez/zkevm-bridge-service/blob/main/proto/src/proto/bridge/v1/query.proto
        
        const response = await this.con.get<ProofEnvelope>(`/api/zkevm/${this.t}/merkle-proof`,{
            params: {
                net_id: networkID,
                deposit_cnt: depositId,
            }

        });

        return response.data.proof;
    }


    async getDeposit(networkID:number, depositId: number): Promise<Deposit> {

        const response = await this.con.get<DepositEnvelope>(`/api/zkevm/${this.t}/bridge`,{
            params: {
                net_id: networkID,
                deposit_cnt: depositId,
            }
        });

        if(response.status != 200){
            throw new Error(`Error getting deposit: ${response.status} ${(response.data as unknown as ErrorMessage).message}`);
        }

        return (response.data as DepositEnvelope).deposit;
    }

}

// Mock bridge service for testing 
// could be used for testing 
export class BridgeServiceMock implements BridgeServiceInterface {

    async getProof(networkID:number, depositId: number): Promise<Proof> {

        return {
            merkle_proof: Array.from({length: 32}, () => ethers.utils.hashMessage(`proof_${networkID}_${depositId}`)),
            main_exit_root:  ethers.utils.hashMessage(`main_exit_root_${networkID}_${depositId}`),
            rollup_exit_root: ethers.utils.hashMessage(`rollup_exit_root_${networkID}_${depositId}`),
        }
    }

    // the claim is always ready
    async getDeposit(networkID:number, depositId: number): Promise<Deposit> {

        return {
            leaf_type: 0,
            orig_net: 0,
            orig_addr: ethers.utils.hexlify(ethers.utils.randomBytes(20)),
            amount: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
            dest_net: 6,
            dest_addr: ethers.utils.hexlify(ethers.utils.randomBytes(20)),
            block_num: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
            deposit_cnt: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
            network_id: networkID,
            tx_hash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
            claim_tx_hash: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
            metadata: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
            ready_for_claim: true,
        }
    }

}
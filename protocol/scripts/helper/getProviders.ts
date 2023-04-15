import {providers, Signer} from "ethers";
import { ethers } from "hardhat";



interface MultiChainProvider {
    l1: providers.JsonRpcProvider;
    l2: providers.JsonRpcProvider;
}

interface MultiChainSigner {
    l1: Signer;
    l2: Signer;
    address: string;
}


export function getProviders(): MultiChainProvider {
    const l1 = new providers.JsonRpcProvider(process.env.L1_RPC_URL);
    const l2 = new providers.JsonRpcProvider(process.env.L2_RPC_URL);
    return {l1, l2};
}

export function getSigners(key?:string): MultiChainSigner {

    
    
    const {l1, l2} =getProviders();

    const l1Signer = new ethers.Wallet(key || process.env.PRIVATE_KEY!, l1);
    const l2Signer = new ethers.Wallet(key || process.env.PRIVATE_KEY!, l2);

    return {
        l1: l1Signer,
        l2: l2Signer,
        address:  l1Signer.address,
    }
}
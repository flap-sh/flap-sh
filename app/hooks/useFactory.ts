import { useChainId, useProvider } from "wagmi";
import { ethers } from "ethers";
import FactoryABI from "@/abi/IPoolFactory.json";
import { useEffect, useState } from "react";

const START = 585453;

function useFactoryContract(address: string): ethers.Contract {
    const provider = useProvider({ chainId: useChainId() });
    return new ethers.Contract(address, FactoryABI.abi, provider)
}

export function useFactory(address: string) {
    const contract = useFactoryContract(address);
    const [createdPools, setCreatedPools] = useState<string[]>([]);
    const [wlCollections, setWlCollections] = useState<string[]>([]);
    const newPoolEvent = contract.filters.NewPoolCreated();
    const collectionAddedEvent = contract.filters.CollectionAddedToWhitelist();


    const fetchCollections = async (): Promise<string[]> => {
        const events = await contract.queryFilter(collectionAddedEvent, START);
        return events.map((e) => e.args?._collection);
    }

    const fetchPools = async (): Promise<string[]> => {
        const events = await contract.queryFilter(newPoolEvent, START);
        return events.map((e) => e.args?._boxPoolAddress);
    }

    useEffect(() => {
        fetchPools().then((pools) => { setCreatedPools(pools) });
        fetchCollections().then((cols) => { setWlCollections(cols) });
    }, []);

    return { createdPools, wlCollections };
}

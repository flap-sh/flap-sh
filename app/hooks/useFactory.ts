import { useChainId, useProvider } from "wagmi";
import { ethers } from "ethers";
import FactoryABI from "@/abi/IPoolFactory.json";
import { useContext, useEffect, useState } from "react";
import { TransactionContext } from "@/context/transaction";
import { ContractsContext } from "@/context/contracts";
import { IOrder } from "@/interfaces";

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


export function useCreatePool(orders: IOrder[]) {
    const [pool, setPool] = useState<string>();
    const { wrap } = useContext(TransactionContext);
    const { factory } = useContext(ContractsContext);
    const contract = useFactoryContract(factory);
    const poolCreatedEvent = contract.filters.NewPoolCreated();

    const create = async () => {
        const cb = (
            receipt: ethers.providers.TransactionReceipt,
            setMessage: (msg: string) => void
        ) => {
            contract.queryFilter(
                poolCreatedEvent,
                receipt.blockNumber,
                receipt.blockNumber
            ).then((events) => {
                if (events[0]) {
                    const address = events[0].args?._boxPoolAddress;
                    setPool(address);
                    setMessage(`Pool address: ${address}`)
                } else {
                    setMessage(`create pool failed`)
                }
            });
        };

        wrap({
            address: factory as any,
            abi: FactoryABI.abi,
            functionName: "newPool",
            args: Object.values({
                orders: orders.map((o) => ({
                    collection: o.collection.address,
                    count: o.quantity,
                    price: ethers.utils.parseEther(o.price.toString()),
                })),
            }),
            cb,
        });
    };

    return { pool, create };
}

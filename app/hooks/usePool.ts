import { IPool, ICollection, IItem } from '@/interfaces'
import { useEffect, useState, useContext, useCallback } from 'react';
import { readContracts, useProvider } from 'wagmi';
import IPoolABI from "@/abi/IPool.json"
import { ethers } from 'ethers';
import { ContractsContext } from '@/context/contracts';
import { TransactionContext } from '@/context/transaction';

// const BOX_LOGO = "https://images.blur.io/_blur-prod/0xb03a572ee91aecbdfa8cef8196bf140a1e7410df/410-6f39d2441aece0db?w=64&h=64";
//
// const BOX_LOGO = "";

export const STATES = [
    "Mintable",
    "Refundable",
    "Revealable",
    "Redeemable",
    "All", // this is a special state just for the UI
];

const fetchPoolParams = async (pools: IPool[], collections: ICollection[]): Promise<IPool[]> => {
    const params = await readContracts({
        contracts: pools.map((pool) => {
            return {
                abi: IPoolABI.abi,
                address: pool.address as any,
                functionName: "params",
            }
        })
    });


    return pools.map((pool, index) => ({
        ...pool,
        id: (params[index] as any).poolID.toNumber(),
        orders: (params[index] as any).nftOrderBatches.map((o: any) => {
            const collection = collections.find(c => c.address === o.collection);
            return {
                quantity: o.count.toNumber(),
                price: ethers.utils.formatEther(o.price.toString()),
                collection,
            }
        }),
    }));
};

const fetchMintPrice = async (pools: IPool[]): Promise<IPool[]> => {
    const prices = await readContracts({
        contracts: pools.map((pool) => {
            return {
                abi: IPoolABI.abi,
                address: pool.address as any,
                functionName: "mintPrice",
            }
        })
    });

    return pools.map((pool, index) => ({
        ...pool,
        price: Number(ethers.utils.formatEther((prices[index] as any).toString()))
    }));
}

const fetchPoolState = async (pools: IPool[]): Promise<IPool[]> => {
    const states = await readContracts({
        contracts: pools.map((pool) => {
            return {
                abi: IPoolABI.abi,
                address: pool.address as any,
                functionName: "poolState",
            }
        })
    });

    return pools.map((pool, index) => ({
        ...pool,
        state: Number(states[index])
    }));
}

const fetchMinted = async (pools: IPool[]): Promise<IPool[]> => {
    const supplies = await readContracts({
        contracts: pools.map((pool) => {
            return {
                abi: IPoolABI.abi,
                address: pool.address as any,
                functionName: "currentSupply",
            }
        })
    });

    return pools.map((pool, index) => ({
        ...pool,
        minted: Number(supplies[index])
    }));
}

const fetchTotalSupply = async (pools: IPool[]): Promise<IPool[]> => {
    const supplies = await readContracts({
        contracts: pools.map((pool) => {
            return {
                abi: IPoolABI.abi,
                address: pool.address as any,
                functionName: "totalSupply",
            }
        })
    });

    return pools.map((pool, index) => ({
        ...pool,
        totalSupply: Number(supplies[index])
    }));
}

const fetchBalance = async (provider: any, pools: IPool[]): Promise<IPool[]> => {
    const balances = await Promise.all(pools.map((pool) => provider.getBalance(pool.address)));

    return pools.map((pool, index) => ({
        ...pool,
        balance: Number(ethers.utils.formatEther(balances[index].toString()))
    }));
}

export function usePools(
    addresses: string[],
    collections: ICollection[],
    trigger: boolean,
) {
    const [pools, setPools] = useState<IPool[]>([]);
    const provider = useProvider();

    useEffect(() => {
        if (collections.length === 0) return;
        let poolsToFetch: IPool[] = addresses.map(address => ({ address }));
        Promise.all(
            [
                fetchPoolParams(poolsToFetch, collections),
                fetchMintPrice(poolsToFetch),
                fetchPoolState(poolsToFetch),
                fetchMinted(poolsToFetch),
                fetchTotalSupply(poolsToFetch),
                fetchBalance(provider, poolsToFetch)
            ]
        ).then((res) => {
            for (const parts of res) {
                parts.forEach((part, index) => {
                    Object.assign(poolsToFetch[index], part);
                })
            }

            setPools(poolsToFetch);
        });
    }, [addresses, collections, trigger]);

    return { pools }
}

export function useItems(pools: IPool[]) {
    const [items, setItems] = useState<IItem[]>([]);

    useEffect(() => {
        Promise.all(pools.filter((pool) => (
            Number(pool.state) < 5 && Number(pool.minted) > 0
        )).map(async (pool: IPool) => {
            const owners = await readContracts({
                contracts: Array.from(Array(Number(pool.minted)).keys()).map((id) => {
                    return {
                        abi: IPoolABI.abi,
                        address: pool.address as any,
                        functionName: "ownerOf",
                        args: [id]
                    }
                }),
                allowFailure: true,
            });

            return owners.map((owner, index) => ({
                poolId: Number(pool.id),
                id: index,
                owner: String(owner),
                cost: Number(pool.price)
            }))
        })).then((res) => {
            setItems(res.flat());
        })
    }, [pools])

    return { items }
}

export function usePool(address?: string) {
    const { pools } = useContext(ContractsContext);
    const { wrap, multicall } = useContext(TransactionContext);
    const pool = pools.find(p => p.address === address);

    const mint = useCallback(async (addressOverride?: string, priceOverride?: number) => {
        const price = priceOverride ? priceOverride : pool?.price;
        wrap({
            address: addressOverride ? addressOverride : address as any,
            abi: IPoolABI.abi,
            functionName: "mintBox",
            args: [],
            value: ethers.utils.parseEther(String(price)).toString(),
        });
    }, [pool, address, wrap]);

    const refund = useCallback(async (ids: number[], addressOverride?: string) => {
        multicall(ids.map((id) => ({
            address: addressOverride ? addressOverride : address as any,
            abi: IPoolABI.abi,
            functionName: "refund",
            args: [id],
        })));
    }, [pool, address, multicall]);

    const redeem = useCallback(async (ids: number[], addressOverride?: string) => {
        multicall(ids.map((id) => ({
            address: addressOverride ? addressOverride : address as any,
            abi: IPoolABI.abi,
            functionName: "redeem",
            args: [id],
        })));
    }, [pool, address, multicall]);

    return { mint, refund, redeem }
}

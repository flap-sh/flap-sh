"use client"
import { ContractsContext } from "@/context/contracts";
import { IItem, IPool } from "@/interfaces";
import { useContext, useMemo, useState } from "react";
import { useAccount } from "wagmi"
import { STATES, usePool } from "@/hooks/usePool";

const ownedItemsForPool = (pool: IPool, items: IItem[]) => {
    return items.filter((item) => item.poolId === pool.id);
};

const poolOfItem = (pools: IPool[], item: IItem) => {
    return pools.find((pool) => pool.id === item.poolId);
};

const estimateValueForItem = (pools: IPool[], item: IItem) => {
    const pool = poolOfItem(pools, item);
    if (pool?.state !== 3) {
        return item.cost
    }

    return Number(pool.balance) / Number(pool.minted);
};

export default function Portfolio() {
    const { address } = useAccount();
    const { pools: allPools, items: allItems } = useContext(ContractsContext);
    const [selected, setSelected] = useState<IPool | null>(null);
    const [filter, setFilter] = useState<number>(4);
    const [selectedItems, setSelectedItems] = useState<IItem[]>([]);
    const { mint, refund, redeem } = usePool();

    const walletItems = useMemo(() => {
        return allItems.filter((item) => item.owner === address);
    }, [allItems, address]);

    const walletPools = useMemo(() => {
        const addrs = Array.from(new Set(walletItems.map((item) => item.poolId)));
        return allPools.filter((pool) => addrs.includes(Number(pool.id)));
    }, [walletItems, allPools]);

    const items = useMemo(() => {
        if (selected) {
            return walletItems.filter((item) => item.poolId === selected.id);
        }

        return walletItems
    }, [selected, walletItems]);

    const pools = useMemo(() => {
        if (filter !== 4) {
            return walletPools.filter((pool) => pool.state === filter);
        }

        return walletPools;
    }, [filter, walletPools]);


    const title = useMemo(() => {
        if (selected) {
            return `Pool#${selected.id}`;
        }

        return "All items";
    }, [selected]);

    const estValue = useMemo(() => {
        return items.reduce((acc, item) => acc + estimateValueForItem(pools, item), 0);
    }, [items, pools]);

    const totalCost = useMemo(() => {
        return items.reduce((acc, item) => acc + item.cost, 0);
    }, [items]);

    const minted = useMemo(() => {
        if (selected) {
            return selected.minted + "/" + selected.totalSupply;
        }

        return items.length + "/" + items.length;
    }, [items, selected]);

    const activePools = useMemo(() => {
        const activePoolAddrs = Array.from(
            new Set(walletItems.map((item) => item.poolId))
        );

        return walletPools.filter((pool) => activePoolAddrs.includes(Number(pool.id)));
    }, [walletItems, walletPools]);


    const hideMint = useMemo(() => {
        if (selected) {
            return selected.state !== 0;
        }

        return activePools.filter((pool) => pool.state === 0).length === 0
    }, [selected, activePools]);

    const hideRefund = useMemo(() => {
        if (selected) {
            return selected.state !== 1;
        }

        return activePools.filter((pool) => pool.state === 1).length === 0
    }, [selected, activePools]);

    const hideReedem = useMemo(() => {
        if (selected) {
            return selected.state !== 3;
        }

        return activePools.filter((pool) => pool.state === 3).length === 0
    }, [selected, activePools]);

    const hideToolbar = useMemo(() => {
        if (!selected) {
            return true
        }

        return hideMint && hideRefund && hideReedem
    }, [hideMint, hideRefund, hideReedem])

    const onSelect = (item: IItem) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    return (
        <main className="grid grid-cols-12">
            <div className="col-span-4">
                <span className="border border-solid border-gray-300 px-6 py-2 w-full inline-block">
                    Pools
                </span>
                <span
                    className="border border-solid border-gray-300 px-6 py-2 w-full inline-block"
                >
                    <div className="space-y-1">
                        {Object.values(STATES).map((state: string, idx: number) => (
                            <div key={idx} className="flex items-center">
                                <input
                                    id={state.toString()}
                                    type="radio"
                                    checked={filter === idx}
                                    onChange={() => setFilter(idx)}
                                    className="h-3 w-3 border-gray-300 text-gray-300 focus:text-gray-300"
                                />
                                <label htmlFor={state} className="ml-3 block text-sm font-medium leading-6 text-gray-300">
                                    {state}
                                </label>
                            </div>
                        ))}
                    </div>
                </span>
                {/* pool list */}
                <div className="border border-solid border-gray-300 grid grid-cols-3 px-5 leading-10">
                    {/* table head */}
                    <span className="w-10">Id</span>
                    <span className="w-20">Owned</span>
                    <span className="">State</span>
                </div>
                {/* items */}
                <div
                    className="border border-solid border-gray-300 leading-10 hover:cursor-pointer text-center"
                    onClick={() => setSelected(null)}
                >
                    All items
                </div>
                {pools.map((pool: IPool, idx: number) => (
                    <div
                        key={idx}
                        className="border border-solid border-gray-300 grid grid-cols-3 px-5 leading-10 hover:cursor-pointer"
                        onClick={() => setSelected(pool)}
                    >
                        <span className="w-10">#{pool.id}</span>
                        <span className="w-20">
                            {ownedItemsForPool(pool, walletItems).length}
                        </span>
                        <span>{STATES[Number(pool.state)]}</span>
                    </div>
                ))}
            </div>

            {/* collection info */}
            <div className="col-span-8 border border-solid border-gray-300 px-6 py-2 w-full inline-block pb-5">
                <div className="grid grid-cols-6 grid-gap-4 pb-5">
                    <span className="text-lg col-span-3">{title}</span>
                    <span className="text-sm">EST Value</span>
                    <span className="text-sm">Cost</span>
                    <span className="text-sm">Minted</span>
                    <span className="text-sm col-span-3 text-gray-500">{items.length}</span>
                    <span className="text-md">{estValue}&nbsp;E</span>
                    <span className="text-md">{totalCost}&nbsp;E</span>
                    <span className="text-md text-center">{minted}</span>
                </div>

                {/* List here */}
                <div className="border-t border-solid">
                    <div className="grid grid-cols-5 grid-gap-4 pt-6">
                        <span></span>
                        <span>Pool</span>
                        <span>Id</span>
                        <span>Cost</span>
                        <span>EST Value</span>
                    </div>
                    <div>
                        {items.map((item: IItem, idx: number) => (
                            <div key={idx} className="grid grid-cols-5 grid-gap-4 pt-3">
                                <div className="text-center">
                                    {selected && <input
                                        type="checkbox"
                                        className="w-3"
                                        onChange={() => onSelect(item)}
                                    />}
                                </div>
                                <span>#{item.poolId}</span>
                                <span>#{item.id}</span>
                                <span>{item.cost}&nbsp;E</span>
                                <span>{estimateValueForItem(walletPools, item)}&nbsp;E</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom actions */}
                <div className={`border-t border-solid pt-5 mt-10 text-right`} hidden={hideToolbar}>
                    <button
                        className="border border-solid border-gray-100 py-1 px-3 text-xs"
                        hidden={hideMint}
                        onClick={() => mint(selected?.address, selected?.price)}
                    >
                        Mint
                    </button>

                    <button
                        className="border border-solid border-gray-100 py-1 px-3 text-xs ml-5"
                        hidden={hideRefund}
                        onClick={() => refund(selectedItems.map((i) => (i.id)), selected?.address)}
                    >
                        Refund
                    </button>

                    <button
                        className="border border-solid border-gray-100 py-1 px-3 text-xs ml-5"
                        hidden={hideReedem}
                        onClick={() => redeem(selectedItems.map((i) => (i.id)), selected?.address)}
                    >
                        Reedem
                    </button>
                </div>
            </div>
        </main >
    )
}

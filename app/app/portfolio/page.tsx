"use client"
import { ContractsContext } from "@/context/contracts";
import { IItem, IPool } from "@/interfaces";
import { useContext, useMemo, useState } from "react";
import { useAccount } from "wagmi"
import { STATES } from "@/hooks/usePool";


const ownedItemsForPool = (pool: IPool, items: IItem[]) => {
    return items.filter((item) => item.collection.address === pool.address);
};

export default function Portfolio() {
    const { address } = useAccount();
    const { pools: allPools, items: allItems } = useContext(ContractsContext);
    const [selected, _setSelected] = useState<IPool | null>(null);
    const [filter, setFilter] = useState<number>(4);

    const pools = useMemo(() => {
        if (filter !== 4) {
            return allPools.filter((pool) => pool.state === filter);
        }

        return allPools;
    }, [allPools, filter]);

    const walletItems = useMemo(() => {
        // TODO: return allItems.filter((item) => item.owner === address);
        return allItems
    }, [allItems, address]);

    const items = useMemo(() => {
        if (selected) {
            return walletItems.filter((item) => item.collection.address === selected.address);
        }

        return walletItems
    }, [selected, allItems, address]);

    const hideToolbar = useMemo(() => {
        return selected === null;
    }, [selected]);

    const title = useMemo(() => {
        if (selected) {
            return `Pool#${selected.id}`;
        }

        return "All items";
    }, [selected]);

    const totalCost = useMemo(() => {
        return items.reduce((acc, item) => acc + item.cost, 0);
    }, [items]);

    const currentSupply = useMemo(() => {
        if (selected) {
            return selected.currentSupply + "/" + selected.totalSupply;
        }

        return items.length + "/" + items.length;
    }, [items]);

    return (
        <main className="grid grid-cols-12">
            <div className="col-span-4">
                <span className="border border-solid border-gray-300 px-6 py-2 w-full inline-block">
                    Pools
                </span>
                <span
                    className="border-x border-solid border-gray-300 px-6 py-2 w-full inline-block"
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
                {pools.map((pool: IPool, idx: number) => (
                    <div key={idx} className="border border-solid border-gray-300 grid grid-cols-3 px-5 leading-10">
                        <span className="w-10">{pool.id}</span>
                        <span className="w-20">
                            {ownedItemsForPool(pool, walletItems).length}
                        </span>
                        <span>{STATES[pool.state]}</span>
                    </div>
                ))}
            </div>

            {/* collection info */}
            <div className="col-span-8 border border-solid border-gray-300 px-6 py-2 w-full inline-block pb-5">
                <div className="grid grid-cols-6 grid-gap-4 pb-5">
                    <span className="text-lg col-span-3">{title}</span>
                    <span className="text-sm">EST Value</span>
                    <span className="text-sm">Cost</span>
                    <span className="text-sm">Currrent Supply</span>
                    <span className="text-sm col-span-3 text-gray-500">{items.length}</span>
                    <span className="text-md">10E</span>
                    <span className="text-md">{totalCost}&nbsp;E</span>
                    <span className="text-md">{currentSupply}</span>
                </div>

                {/* List here */}
                <div className="border-t border-solid">
                    <div className="grid grid-cols-8 grid-gap-4 pt-6">
                        <span></span>
                        <span>id</span>
                        <span>cost</span>
                    </div>
                    <div>
                        {items.map((item: IItem, idx: number) => (
                            <div key={idx} className="grid grid-cols-8 grid-gap-4 pt-3">
                                <div className="text-center">
                                    <input type="checkbox" className="w-3" />
                                </div>
                                <span>{item.id}</span>
                                <span>{item.cost}&nbsp;E</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom actions */}
                <div className={`border - t border - solid pt - 4 pb - 3`} hidden={hideToolbar}>
                    <button
                        className="border border-solid border-gray-100 py-1 px-3"
                    >
                        mb refund
                    </button>
                </div>
            </div>
        </main >
    )
}

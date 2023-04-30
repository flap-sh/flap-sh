"use client"
import { ContractsContext } from "@/context/contracts"
import { ICollection, IPool } from "@/interfaces";
import { useContext, useMemo } from "react"
import Item from "./item";

const fixed = (value: number) => {
    return Number(value.toFixed(3));
};

export default function Collections() {
    const { pools, collections } = useContext(ContractsContext)

    const cols = useMemo(() => calCollections(collections, pools), [collections, pools]);

    return (
        <main>
            {/* title */}
            <div className="text-left">
                <span className="max-w-2xl inline-block">
                    List of supported collections.
                </span>
                <div className="flex flex-row align-center pb-8 pt-10">
                    <div className="text-2xl pr-3">Collections</div>
                </div>
            </div>

            {/* Collections */}
            <div className="px-8 text-left">
                <div className="grid grid-cols-4 pb-3 font-bold">
                    <span>collection</span>
                    <span>address</span>
                    <span>avg price</span>
                    <span>count</span>
                </div>
                {cols.map((col: ICollection) => (
                    <div key={col.address} className="py-2">
                        <Item pools={pools} collection={col} />
                    </div>
                ))}
            </div>
        </main>
    )
}

const calCollections = (collections: ICollection[], pools: IPool[]): ICollection[] => {
    const cols: Record<string, ICollection> = collections.reduce(
        (obj: Record<string, ICollection>, item: ICollection) => ({
            ...obj,
            [item.address]: {
                ...item,
                price: 0,
                count: 0,
            }
        }),
        {}
    );

    pools.filter((p) => p.state === 0).forEach((pool) => {
        pool.orders?.forEach((order) => {
            const addr = order.collection.address;
            const [c, p] = [cols[addr].count, cols[addr].price];
            const count: number = c ? Number(c) : 0;
            const price: number = p ? Number(p) : 0;

            cols[addr].price = fixed((price * count + Number(order.price) * order.quantity) / (count + order.quantity));
            cols[addr].count = count + order.quantity;
        });
    });

    return Object.values(cols);
}

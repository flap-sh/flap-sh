"use client"
import Image from "next/image"
import { ContractsContext } from "@/context/contracts"
import { ICollection } from "@/interfaces";
import { useContext, useMemo } from "react"

const fixed = (value: number) => {
    return Number((Math.round(value * 100) / 100).toFixed(2));
};

export default function() {
    const { pools, collections } = useContext(ContractsContext)

    const cols = useMemo(() => {
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

        pools.forEach((pool) => {
            pool.orders?.forEach((order) => {
                const addr = order.collection.address;
                const [c, p] = [cols[addr].count, cols[addr].price];
                const count: number = c ? Number(c) : 0;
                const price: number = p ? Number(p) : 0;
                cols[addr].price = fixed((price * count + Number(order.price)) / (count + 1));
                cols[addr].count = count + 1;
            });
        });

        return Object.values(cols);
    }, [collections, pools]);

    return (
        <main>
            {/* title */}
            <div className="text-left">
                <span className="max-w-2xl inline-block">
                    List of supported collections and the pools which contain them. <br />
                </span>
                <div className="flex flex-row align-center pb-8 pt-10">
                    <div className="text-2xl pr-3">Collections</div>
                </div>
            </div>

            {/* Collections */}
            <div className="grid grid-cols-4 pb-3 font-bold">
                <span>address</span>
                <span>collection</span>
                <span>price</span>
                <span>count</span>
            </div>
            {cols.map((col: ICollection) => (
                <div key={col.address} className="py-2">
                    <div className="grid grid-cols-4">
                        <span>{col.address.slice(0, 6) + "..." + col.address.slice(38, 42)}</span>
                        <span className="flex flex-row items-center">
                            <Image
                                height={15}
                                width={15}
                                className="mr-2"
                                src={col.logo}
                                alt={col.address}
                            />
                            {col.name}
                        </span>
                        <span>{col.price}</span>
                        <span>{col.count}</span>
                    </div>
                </div>
            ))}
        </main>
    )
}

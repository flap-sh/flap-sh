import Image from "next/image"
import { IPool, ICollection } from "@/interfaces"
import { Disclosure } from '@headlessui/react'
import { useMemo } from "react";
import { usePool } from "@/hooks/usePool"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

export default function Item({ pools: allPools, collection: col }: { pools: IPool[], collection: ICollection }) {
    const pools = useMemo(() =>
        allPools.filter(
            (p) => {
                const state = p.state;
                if (state != 0) return false;

                const orders = p.orders?.filter((o) => o.collection.address === col.address);
                return orders?.length ? true : false;
            }
        ), [allPools, col.address]
    );

    const hidden = useMemo(() => pools.length ? false : true, [pools]);

    return (
        <Disclosure as="div" className="pt-3">
            <Disclosure.Button className="w-full text-left" disabled={hidden}>
                <div className="grid grid-cols-4">
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
                    <span>{col.address.slice(0, 6) + "..." + col.address.slice(38, 42)}</span>
                    <span><FontAwesomeIcon icon={faEthereum} /> {col.price}</span>
                    <span>{col.count}</span>
                </div>
            </Disclosure.Button>
            <Disclosure.Panel
                as="div"
                className={"items-center w-full justify-center" + ` ${hidden ? "hidden" : ""}`}
            >
                <div className="border border-solid border-gray-300 mt-5 my-3 pt-8 px-10 max-w-xl pb-8">
                    <div className="grid grid-cols-8 gap-6">
                        <span>pool</span>
                        <span className="col-span-2">address</span>
                        <span>odds</span>
                        <span>count</span>
                        <span className="col-span-2">price</span>
                    </div>
                    {pools.map((pool) => (
                        <Pool key={pool.id} collection={col} pool={pool} />
                    ))}
                </div>
            </Disclosure.Panel>
        </Disclosure>
    )
}

function Pool({ collection: col, pool }: { collection: ICollection, pool: IPool }) {
    const { mint } = usePool(pool.address);

    const { count, odds } = useMemo(() => {
        const count = pool.orders?.filter((o) => o.collection.address === col.address)
            .map((o) => o.quantity)
            .reduce((acc, c) => acc + c, 0);

        const odds = count ? Number(pool.orders?.map((o) => o.quantity)) / Number(count) : 0;

        return { count, odds }
    }, [col.address, pool.orders]);

    return (
        <div className={"grid grid-cols-8 gap-6 pt-3 " + `${odds > 0 ? "" : "hidden"}`}>
            <span>#{pool.id}</span>
            <span className="col-span-2">{pool.address.slice(0, 6) + "..." + pool.address.slice(38, 42)}</span>
            <span>{odds * 100}%</span>
            <span>{count}</span>
            <span className="col-span-2"><FontAwesomeIcon icon={faEthereum} /> {pool.price?.toFixed(3)}</span>
            <span>
                <button
                    className="border border-solid border-gray-300 py-1 px-3 text-xs"
                    onClick={() => mint()}
                >
                    mint
                </button>
            </span>
        </div>
    )
}

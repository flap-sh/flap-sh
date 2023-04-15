"use client"
import Image from "next/image"
import { Disclosure } from '@headlessui/react'
import { IPool } from "@/interfaces"
import { useContext, useMemo } from "react";
import { ContractsContext } from "@/context/contracts";
import { STATES, usePool } from "@/hooks/usePool"
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

const fixed = (value: number) => {
    return (Math.round(value * 100) / 100).toFixed(2);
};

export default function Home() {
    const { pools } = useContext(ContractsContext);

    return (
        <main className="pt-5">
            <div className="text-left">
                <span className="max-w-xl inline-block">
                    list of pools created with this protocol, each pool has mixed several collections as a new collection,
                    sure, with new mint price as well! what about mint Azuki at <FontAwesomeIcon icon={faEthereum} beat /> 0.08 again?
                </span>
                <div className="flex flex-row align-center pb-8 pt-10">
                    <div className="text-2xl pr-3">Pools</div>
                    <a href="/create" className="w-5 hover:cursor-pointer flex items-center">
                        <FontAwesomeIcon icon={faPlus} />
                    </a>
                </div>
            </div>
            <div className="grid grid-cols-6 pb-3 font-bold">
                <span className="text-center">id</span>
                <span>address</span>
                <span>collections</span>
                <span>state</span>
                <span>price</span>
                <span>minted</span>
            </div>
            <div> {/* pool list */}
                {pools.map((d: IPool, idx: number) => (
                    <PoolItem key={idx} detail={d} />
                ))}
            </div>
        </main>
    )
}

function PoolItem({ detail: d }: { detail: IPool }) {
    const { mint } = usePool(d.address);

    const total = useMemo(() => (
        d.orders?.reduce((acc, c) => acc + c.quantity, 0)
    ), [d]);

    return (
        <Disclosure as="div" className="pt-3">
            <Disclosure.Button className="w-full text-left">
                <div className="grid grid-cols-6">
                    <span className="text-center">#{d.id}</span>
                    <span>{d.address.slice(0, 6) + "..." + d.address.slice(38, 42)}</span>
                    <span className="flex flex-row items-center">
                        {/* TODO: sorting */}
                        {d.orders?.map((c, idx) => (
                            <Image
                                key={idx}
                                height={15}
                                width={15}
                                className="mr-2"
                                src={c.collection.logo}
                                alt={c.collection.address}
                            />
                        ))}
                    </span>
                    <span>{STATES[d.state ? d.state : 0]}</span>
                    <span><FontAwesomeIcon icon={faEthereum} /> {fixed(Number(d.price))}</span>
                    <span>{d.minted}/{d.totalSupply}</span>
                </div>
            </Disclosure.Button>
            <Disclosure.Panel
                as="div"
                className="flex items-center w-full justify-center"
            >
                <div className="border border-solid border-gray-300 mt-5 my-3 pt-8 px-10 max-w-xl pb-8">
                    <div className="grid grid-cols-4 text-center">
                        <span className="col-span-2">collection</span>
                        <span>address</span>
                        <span>chance</span>
                    </div>
                    {d.orders?.map((o, idx) => (
                        <div key={idx} className="grid grid-cols-4 pt-3 text-center">
                            <span className="flex flex-row items-center justify-center col-span-2">
                                <Image
                                    height={15}
                                    width={15}
                                    className="mr-2"
                                    src={o.collection.logo}
                                    alt={o.collection.address}
                                />
                                {o.collection.name}
                            </span>
                            <span>{o.collection.address?.slice(0, 6)}...{o.collection.address?.slice(38, 42)}</span>
                            <span>{fixed(o.quantity / Number(total) * 100)}%</span>
                        </div>
                    ))}

                    {/* tools */}
                    <div className="w-full text-right" hidden={d.state !== 0}>
                        <div className="max-w-xl mt-5 pt-5 border-t border-solid border-gray-300">
                            <button
                                className="border border-solid border-gray-300 py-1 px-3 text-sm"
                                onClick={() => mint()}
                            >
                                mint
                            </button>
                        </div>
                    </div>
                </div>
            </Disclosure.Panel>
        </Disclosure>
    )
}

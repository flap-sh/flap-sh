"use client"
import Image from "next/image"
import { Disclosure } from '@headlessui/react'
import { IPool } from "@/interfaces"
import { useContext, useEffect, useMemo, useState } from "react";
import { ContractsContext } from "@/context/contracts";
import { STATES, usePool } from "@/hooks/usePool"
import { faPlus, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { Dropdown } from "@/app/index/dropdown";
import Pagination from "@/components/Pagination";

const fixed = (value: number) => {
    return (Math.round(value * 100) / 100).toFixed(2);
};

export default function Home() {
    const { pools: rawPools } = useContext(ContractsContext);
    const [pools, setPools] = useState(rawPools);
    const [list, setList] = useState<IPool[]>([]);

    useEffect(() => {
        setPools([rawPools, rawPools].flat());
        // setPools(rawPools.filter((d: IPool) => d.state === 0));
    }, [rawPools]);

    const filterState = (state: number) => {
        if (state == 4) {
            setPools(rawPools);
            return;
        }

        const newPools = rawPools.filter((d: IPool) => d.state === state);
        setPools(newPools);
    };

    const sortPrice = () => {
        let newPools = [...pools];
        newPools.sort((a, b) => Number(a.price) - Number(b.price))
        setPools(newPools);
    };

    return (
        <main className="pt-5">
            <div className="text-left">
                <span className="max-w-2xl inline-block">
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
                <span className="flex flex-col">
                    <Dropdown filterState={filterState} />
                </span>
                <span className="flex flex-row items-center">
                    <span>price</span>
                    <FontAwesomeIcon
                        icon={faSortDown}
                        onClick={sortPrice}
                        className="pl-1 pb-1 hover:cursor-pointer"
                    />
                </span>
                <span>minted</span>
            </div>
            <div> {/* pool list */}
                {list.map((d: IPool, idx: number) => (
                    <PoolItem key={idx} detail={d} />
                ))}
            </div>
            <Pagination<IPool> count={10} all={pools} setList={setList} />
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
                        <span>odds</span>
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

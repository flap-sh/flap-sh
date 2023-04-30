import Image from "next/image"
import { IPool } from "@/interfaces"
import { Disclosure } from '@headlessui/react'
import { useMemo } from "react";
import { STATES, usePool } from "@/hooks/usePool"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

const fixed = (value: number) => {
    return Number(value.toFixed(3));
};

export default function Item({ detail: d }: { detail: IPool }) {
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

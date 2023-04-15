"use client"
import Image from "next/image"
import { Disclosure } from '@headlessui/react'
import { IPoolDetail } from "@/interfaces"

const data = [{
    "id": "1",
    "address": "0x00",
    "orders": [{
        collection: {
            name: "abc",
            logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
            address: "0x00",
        },
        quantity: 50,
        price: 1,
    },
    {
        collection: {
            name: "abc",
            logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
            address: "0x00",
        },
        quantity: 50,
        price: 1,
    }],
    "status": "Mintable",
    "price": "0.5",
    "minted": "10",
    "totalSupply": "100"
}, {
    "id": "2",
    "address": "0x00",
    "orders": [{
        collection: {
            name: "abc",
            logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
            address: "0x00",
        },
        quantity: 50,
        price: 1,

    },
    {
        collection: {
            name: "abc",
            logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
            address: "0x00",
        },
        quantity: 50,
        price: 1,
    }],
    "status": "Mintable",
    "price": "0.5",
    "minted": "10",
    "totalSupply": "100"
}];

export default function Home() {
    return (
        <main className="pt-5">
            <div className="text-left">
                <span className="max-w-xl inline-block">
                    list of pools created with this protocol, each pool has mixed several collections as a new collection,
                    sure, with new mint price as well! what about mint Azuki at 0.08 again?
                </span>
                <div className="flex flex-row align-center pb-8 pt-10">
                    <div className="text-2xl pr-3">Pools</div>
                    <a href="/create" className="w-5 hover:cursor-pointer flex items-center">
                        +
                    </a>
                </div>
            </div>
            <div className="grid grid-cols-6 pb-3 font-bold">
                <span>id</span>
                <span>address</span>
                <span>collections</span>
                <span>status</span>
                <span>price</span>
                <span>minted</span>
            </div>
            <div> {/* collection list */}
                {data.map((d, idx) => (
                    <PoolItem key={idx} detail={d as any} />
                ))}
            </div>
        </main>
    )
}

function PoolItem({ detail: d }: { detail: IPoolDetail }) {
    return (
        <Disclosure as="div" className="pt-3">
            <Disclosure.Button className="w-full text-left">
                <div className="grid grid-cols-6">
                    <span>#{d.id}</span>
                    <span>{d.address}</span>
                    <span className="flex flex-row items-center">
                        {/* TODO: sorting */}
                        {d.orders.map((c, idx) => (
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
                    <span>{d.status}</span>
                    <span>{d.price}E</span>
                    <span>{d.minted}/{d.totalSupply}</span>
                </div>
            </Disclosure.Button>
            <Disclosure.Panel
                as="div"
                className="border border-solid border-gray-300 mt-3 pt-8 px-10 max-w-xl"
            >
                <div className="grid grid-cols-3 text-center">
                    <span>collection</span>
                    <span>filled</span>
                    <span>chance</span>
                </div>
                {d.orders.map((o, idx) => (
                    <div key={idx} className="grid grid-cols-3 pt-3 text-center">
                        <span className="flex flex-row items-center justify-center">
                            <Image
                                height={15}
                                width={15}
                                className="mr-2"
                                src={o.collection.logo}
                                alt={o.collection.address}
                            />
                            {o.collection.name}
                        </span>
                        <span>5/{o.quantity}</span>
                        <span>20%</span>
                    </div>
                ))}

                {/* tools */}
                <div className="w-full text-right">
                    <div className="max-w-xl mt-5 p-3 py-5 border-t border-solid border-gray-300">
                        <button className="border border-solid border-gray-300 py-1 px-3 text-sm">
                            mint
                        </button>
                    </div>
                </div>
            </Disclosure.Panel>
        </Disclosure>
    )

}

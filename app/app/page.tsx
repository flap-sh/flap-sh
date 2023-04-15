"use client"
import Image from "next/image"

const data = [{
    "id": "1",
    "address": "0x00",
    "collections": [{
        logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
        address: "0x00"
    },
    {
        logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
        address: "0x00"
    }],
    "status": "Mintable",
    "price": "0.5",
    "minted": "10",
    "totalSupply": "100"
}, {
    "id": "2",
    "address": "0x00",
    "collections": [{
        logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
        address: "0x00"
    },
    {
        logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
        address: "0x00"
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
            <div className="grid grid-cols-6">
                <span>id</span>
                <span>address</span>
                <span>collections</span>
                <span>status</span>
                <span>price</span>
                <span>minted</span>
            </div>
            <div> {/* collection list */}
                {data.map((d, idx) => (
                    <div key={idx} className="grid grid-cols-6 leading-10">
                        <span>#{d.id}</span>
                        <span>{d.address}</span>
                        <span className="flex flex-row items-center h-10">
                            {/* TODO: sorting */}
                            {d.collections.map((c, idx) => (
                                <Image key={idx} height={20} width={20} className="mr-2" src={c.logo} alt={c.address} />
                            ))}
                        </span>
                        <span>{d.status}</span>
                        <span>{d.price}E</span>
                        <span>{d.minted}/{d.totalSupply}</span>
                    </div>
                ))}
            </div>
        </main>
    )
}

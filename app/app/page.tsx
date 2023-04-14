"use client"

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
                    <a href="#" className="w-5 hover:cursor-pointer flex items-center">
                        +
                    </a>
                </div>

            </div>
            <table className="table-auto w-full text-left">
                <thead >
                    <tr>
                        <th>id</th>
                        <th>address</th>
                        <th>collections</th>
                        <th>status</th>
                        <th>price</th>
                        <th>minted</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map((d, idx) => (
                        <tr key={idx} className="leading-10">
                            <td>#{d.id}</td>
                            <td>{d.address}</td>
                            <td className="flex flex-row items-center h-10">
                                {/* TODO: sorting */}
                                {d.collections.map((c, idx) => (
                                    <img key={idx} className="w-5 mr-2" src={c.logo} alt={c.address} />
                                ))}
                            </td>
                            <td>{d.status}</td>
                            <td>{d.price}E</td>
                            <td>{d.minted}/{d.totalSupply}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    )
}

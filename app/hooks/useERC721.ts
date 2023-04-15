import { ICollection, IPool, IItem } from "@/interfaces"
import { useEffect, useState } from "react"
import { readContracts } from "wagmi";
import IPoolABI from "@/abi/IPool.json";

import { items } from "@/context/mock"

const LOGOS: Record<string, string> = {
    "0x45c05abdb37942ff4ad0bfc7a8af9bf5b43e1204": "0xbd3531da5cf5857e7cfaa92426877b022e612cf8", // Penny-bridged
    "0xc530104a5fcef9741214b43078edb7f46d08d4f4": "0xed5af388653567af2f388e6224dc7c4b3241c544", // Azuki-bridged
    "0xf607d6f9b2cdd1d72d8f2122db4852d04da9ed0f": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", // BAYC-bridged
    "0x26d19d42fa0ed1b4d25511e9732cffa299ff8cbf": "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb", // Punk-bridged
    "0xe610e10aa19ceee9e6ab264041bec304f6de256e": "0x8a90cab2b38dba80c64b7734e58ee1db38b8992e", // Doodles-bridged
}

const getLogo = (addr: string): string => {
    let logo = LOGOS[addr.toLowerCase()];
    if (logo === undefined) {
        logo = "0x60e4d786628fea6478f785a6d7e704777c86a7c6";
    }

    return `https://logo.nftscan.com/logo/${logo}.png`;
}

const fetchCollections = async (wl: string[]) => {
    const names = await readContracts({
        contracts: wl.map((address) => {
            return {
                abi: IPoolABI.abi,
                address: address as any,
                functionName: "name",
            }
        })
    })

    return wl.map((address, index) => ({
        address,
        name: String(names[index]),
        logo: getLogo(address)
    }));
}

export function useCollections(createdCollections: string[]) {
    const [collections, setCollections] = useState<ICollection[]>([]);

    useEffect(() => {
        console.log(createdCollections);
        fetchCollections(createdCollections)
            .then((cols) => { setCollections(cols) })
    }, [createdCollections])

    return { collections }
}

export function useItems(_pools: IPool[]) {
    const [_items, _setItems] = useState<IItem[]>([]);

    // TODO: batch items from pools

    return { items }
}

"use client"
import { IPool } from "@/interfaces"
import { useContext, useEffect, useState } from "react";
import { ContractsContext } from "@/context/contracts";
import { faPlus, faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import Pagination from "@/components/Pagination";
import Dropdown from "./dropdown";
import PoolItem from "./item";

export default function Pools() {
    const { pools: rawPools } = useContext(ContractsContext);
    const [pools, setPools] = useState(rawPools);
    const [list, setList] = useState<IPool[]>([]);

    useEffect(() => {
        setPools(rawPools);
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


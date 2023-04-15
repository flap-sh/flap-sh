/**
 * Context for the contracts
 *
 * this context is actually a database for now lmao
 */
import { createContext, useMemo, useState } from 'react';
import { IContractsContext } from '@/interfaces';
import { pools as ops, collections as ocs, items as ois } from "./mock"

export const ContractsContext = createContext<IContractsContext>({
    factory: "",
    collections: [],
    pools: [],
    items: []
});


export function ContractsProvider({ children }: { children: React.ReactNode }) {
    const factory = "0x000";

    const [pools, _setPools] = useState(ops);
    const [collections, _setCollections] = useState(ocs);
    const [items, _setItems] = useState(ois);

    // TODO: get this with useMemo and contract calls
    //
    // const items = useMemo(() => {
    //     return pools.reduce((acc, pool) => {
    //         return acc.concat(pool.items);
    //     }, []);
    // }, []);
    //

    // TODO: fetch data from contracts and set them here
    //
    // -> long promise chain

    return (
        <ContractsContext.Provider value={{ factory, collections, pools, items }}>
            {children}
        </ContractsContext.Provider>
    );
}

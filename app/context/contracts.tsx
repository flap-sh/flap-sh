/**
 *  Context for the contracts
 */

import { createContext } from 'react';

export interface IContractsContext {
    factory: string;
    /// whitelisted collections.
    collections: string[];
    /// all pools.
    pools: string[];
    /// all items in this protocol.
    ///
    /// well this context is actually a database!
    items: string[];
}

export const ContractsContext = createContext<IContractsContext>({
    factory: "",
    collections: [],
    pools: [],
    items: []
});

export function ContractsProvider({ children }: { children: React.ReactNode }) {
    const factory = "0x000";
    const collections = ["0x000"];
    const pools = ["0x000"];
    const items = ["0x000"];


    return (
        <ContractsContext.Provider value={{ factory, collections, pools, items }}>
            {children}
        </ContractsContext.Provider>
    );
}

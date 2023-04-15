/**
 * Context for the contracts
 *
 * this context is actually a database for now lmao
 */
import { createContext } from 'react';
import { IContractsContext } from '@/interfaces';
import { useFactory } from '@/hooks/useFactory';
import { useCollections } from '@/hooks/useERC721';
import { usePools, useItems } from "@/hooks/usePool";

export const ContractsContext = createContext<IContractsContext>({
    createdPools: [],
    wlCollections: [],
    factory: "",
    collections: [],
    pools: [],
    items: []
});

export function ContractsProvider({ children }: { children: React.ReactNode }) {
    const factory = "0x8B8AC8377538502902Feedda53D1d1d30518215e";
    const { createdPools, wlCollections } = useFactory(factory);
    const { collections } = useCollections(wlCollections);
    const { pools } = usePools(createdPools, collections);
    const { items } = useItems(pools);

    return (
        <ContractsContext.Provider value={{
            factory,
            createdPools,
            wlCollections,
            collections,
            pools,
            items
        }}>
            {children}
        </ContractsContext.Provider>
    );
}

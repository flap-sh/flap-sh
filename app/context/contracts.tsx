/**
 * Context for the contracts
 *
 * this context is actually a database for now lmao
 */
import { createContext, useState } from 'react';
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
    items: [],
    trigger: () => { },
});

export function ContractsProvider({ children }: { children: React.ReactNode }) {
    const factory = "0x8B8AC8377538502902Feedda53D1d1d30518215e";
    const [trigger, setTrigger] = useState(false);
    const { createdPools, wlCollections } = useFactory(factory);
    const { collections } = useCollections(wlCollections);
    const { pools } = usePools(createdPools, collections, trigger);
    const { items } = useItems(pools);

    const update = () => {
        setTrigger(!trigger);
    }

    return (
        <ContractsContext.Provider value={{
            factory,
            createdPools,
            wlCollections,
            collections,
            pools,
            items,
            trigger: update
        }}>
            {children}
        </ContractsContext.Provider>
    );
}

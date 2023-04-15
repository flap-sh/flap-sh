import { IPool, ICollection } from '@/interfaces'
import { useState } from 'react';
import { pools } from "@/context/mock"

export const STATES = {
    0: "Mintable",
    1: "Refundable",
    2: "Revealable",
    3: "Redeemable",
    4: "All", // this is a special state just for the UI
};

export function usePool(_address: string) {
    //
    //
    // TODO: get pool data from the global context
}

export function usePools(
    _addresses: string[],
    _collections?: ICollection[]
) {
    const [_pools, _setPools] = useState<IPool[]>([]);

    // TODO: fetch pools then fill orders from
    // the provided collections

    return { pools }
}

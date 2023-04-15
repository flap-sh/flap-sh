import { IPool, ICollection } from '@/interfaces'
import { useState } from 'react';
import { pools } from "@/context/mock"

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

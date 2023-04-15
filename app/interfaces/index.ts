import { ethers } from "ethers";

export interface ICollection {
    logo: string;
    name: string;
    address: string;
}

export interface IOrder {
    collection: ICollection;
    quantity: number;
    price: number;
}

export interface IPool {
    id?: number;
    address: string;
    orders?: IOrder[];
    state?: number;
    price?: number;
    minted?: number;
    totalSupply?: number;
    balance?: number;
}

export interface IItem {
    poolId: number,
    id: number,
    owner: string;
    cost: number;
}

export interface ICall {
    address: `0x${string}`;
    abi: any;
    functionName: string;
    args: any[];
    value?: string;
    cb?: (
        receipt: ethers.providers.TransactionReceipt,
        setMessage: (msg: string) => void
    ) => void;
}

export enum Status {
    Ok,
    Err,
    Loading,
}

export interface ITransactionContext {
    open: boolean;
    setOpen: (open: boolean) => void;
    status: Status;
    hash: string | undefined;
    error: string | undefined;
    message: string | undefined;
    wrap: (call: ICall) => void;
    multicall: (calls: ICall[]) => void;
}

/// well this context is actually a database!
export interface IContractsContext {
    address?: string;
    factory: string;
    createdPools: string[];
    wlCollections: string[];
    /// whitelisted collections.
    collections: ICollection[];
    /// all pools.
    pools: IPool[];
    /// all items in this protocol.
    items: IItem[];
    trigger: () => void;
}

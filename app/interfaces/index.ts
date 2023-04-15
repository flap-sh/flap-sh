export interface ICollection {
    logo: string;
    name: string;
    address: string;
    bridged?: boolean;
}

export interface IOrder {
    collection: ICollection;
    quantity: number;
    price: number;
}

export interface IPool {
    id: number;
    address: string;
    orders: IOrder[];
    status: string;
    price: number;
    minted: number;
    totalSupply: number;
}

export interface IItem {
    collection: ICollection,
    id: number,
    owner: string;
}

/// well this context is actually a database!
export interface IContractsContext {
    factory: string;
    /// whitelisted collections.
    collections: ICollection[];
    /// all pools.
    pools: IPool[];
    /// all items in this protocol.
    items: IItem[];
}

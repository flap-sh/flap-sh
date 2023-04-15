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
    id: number;
    address: string;
    orders: IOrder[];
    state: 0;
    price: number;
    minted: number;
    currentSupply: number;
    totalSupply: number;
}

export interface IItem {
    collection: ICollection,
    id: number,
    owner: string;
    cost: number;
}

/// well this context is actually a database!
export interface IContractsContext {
    factory: string;
    createdPools: string[];
    wlCollections: string[];
    /// whitelisted collections.
    collections: ICollection[];
    /// all pools.
    pools: IPool[];
    /// all items in this protocol.
    items: IItem[];
}

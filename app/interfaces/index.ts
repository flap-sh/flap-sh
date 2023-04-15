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

export interface IPoolDetail {
    id: number;
    address: string;
    orders: IOrder[];
    status: string;
    price: number;
    minted: number;
    totalSupply: number;
}

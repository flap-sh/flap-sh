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

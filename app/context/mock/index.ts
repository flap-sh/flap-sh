export const collections = [{
    name: "abc",
    logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
    address: "0x00",
}];

export const orders = [{
    collection: collections[0],
    quantity: 50,
    price: 1,
}];

export const pools = [{
    id: 1,
    address: "0x00",
    state: 0,
    price: 0.5,
    minted: 10,
    currentSupply: 20,
    totalSupply: 100,
    balance: 1000,
    orders,
},
{
    id: 2,
    address: "0x01",
    state: 1,
    price: 0.5,
    minted: 10,
    currentSupply: 20,
    totalSupply: 100,
    balance: 1000,
    orders,
}, {
    id: 3,
    address: "0x02",
    state: 2,
    price: 0.5,
    minted: 10,
    currentSupply: 20,
    totalSupply: 100,
    balance: 1000,
    orders,
}, {
    id: 4,
    address: "0x03",
    state: 3,
    price: 0.5,
    minted: 10,
    currentSupply: 20,
    totalSupply: 100,
    balance: 1000,
    orders,
}];

export const items = [{
    poolId: 1,
    id: 0,
    owner: "0x000",
    cost: 0.08
}, {
    poolId: 2,
    id: 0,
    owner: "0x000",
    cost: 0.08
},
{
    poolId: 3,
    id: 0,
    owner: "0x000",
    cost: 0.08
},
{
    poolId: 4,
    id: 0,
    owner: "0x000",
    cost: 0.08
}];

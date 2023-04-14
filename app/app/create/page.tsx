"use client"

/* page create */
import { useState } from "react";
import CreateOrder from "./modal";
import { IOrder } from "@/interfaces";

export default function Create() {
    const [orders, setOrders] = useState<IOrder[]>([]);

    const insertOrder = (order: IOrder): void => {
        setOrders([...orders, order]);
    }

    return (
        <main>
            <div className="text-left">
                <span className="max-w-2xl inline-block">
                    Create buy orders for setting up the internal collections for a pool,
                    a pool is made up of buy orders for different collections tbh.

                    <br /><br />

                    Once a pool created, people can mint items from the pool, the item could
                    be any of the collections in the pool, it's randomly.

                    <br /><br />
                    Get NFT or ETH after revealing depends on if the pool is filled up or not,
                    for filling up the pool, we will provide scripts for people to do it, which
                    are called "keeprs" in flap.sh.

                    The keepers will be rewarded with ETH from the fees of the pool.
                </span>
                <div className="flex flex-row align-center pb-8 pt-10">
                    <div className="text-2xl pr-3">Create Order</div>
                    <CreateOrder orders={orders} insertOrder={insertOrder} />
                </div>
            </div>


            {/* order list */}
            <div className="pt-1">
                <table className="table-auto w-full">
                    <thead className="text-left">
                        <tr>
                            <th>Collection</th>
                            <th>Count</th>
                            <th>price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.collection.address} className="leading-10">
                                <td title={order.collection.address} className="flex flex-row items-center">
                                    <img
                                        className="w-4 h-4 mr-2"
                                        src={order.collection.logo}
                                        alt={order.collection.address}
                                    />
                                    <span className="mr-2">{order.collection.name}</span>
                                </td>
                                <td>{order.quantity}</td>
                                <td>{order.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    )
}

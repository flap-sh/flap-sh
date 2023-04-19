"use client"

/* page create */
import Image from "next/image";
import { useMemo, useState } from "react";
import CreateOrder from "./modal";
import { IOrder } from "@/interfaces";
import { useCreatePool } from "@/hooks/useFactory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

const fixed = (value: number) => {
    return (Math.round(value * 100) / 100).toFixed(2);
};

export default function Create() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const { create } = useCreatePool(orders);

    const insertOrder = (order: IOrder): void => {
        setOrders([...orders, order]);
    }

    const removeOrder = (order: IOrder) => {
        setOrders(orders.filter((o) => o !== order));
    }

    const count = useMemo(() => {
        return orders.reduce((acc, order) => acc + order.quantity, 0);
    }, [orders]);

    const price = useMemo(() => {
        const amount = orders.reduce((acc, order) => acc + order.price * order.quantity, 0);
        return amount / count;
    }, [orders, count]);

    return (
        <main>
            <div className="text-left">
                <span className="max-w-2xl inline-block">
                    Create buy orders for setting up the internal collections for a pool,
                    a pool is made up of buy orders for different collections tbh.

                    <br /><br />

                    Once a pool created, people can mint items from the pool, the item could
                    be any of the collections in the pool, it&quot;s randomly.

                    <br /><br />
                    Get NFT or <FontAwesomeIcon icon={faEthereum} spin /> after revealing depends on if the pool is filled up or not,
                    for filling up the pool, we will provide scripts for people to do it, which
                    are called <b>keeprs</b> in flap.sh.

                    The keepers will be rewarded with ETH from the fees of the pool.
                </span>
                <div className="flex flex-row align-center pb-8 pt-10">
                    <div className="text-2xl pr-3">Create Orders</div>
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.collection.address} className="leading-10">
                                <td title={order.collection.address} className="flex flex-row items-center">
                                    <Image
                                        height={15}
                                        width={20}
                                        className="mr-2"
                                        src={order.collection.logo}
                                        alt={order.collection.address}
                                    />
                                    <span className="mr-2">{order.collection.name}</span>
                                </td>
                                <td>{order.quantity}</td>
                                <td>{order.price}</td>
                                <td>
                                    <button onClick={() => removeOrder(order)}>
                                        x
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* batch orders */}
            <div
                className={"pt-12 flex flex-row items-end justify-between pl-3 pr-10" + (orders.length === 0 ? " hidden" : "")}
            >
                <div>
                    <div>Mint Price: {fixed(price)}</div>
                    <div>Total Supply: {count}</div>
                </div>
                <button className="border-2 border-sloid py-1 px-3 rounded-md" onClick={create}>
                    Create
                </button>
            </div>
        </main>
    )
}

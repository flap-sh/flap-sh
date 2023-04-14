"use client"

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useMemo } from "react";
import { IOrder, ICollection } from "@/interfaces";
import { CountInput, PriceInput, CollectionInput } from "./inputs";

const collections = [{
    address: '0x123',
    name: 'CryptoPunks',
    logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
}, {
    address: '0x456',
    name: 'BAYC',
    logo: "https://logo.nftscan.com/logo/0xed5af388653567af2f388e6224dc7c4b3241c544.png",
}];


/**
 *  Create order
 */
export default function CreateOrder({
    orders,
    insertOrder,
}: {
    orders: IOrder[],
    insertOrder: (order: IOrder) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState<string>("")
    const [count, setCount] = useState<string>("")
    const [collection, setCollection] = useState<ICollection>();

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        if (createdCollections.length == collections.length) {
            alert("no avaiable collections to create");
            return
        }

        setIsOpen(true)
    }


    const create = () => {
        if (
            collection
            && value != ""
            && value != "0"
            && count != ""
            && count != "0"
        ) {
            insertOrder({
                collection,
                quantity: parseFloat(count),
                price: parseFloat(value),
            });

            // reset values
            setCount("")
            setValue("")
            setCollection(undefined);
        }

        closeModal()
    }


    const disabled = useMemo(() => {
        return (!collection
            || value == ""
            || value == "0"
            || count == ""
            || count == "0")
    }, [collection, value, count]);

    const createdCollections = useMemo(() => {
        return orders.map((o) => o.collection.address)
    }, [orders])

    const totalAmount = useMemo(() => {
        if (value != "" && count != "") {
            return parseFloat(value) * parseFloat(count)
        }

        return 0
    }, [value, count]);

    return (
        <>

            <button onClick={openModal} className="w-5 hover:cursor-pointer">
                +
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-80" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md
                        transform overflow-hidden bg-black p-6 text-left
                        align-middle shadow-xl transition-all border-gray-450
                        border-dashed border-2 rounded-xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-100"
                                    >
                                        Create Order
                                    </Dialog.Title>
                                    <div className="mt-6 mb-10">
                                        <CollectionInput
                                            collections={collections.filter((c) => !createdCollections.includes(c.address))}
                                            setCollection={setCollection}
                                        />
                                        <div className="h-5"></div>
                                        <CountInput count={count} setCount={setCount} />
                                        <div className="h-5"></div>
                                        <PriceInput value={value} setValue={setValue} />
                                    </div>

                                    <div className="mt-4 flex flex-row justify-between items-center">
                                        <div>
                                            <button
                                                type="button"
                                                disabled={disabled}
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-600 disabled:text-gray-300"
                                                onClick={create}
                                            >
                                                Do it!
                                            </button>
                                            <button
                                                type="button"
                                                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                onClick={closeModal}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className="pr-1">
                                            <span>Total Amount: {totalAmount}&nbsp;E</span>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

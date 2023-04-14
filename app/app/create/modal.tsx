"use client"

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IOrder } from "@/interfaces";


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

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }


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
                                    <div className="mt-6 mb-10 flex flex-col">
                                        <div className="flex flex-col">
                                            <span>collection</span>
                                            <input className="" />
                                        </div>
                                        <div className="flex flex-col mt-3">
                                            <span>quantity</span>
                                            <input className="" />
                                        </div>
                                        <div className="flex flex-col mt-3">
                                            <span>price</span>
                                            <input className="" />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-row justify-between items-center">
                                        <div>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-600 disabled:text-gray-300"
                                                onClick={() => { alert("create!") }}
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
                                            <span>Total Amount: 111&nbsp;E</span>
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

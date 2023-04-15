import { Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { TransactionContext } from "@/context/transaction";
import Spinner from "@/components/Spinner";
import { Status } from "@/interfaces";

interface ModalData {
    title: string;
    message?: string;
}

const resolveModalData = (
    status: Status,
    message?: string,
    error?: string
): ModalData => {
    switch (status) {
        case Status.Ok:
            return {
                title: "Transaction sent successfully",
                message,
            };
        case Status.Err:
            return {
                title: "Transaction sent failed",
                message: error,
            };
        default:
            return {
                title: "Sending transaction...",
                message: "",
            };
    }
};

// TODO: deduplicate with modal in page create
export default function TransactionModal() {
    const { open, setOpen, status, error, message } =
        useContext(TransactionContext);
    const [data, setData] = useState<ModalData>(
        resolveModalData(status, message, error)
    );

    useEffect(() => {
        setData(resolveModalData(status, message, error));
    }, [status, message, error]);

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md
                        transform overflow-hidden bg-black p-6 text-left
                        align-middle shadow-xl transition-all border-gray-450
                        border-dashed border-2 rounded-xl">
                                <div>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                                        {status == Status.Loading ? (
                                            <Spinner className="h-8 w-8 text-gray-400" />
                                        ) : status == Status.Ok ? (
                                            <CheckCircleIcon
                                                className="h-12 w-12 text-green-600"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <XCircleIcon
                                                className="h-12 w-12 text-red-600"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-base font-semibold leading-6 text-gray-200"
                                        >
                                            {data.title}
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">{data.message}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-600 disabled:text-gray-300"
                                        onClick={() => setOpen(false)}
                                    >
                                        Done
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

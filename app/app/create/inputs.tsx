"use client";
/**
 * TODO: clean duplicated code.
 */
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ICollection } from "@/interfaces";
import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

export function CountInput({
    count,
    setCount
}: {
    count: string,
    setCount: (count: string) => void
}) {
    return (
        <div>
            <label
                htmlFor="count"
                className="block text-sm font-medium leading-6 text-gray-100"
            >
                Count
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                        <FontAwesomeIcon icon={faBroom} />
                    </span>
                </div>
                <input
                    type="number"
                    name="count"
                    id="count"
                    min="1"
                    step="1"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 border border-grey focus:border focus:border-solid focus:border-indigo-200"
                    placeholder="1"
                    aria-describedby="count"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm" id="price-currency">
                        {/* alerts */}
                    </span>
                </div>
            </div>
        </div>
    );
}

export function PriceInput({
    value,
    setValue
}: {
    value: string,
    setValue: (value: string) => void
}) {
    return (
        <div>
            <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-100"
            >
                Price
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">
                        <FontAwesomeIcon icon={faEthereum} />
                    </span>
                </div>
                <input
                    type="number"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 border border-grey focus:border focus:border-solid focus:border-indigo-200"
                    placeholder="0.00"
                    aria-describedby="price-currency"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm" id="price-currency">

                    </span>
                </div>
            </div>
        </div>
    );
}


function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

export function CollectionInput({
    collections,
    setCollection
}: {
    collections: ICollection[],
    setCollection: (collection: ICollection) => void
}) {
    const [selected, setSelected] = useState(collections[0]);

    useEffect(() => {
        setCollection(selected)
    }, [selected, setCollection])

    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <>
                    <Listbox.Label className="block text-sm font-medium leading-6 text-gray-100">
                        Collection
                    </Listbox.Label>
                    <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                            <span className="flex items-center">
                                <Image
                                    src={selected.logo}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="flex-shrink-0 rounded-full"
                                />
                                <span className="ml-3 block truncate">{selected.name}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {collections.map((collection) => (
                                    <Listbox.Option
                                        key={collection.address}
                                        className={({ active }) =>
                                            classNames(
                                                active ? "bg-gray-900 text-white" : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                        }
                                        value={collection}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    <Image
                                                        src={collection.logo}
                                                        alt=""
                                                        width={20}
                                                        height={20}
                                                        className="h-5 w-5 flex-shrink-0 rounded-full"
                                                    />
                                                    <span
                                                        className={classNames(
                                                            selected ? "font-semibold" : "font-normal",
                                                            "ml-3 block truncate"
                                                        )}
                                                    >
                                                        {collection.name}
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? "text-white" : "text-indigo-600",
                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
}

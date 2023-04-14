"use client";
/**
 * TODO: clean duplicated code.
 */

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
                        #
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
                        E
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
                        E
                    </span>
                </div>
            </div>
        </div>
    );
}



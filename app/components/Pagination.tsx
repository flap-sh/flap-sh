"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react"

export default function Pagination<T>({
    count = 10,
    all,
    setList,
}: {
    count: number,
    all: T[],
    setList: (list: T[]) => void
}) {
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState<number[]>([]);

    useEffect(() => {
        const newPages = [];
        for (let i = 1; i <= Math.ceil(all.length / count); i++) {
            newPages.push(i);
        }

        setPages(newPages);
    }, [all, count]);

    useEffect(() => {
        const start = (page - 1) * count;
        const end = start + count;
        setList(all.slice(start, end));
    }, [page, count, all]);

    const leftDisabled = useMemo(() => page == pages[0], [page, pages]);
    const rightDisabled = useMemo(() => page == pages[pages.length - 1], [page, pages]);

    return (
        <div className={`flex flex-row justify-center items-center w-full px-24 pt-8 ${pages.length == 0 && "hidden"}`}>
            <button
                disabled={leftDisabled}
                onClick={() => { setPage(page - 1) }}
            >
                <ChevronLeftIcon className={`h-5 w-5 ${leftDisabled && "text-gray-500"}`} />
            </button>
            {
                pages.map((item, index) => (
                    <button
                        className={`px-3 ${page == item && "underline underline-offset-4"}`}
                        key={index}
                        onClick={() => !leftDisabled && setPage(item)}
                    >
                        {item}
                    </button>
                ))
            }
            <button disabled={rightDisabled}>
                <ChevronRightIcon
                    className={`h-5 w-5 ${rightDisabled && "text-gray-500"}`}
                    onClick={() => { !rightDisabled && setPage(page + 1) }}
                />
            </button>
        </div >
    )
}

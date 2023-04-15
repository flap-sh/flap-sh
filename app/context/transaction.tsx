import { createContext, useState } from "react";
import { useChainId } from "wagmi";
import { ethers } from "ethers";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import TransactionModal from "@/components/Transaction";

export enum Status {
    Ok,
    Err,
    Loading,
}

export interface ITransactionContext {
    open: boolean;
    setOpen: (open: boolean) => void;
    status: Status;
    hash: string | undefined;
    error: string | undefined;
    message: string | undefined;
    wrap: ({
        address,
        abi,
        functionName,
        args,
        cb,
    }: {
        address: `0x${string}`;
        abi: any;
        functionName: string;
        args: any[];
        value?: string;
        cb?: (
            receipt: ethers.providers.TransactionReceipt,
            setMessage: (msg: string) => void
        ) => void;
    }) => void;
}

export const TransactionContext = createContext<ITransactionContext>({
    open: false,
    setOpen: () => { },
    status: Status.Loading,
    hash: undefined,
    error: undefined,
    message: undefined,
    wrap: () => { },
});

export function TransactionProvider({ children }: { children: any }) {
    const chainId = useChainId();
    const [status, setStatus] = useState(Status.Loading);
    const [open, setOpen] = useState(false);
    const [hash, setHash] = useState<string>();
    const [error, setError] = useState<string>();
    const [message, setMessage] = useState<string>();

    const wrap = ({
        address,
        abi,
        functionName,
        args,
        value,
        cb,
    }: {
        address: `0x${string}`;
        abi: any;
        functionName: string;
        args: any[];
        value?: string;
        cb?: (
            receipt: ethers.providers.TransactionReceipt,
            setMessage: (msg: string) => void
        ) => void;
    }) => {
        setOpen(true);
        prepareWriteContract({
            address,
            abi,
            functionName,
            args,
            overrides: value ? { value } : {},
        })
            .then((config) => {
                setStatus(Status.Loading);
                return writeContract(config);
            })
            .then(({ hash, wait }) => {
                setHash(hash);
                return wait(chainId === 2337 ? 1 : 6);
            })
            .then((receipt) => {
                cb && cb(receipt, setMessage)
                setStatus(Status.Ok);
            })
            .catch((e) => {
                setStatus(Status.Err);
                setError(JSON.stringify(e.reason));
            });
    };

    return (
        <TransactionContext.Provider
            value={{ open, status, setOpen, hash, error, message, wrap }}
        >
            <TransactionModal />
            {children}
        </TransactionContext.Provider>
    );
}

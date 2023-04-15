import { createContext, useContext, useState } from "react";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import TransactionModal from "@/components/Tx";
import { ContractsContext } from "@/context/contracts";
import { ICall, ITransactionContext, Status } from "@/interfaces";

export const TransactionContext = createContext<ITransactionContext>({
    open: false,
    setOpen: () => { },
    status: Status.Loading,
    setStatus: () => { },
    hash: undefined,
    error: undefined,
    message: undefined,
    wrap: (_: ICall) => { },
    multicall: (_: ICall[]) => { }
});

export function TransactionProvider({ children }: { children: any }) {
    const [status, setStatus] = useState(Status.Loading);
    const [open, setOpen] = useState(false);
    const [hash, setHash] = useState<string>();
    const [error, setError] = useState<string>();
    const [message, setMessage] = useState<string>();
    const { trigger } = useContext(ContractsContext);

    const wrap = ({
        address,
        abi,
        functionName,
        args,
        value,
        cb,
    }: ICall) => {
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
                return wait(1);
            })
            .then((receipt) => {
                trigger();
                cb && cb(receipt, setMessage)
                setStatus(Status.Ok);
            })
            .catch((e) => {
                setStatus(Status.Err);
                setError(JSON.stringify(e.reason));
            });
    };

    const multicall = (calls: ICall[]) => {
        setOpen(true);
        Promise.all(calls.map((call) => (
            prepareWriteContract({
                address: call.address,
                abi: call.abi,
                functionName: call.functionName,
                args: call.args,
            })
        ))).then((configs) => {
            setStatus(Status.Loading);
            return Promise.all(configs.map(writeContract));
        }).then((results) => {
            setHash(results[0].hash);
            return Promise.all(results.map(({ wait }) => wait(1)));
        }).then((_receipts) => {
            trigger();
            setStatus(Status.Ok);
        }).catch((e) => {
            setStatus(Status.Err);
            setError(JSON.stringify(e.reason));
        })
    }

    return (
        <TransactionContext.Provider
            value={{ open, status, setStatus, setOpen, hash, error, message, wrap, multicall }}
        >
            <TransactionModal />
            {children}
        </TransactionContext.Provider>
    );
}

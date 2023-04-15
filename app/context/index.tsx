"use client"
/**
 *  Entry of the context of this project.
 */

import { WagmiConfig, configureChains, createClient, useAccount } from 'wagmi'
import Login from '@/components/Login'
import { useIsMounted } from '@/hooks/useIsMounted'
import { ContractsProvider } from "./contracts";
import { TransactionProvider } from "./transaction"
import {
    polygonZkEvm,
} from "@wagmi/core/chains";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";


const { provider } = configureChains(
    [polygonZkEvm],
    [
        jsonRpcProvider({
            priority: 1,
            rpc: (_) => ({
                http: "https://rpc.public.zkevm-test.net"

            }),
        }),
    ]
);

const client = createClient({
    autoConnect: true,
    provider,
});

export function RootProvider({ children }: { children: React.ReactNode }) {
    const { isConnected } = useAccount();
    const isMounted = useIsMounted();

    return (
        <WagmiConfig client={client}>
            {
                isMounted && !isConnected ?
                    <Login /> :
                    <ContractsProvider>
                        <TransactionProvider>
                            {children}
                        </TransactionProvider>
                    </ContractsProvider>
            }
        </WagmiConfig>
    )
}

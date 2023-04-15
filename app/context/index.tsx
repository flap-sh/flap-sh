"use client"
/**
 *  Entry of the context of this project.
 */

import { WagmiConfig, createClient, useAccount } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import Login from '@/components/Login'
import { useIsMounted } from '@/hooks/useIsMounted'
import { ContractsProvider } from "./contracts";

const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
})

export function RootProvider({ children }: { children: React.ReactNode }) {
    const { isConnected } = useAccount();
    const isMounted = useIsMounted();

    return (
        <WagmiConfig client={client}>
            {
                isMounted && !isConnected ?
                    <Login /> :
                    <ContractsProvider>{children}</ContractsProvider>
            }
        </WagmiConfig>
    )
}

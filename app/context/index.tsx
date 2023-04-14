"use client"
/**
 *  Entry of the context of this project.
 */

import { WagmiConfig, createClient, useAccount } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import Login from '@/components/Login'

const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
})

export function RootProvider({ children }: { children: React.ReactNode }) {
    const { isConnected } = useAccount()

    return (
        <WagmiConfig client={client}>

            {isConnected ? children : <Login />}
        </WagmiConfig>
    )

}

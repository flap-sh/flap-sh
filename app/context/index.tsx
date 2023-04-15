"use client"
/**
 *  Entry of the context of this project.
 */

import { WagmiConfig, configureChains, createClient, useAccount } from 'wagmi'
import Login from '@/components/Login'
import { useIsMounted } from '@/hooks/useIsMounted'
import { ContractsProvider } from "./contracts";
import { TransactionProvider } from "./transaction"
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";

const polygonZkEvmTestnet = {
    id: 1442,
    name: "Polygon zkEVM Testnet",
    network: "polygon-zkevm-testnet",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.public.zkevm-test.net"],
        },
        public: {
            http: ["https://rpc.public.zkevm-test.net"],
        },
    },
    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://explorer.public.zkevm-test.net",
        },
    },
    contracts: {
        multicall3: {
            address: "0xcA11bde05977b3631167028862bE2a173976CA11",
            blockCreated: 525686
        }
    },
    testnet: true,
};

const { provider } = configureChains(
    [polygonZkEvmTestnet as any],
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

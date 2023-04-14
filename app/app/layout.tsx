import './globals.css'
import { RootProvider } from "@/context";

export const metadata = {
    title: 'flap.sh - Filp NFTs like the rich!',
    description: 'Filp NFTs like the rich!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <RootProvider>
                <body>{children}</body>
            </RootProvider>
        </html>
    )
}

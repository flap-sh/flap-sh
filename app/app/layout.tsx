import './globals.css'
import { RootProvider } from "@/context";
import Navbar from "@/components/Navbar"

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
            <body className="max-w-6xl m-auto px-8">
                <RootProvider>
                    <Navbar />
                    {children}
                </RootProvider>
            </body>
        </html>
    )

}

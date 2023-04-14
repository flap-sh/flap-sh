import './globals.css'

export const metadata = {
    title: 'flap.sh - Filp NFTs like a rich!',
    description: 'Filp NFTs like a rich!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}

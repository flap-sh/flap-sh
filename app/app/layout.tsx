import './globals.css'
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

import { RootProvider } from "@/context";
import Navbar from "@/components/Navbar";


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
            <body className="max-w-6xl m-auto px-8 min-h-full">
                <RootProvider>
                    <Navbar />
                    {children}
                    <footer className="text-center py-8 text-sm">
                        <div className="absolute bottom-8 max-w-6xl w-full">
                            <span>built with ❤️  by <a href="https://github.com/flap-sh">flap.sh</a> team</span>
                        </div>
                    </footer>
                </RootProvider>
            </body>
        </html>
    )

}

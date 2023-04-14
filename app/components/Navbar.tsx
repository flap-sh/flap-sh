"use client"
import { useIsMounted } from "@/hooks/useIsMounted";
import { useAccount } from "wagmi"

export default function Navbar() {
    const { address } = useAccount()
    const isMounted = useIsMounted();

    return (
        <div className="flex justify-between py-10">
            <div className="hover:cursor-pointer">
                <a className="text-2xl" href="/">Flap.sh</a>
                <a className="text-lg pl-8" href="/portfolio">Portfolio</a>
            </div>
            <div>
                {isMounted && address ? address?.slice(0, 6) + "..." + address?.slice(38, 42) : ""}
            </div>
        </div>
    )
}

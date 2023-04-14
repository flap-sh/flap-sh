"use client"
/**
 * Component for login
 */
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useConnect } from 'wagmi'

export default function Login() {
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    return (
        <main className="w-full text-center pt-36 flex flex-col items-center">
            <span className="text-2xl">flap.sh</span>
            <button
                className="mt-5 border border-gray-300 py-1 px-3"
                onClick={() => connect()}
            >
                Connect
            </button>
        </main>
    )
}

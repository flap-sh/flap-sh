



export function parsePoolState(e: number): string {

    const states = [
        "STATE_MINTABLE",
        "STATE_REFUNDABLE",
        "STATE_REVEALABLE",
        "STATE_REDEEMABLE",
    ]

    return states[e];
}













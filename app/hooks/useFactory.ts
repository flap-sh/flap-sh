
export function useFactory(address: string) {

    // TODO: created pools from events
    const createdPools: string[] = ["0x000"];

    // TODO: whitelist collections from events
    const wlCollections: string[] = ["0x000"]

    return { createdPools, wlCollections };
}

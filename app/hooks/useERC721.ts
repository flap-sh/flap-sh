import { ICollection, IPool, IItem } from "@/interfaces"
import { useState } from "react"

// FIXME: mock data
import { collections, items } from "@/context/mock"

export function useCollections(_createdCollections: string[]) {
    const [_collections, _setCollections] = useState<ICollection[]>([]);

    // TODO: batch metadata from createdCollections

    return { collections }
}

export function useItems(_pools: IPool[]) {
    const [_items, _setItems] = useState<IItem[]>([]);

    // TODO: batch items from pools

    return { items }
}

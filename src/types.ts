import type {Hex} from "viem";

export type Token = {
    address: Hex,
    decimals: number,
    name: string,
    symbol: string
}

export type DirectionMap = Map<Hex, Map<Hex, { course: number, fee: number }>>;
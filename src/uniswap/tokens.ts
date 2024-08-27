import {erc20Abi, Hex} from "viem";
import {Token} from "../types";
import {TokenList} from "../constants";
import {publicClient} from "../utils/client";

export const TOKENS: Record<Hex, Token> = {};

export async function loadTokens() {
    for (const token of Object.values(TokenList)) {
        const decimals = await publicClient.readContract({
            address: token,
            abi: erc20Abi,
            functionName: "decimals"
        });
        const name = await publicClient.readContract({
            address: token,
            abi: erc20Abi,
            functionName: "name"
        });
        const symbol = await publicClient.readContract({
            address: token,
            abi: erc20Abi,
            functionName: "symbol"
        });
        TOKENS[token] = { name, symbol, decimals, address: token };
    }
}
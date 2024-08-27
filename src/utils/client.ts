import {createPublicClient, createWalletClient, http} from "viem";
import {polygon} from "viem/chains";
import {privateKeyToAccount} from "viem/accounts";
import {CONFIG} from "../config";

export const publicClient = createPublicClient({
    chain: polygon,
    transport: http(CONFIG.rpc)
});

export const walletClient = createWalletClient({
    chain: polygon,
    transport: http(CONFIG.rpc),
    account: privateKeyToAccount(CONFIG.privateKey)
})
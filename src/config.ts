import type {Hex} from "viem";

export const CONFIG = {
    privateKey: process.env.PRIVATE_KEY! as Hex,
    mevBotAddress: process.env.MEV_BOT_ADDRESS! as Hex,
    rpc: process.env.RPC! as string,
}
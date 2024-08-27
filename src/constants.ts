import type {Hex} from "viem";

export enum FeeAmount {
    LOWEST = 100,
    LOW = 500,
    MEDIUM = 3000,
    HIGH = 10000,
}

export enum TokenList {
    USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    WMATIC = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    USDC2 = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDC = "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    DAI = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    WETH = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    WBTC = "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    RNDR = "0x61299774020dA444Af134c82fa83E3810b309991",
    LINK = "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39"
}

export const Pairs: [TokenList, TokenList, number][] = [
    [TokenList.USDC2, TokenList.USDC, FeeAmount.LOWEST],
    [TokenList.USDT, TokenList.USDC2, FeeAmount.LOWEST],
    [TokenList.WETH, TokenList.WBTC, FeeAmount.LOW],
    [TokenList.WETH, TokenList.USDC2, FeeAmount.LOW],
    [TokenList.WETH, TokenList.WBTC, FeeAmount.MEDIUM],
    [TokenList.WETH, TokenList.USDC, FeeAmount.LOW],
    [TokenList.WBTC, TokenList.USDC2, FeeAmount.LOW],
    [TokenList.WMATIC, TokenList.USDT, FeeAmount.LOW],
    [TokenList.WMATIC, TokenList.WETH, FeeAmount.LOW],
    [TokenList.WMATIC, TokenList.USDC, FeeAmount.LOW],
    [TokenList.WMATIC, TokenList.USDC, FeeAmount.MEDIUM],
    [TokenList.WMATIC, TokenList.USDC2, FeeAmount.LOW],
    [TokenList.RNDR, TokenList.WMATIC, FeeAmount.MEDIUM],
    [TokenList.RNDR, TokenList.WETH, FeeAmount.MEDIUM],
];

export const FACTORY_ADDRESS: Hex = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const POOL_INIT_CODE_HASH: Hex = "0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54";


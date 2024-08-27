import {Hex, Log, getContract, encodeAbiParameters, parseUnits, encodePacked} from "viem";
import { UNISWAP_V3_POOL_ABI } from "../abi/uniswapV3Pool";
import { DirectionGraph } from "../utils/directions";
import {CONFIG} from "../config";
import {EXACT_INPUT_PARAMS_STRUCT} from "../abi/ExactInputParamsScruct";
import {getPoolAddress} from "./pool";
import {Token} from "../types";
import {publicClient, walletClient} from "../utils/client";
import {MEV_BOT_ABI} from "../abi/mevBot";
import {TOKENS} from "./tokens";

export const POOLS: Record<Hex, { token0: Token, token1: Token, fee: number, diffDecimals: number, name: string }> = {};
export const directionGraph = new DirectionGraph();

const mevBotContract = getContract({
    address: CONFIG.mevBotAddress,
    abi: MEV_BOT_ABI,
    client: {
        public: publicClient,
        wallet: walletClient
    },
})

export async function createWatcher(tokenA: Hex, tokenB: Hex, fee: number) {
    const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];
    const poolAddress = getPoolAddress(token0, token1, fee).toLowerCase() as Hex;
    POOLS[poolAddress] = {
        token0: TOKENS[token0],
        token1: TOKENS[token1],
        fee,
        diffDecimals: TOKENS[token0].decimals - TOKENS[token1].decimals,
        name: `${TOKENS[token0].symbol}\\${TOKENS[token1].symbol}`
    };

    const contract = getContract({
        address: poolAddress,
        abi: UNISWAP_V3_POOL_ABI,
        client: publicClient,
    });

    const a = await contract.read.slot0();
    const sqrtPrice = Number(a[0]) / (2 ** 96);
    const price = (sqrtPrice ** 2) * (10 ** POOLS[poolAddress].diffDecimals);

    directionGraph.addDirection(
        POOLS[poolAddress].token0.address,
        POOLS[poolAddress].token1.address,
        price,
        POOLS[poolAddress].fee / 10000
    );

    contract.watchEvent.Swap({}, {
        pollingInterval: 500,
        onLogs: watchSwaps
    });
}

let lastPath = "";

async function watchSwaps(logs: Log[]) {
    for (const log of logs) {
        // @ts-ignore
        const sqrtPrice = Number(log.args.sqrtPriceX96) / (2 ** 96);
        const price = (sqrtPrice ** 2) * (10 ** POOLS[log.address].diffDecimals);

        directionGraph.addDirection(
            POOLS[log.address].token0.address,
            POOLS[log.address].token1.address,
            price,
            POOLS[log.address].fee / 10000
        );

        const result = directionGraph.findMaxCycle();
        const { path, fee } = result.bestPath;

        if (result.maxProduct > 1.0006) {
            const types: string[] = [];
            const values: any[] = [];
            for (let i = 0; i < path.length - 1; i++) {
                types.push("address");
                values.push(path[i]);
                if (i < fee.length) {
                    types.push("uint24");
                    values.push(fee[i] * 10000);
                }
            }
            types.push("address");
            values.push(path[path.length - 1]);

            const pathEncoded = encodePacked(
                types,
                values
            );

            if (lastPath == pathEncoded) {
                continue;
            }
            lastPath = pathEncoded;

            const amount = parseUnits(String(1), TOKENS[result.bestPath.path[0]].decimals);

            const params = encodeAbiParameters(
                EXACT_INPUT_PARAMS_STRUCT,
                [{
                    path: pathEncoded,
                    recipient: CONFIG.mevBotAddress,
                    amountIn: amount,
                    amountOutMinimum: 0n
                }]
            );

            console.log('Max product:', result.maxProduct, 'Best path:', path.map(e => TOKENS[e].symbol).join(" -> "));
            const txHash = await mevBotContract.write.zook([path[0], amount, params], {
                gas: 1000000n,
            });
            console.log("Tx hash:", txHash);
        }
    }
}

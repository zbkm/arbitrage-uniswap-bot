import {type Address, encodeAbiParameters, getCreate2Address, keccak256, parseAbiParameters} from "viem";
import {FACTORY_ADDRESS, POOL_INIT_CODE_HASH} from "../constants";

export function getPoolAddress(token0: Address, token1: Address, fee: number): Address {
    const encodedData = encodeAbiParameters(
        parseAbiParameters(['address', 'address', 'uint24']),
        [token0, token1, fee]
    );

    const poolSalt = keccak256(encodedData);
    return getCreate2Address({
        bytecodeHash: POOL_INIT_CODE_HASH,
        from: FACTORY_ADDRESS,
        salt: poolSalt
    });
}
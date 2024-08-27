import { loadTokens } from "./uniswap/tokens";
import { initializePairs } from "./uniswap/pairs";

(async () => {
    await loadTokens();
    await initializePairs();
})();

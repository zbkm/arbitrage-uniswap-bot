import {createWatcher} from "./watchers";
import {Pairs} from "../constants";

export async function initializePairs() {
    for (const pair of Pairs) {
        await createWatcher(pair[0], pair[1], pair[2]);
    }
}
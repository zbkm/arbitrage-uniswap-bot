import { Hex } from "viem";
import {DirectionMap} from "../types";

export class DirectionGraph {
    private directions: DirectionMap;

    constructor() {
        this.directions = new Map();
    }

    addDirection(from: Hex, to: Hex, multiplier: number, commission: number) {
        if (!this.directions.has(from)) {
            this.directions.set(from, new Map());
        }
        this.directions.get(from)!.set(to, { course: multiplier, fee: commission });

        if (!this.directions.has(to)) {
            this.directions.set(to, new Map());
        }
        this.directions.get(to)!.set(from, { course: 1 / multiplier, fee: commission });
    }

    findMaxCycle(): { bestPath: { path: Hex[], fee: number[] }, maxProduct: number } {
        let maxProduct = 0;
        let bestPath: { path: Hex[], fee: number[] } = { path: [], fee: [] };

        const dfs = (node: string, visited: Set<string>, path: string[], commissions: number[], product: number) => {
            if (visited.has(node)) {
                if (node === path[0] && product > maxProduct) {
                    maxProduct = product;
                    // @ts-ignore
                    bestPath = { path: [...path, node], fee: [...commissions] };
                }
                return;
            }

            visited.add(node);
            path.push(node);

            if (this.directions.has(<`0x${string}`>node)) {
                for (const [neighbor, { course, fee }] of this.directions.get(<`0x${string}`>node)!) {
                    const adjustedMultiplier = course * (1 - fee / 100);
                    dfs(neighbor, new Set(visited), [...path], [...commissions, fee], product * adjustedMultiplier);
                }
            }
        };

        for (const startNode of this.directions.keys()) {
            dfs(startNode, new Set(), [], [], 1);
        }

        return { maxProduct, bestPath };
    }
}

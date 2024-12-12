import { readGrid } from "../utils/fs.ts"

const input = await readGrid("input.txt")

type Coordinate = {
    x: number,
    y: number
}

const cardinalDirections = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
];

const diagonalDirections = [
    [-1, -1],
    [1, 1],
    [1, -1],
    [-1, 1]
]

const getKey = (c: Coordinate): string => {
    return `${c.x},${c.y}`
}

const getCoordFromKey = (k: string): Coordinate => {
    const [x, y] = k.split(',').map(Number);
    return {x, y}
}

const getVal = (c: Coordinate, g: string[][]): string|null => {
    // return null if OOB
    if (c.x >= g.length || c.x < 0) return null;
    if (c.y >= g[c.x].length || c.y < 0) return null;

    return g[c.x][c.y];
}

const bombermanFill = (c: Coordinate, g: string[][]): Coordinate[] => {
    /** So called because it will fill in a cross pattern
     * Accept a coordinate to fill and a grid g,
     * returns all coordinates that should be filled
    */
    const filled = new Map();
    const stack: Coordinate[] = [c];
    const target = g[c.x][c.y];

    while (stack.length > 0) {
        const current = stack.shift()!;
        // Ignore squares we've already filled
        if (filled.has(getKey(current))) continue;

        // Fill the square
        filled.set(getKey(current), true);

        // Extend as far as possible in four directions
        cardinalDirections.forEach(([cx, cy]) => {
            let diff = 1;
            while (true) {
                const toCheck:Coordinate = {
                    x: current.x + cx * diff,
                    y: current.y + cy * diff
                }
                // Tile is OOB or different, stop here
                if (getVal(toCheck, g) !== target) return;

                // Tile is already filled, stop here
                if (filled.has(getKey(toCheck))) return;

                // Tile should be added to the stack
                stack.push(toCheck);
                diff += 1;
            }
        });
    }

    return [...filled.keys()].map(getCoordFromKey);
}

const getPerimeter = (region: Coordinate[]): number => {
    /**
     * Used for part 1. This is fairly straightforward.
     */
    const map = new Map(region.map(x => [getKey(x), true]))
    // Assumes region is contiguous.
    return region.reduce((a, x) => {
        // For each tile, calculate its number of fences.
        // It is 4, less one for each neighbor in the same region.
        let fences = cardinalDirections.reduce((a, [cx, cy]) => {
            if (map.has(getKey({
                x: x.x + cx,
                y: x.y + cy
            }))) return a-1;
            return a;
        }, 4)

        return a + fences;
    }, 0)
}

const getSides = (region: Coordinate[]): number => {
    /**
     * Every polygon has as many sides as corners, so count corners.
     * ...There is probably a smarter way to do that, but I didn't find it. 
     */
    const map = new Map(region.map(x => [getKey(x), true]))
    // Assumes region is contiguous.
    return region.reduce((a, x) => {
        let neighbors = cardinalDirections.filter(([cx, cy]) => {
            return map.has(getKey({
                x: x.x + cx,
                y: x.y + cy
            }))
        });

        // an island always has four courners
        if (neighbors.length === 0) return a + 4;
        // the tip of a peninsula always has two corners
        if (neighbors.length === 1) return a + 2;
        // a tile with two neighbors has up two corners if they are in an L
        // and zero if they are in a row
        if (neighbors.length === 2) {
            // neighbors are in a row, no corners
            if (neighbors[0][0] === neighbors[1][0] || neighbors[0][1] === neighbors[1][1]) return a;
            // neighbors are in an L. one corner if in-between diagonal is filled, two if not
            if (map.has(getKey({
                x: x.x + neighbors[0][0] + neighbors[1][0],
                y: x.y + neighbors[0][1] + neighbors[1][1],
            }))) return a + 1;
            else return a + 2;
        }
        // If a tile has 3 neighbors, every unfilled square between neighbors
        // is a corner
        if (neighbors.length === 3) {
            let corners = 0;
            // There are 3 combinations, but one will result in the middle
            // square which will never count as a corner
            for (let i=0; i<neighbors.length; i++) {
                for (let j=i+1; j<neighbors.length; j++) {
                    if (!map.has(getKey({
                        x: x.x + neighbors[i][0] + neighbors[j][0],
                        y: x.y + neighbors[i][1] + neighbors[j][1],
                    }))) corners += 1;
                }
            }
            return a + corners;
        }
        // if a tile has 4 neighbors, every diagonal unfilled square
        // is a corner
        if (neighbors.length === 4) return diagonalDirections.filter(
            ([dx, dy]) => map.has(getKey({x: x.x + dx, y: x.y + dy})) === false
        ).length + a;

        return a;
    }, 0)
}

const regions: Coordinate[][] = [];
const inRegion:Map<string, true> = new Map();

for (let x=0; x<input.length; x++) {
    for (let y=0; y<input[x].length; y++) {
        // Don't replot squares we already checked
        if (inRegion.has(getKey({x, y}))) continue;

        const filled = bombermanFill({x, y}, input);
        filled.forEach(c => inRegion.set(getKey(c), true));
        regions.push(filled);
    }
}

// Now we have a list of regions, calculate the prices.

const totalPrice = regions.reduce((a, region) => {
    return a + (region.length * getPerimeter(region))
}, 0)

console.log(`Part 1: ${totalPrice}`);

const discountedPrice = regions.reduce((a, region) => {
    return a + (region.length * getSides(region))
}, 0)

console.log(`Part 2: ${discountedPrice}`)
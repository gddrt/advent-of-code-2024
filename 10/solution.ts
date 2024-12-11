import { readGrid } from "../utils/fs.ts"

const input = await readGrid("input.txt")

const INPUT_BOUNDS = [input.length, input[0].length]

// Feels like another recursion day!
type Coordinate = {x: number, y: number}

const getCoordinateHeight = ({x, y}: Coordinate): number|null => {
    /**
     * Get the height at a given coordinate, or null if coordinate is OOB
     */

    if (x < 0 || x >= INPUT_BOUNDS[0] || y < 0 || y >= INPUT_BOUNDS[1]) return null;

    return Number(input[x][y]);
}

const getAdjacentCoordinates = ({x, y}: Coordinate): Coordinate[] => {
    return [
        {x: x-1, y: y},
        {x: x, y: y-1},
        {x: x+1, y: y},
        {x: x, y: y+1}
    ]
}

const findTrailPeaks = (c: Coordinate, target: number): Coordinate[] => {
    // If this step is not one higher than the last, this trail does not work
    if (getCoordinateHeight(c) !== target) return [];

    // If we are at height 9, we have reached the end of a good trail
    if (target === 9) return [c];

    // For each cardinal direction check the next step
    return getAdjacentCoordinates(c).reduce(
        (a: Coordinate[], x: Coordinate) => [...a, ...findTrailPeaks(x, target+1)], []);
}


let totalTrails = 0;
let totalTrailRating = 0;
for (let x=0; x<input.length; x++) {
    for (let y=0; y<input[x].length; y++) {
        const allTrails = findTrailPeaks({x,y}, 0).map(({x, y}) => `${x},${y}`);
        // Part 1: Find only unique peaks reachable from the given trailhead.
        totalTrails += new Set(allTrails).size;
        // Part 2: Find the total number of trails for each trailhead.
        totalTrailRating += allTrails.length;
    }
}

console.log(`Part 1: ${totalTrails} trailhead sum`);
console.log(`Part 2: ${totalTrailRating} trail rating`);
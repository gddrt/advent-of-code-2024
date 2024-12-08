import { readGrid } from '../utils/fs.ts';

const input = await readGrid("input.txt");

// Get the max bounds of the map
const MAP_SIZE = [input[0].length, input.length];

// Iterate through the grid, storing antenna locations for each frequency
type Coordinate = [number, number];
const antennas:{
    [key: string]: Coordinate[]
} = {};

for(let y=0; y<input.length; y++) {
    for (let x=0; x<input[y].length; x++) {
        const current = input[y][x];
        // Blank space
        if (current === ".") continue;

        // We could validate that the symbol matches [a-zA-Z0-9]
        // But it doesn't seem to be necessary
        if (antennas[current] === undefined) {
            antennas[current] = [];
        }
        antennas[current].push([x, y]);
    }
}

// Now we iterate through each frequency. For each combination of antenna in one
// frequency, calculate its two antinodes.
const antinodes: Coordinate[] = [];

Object.values(antennas).forEach((ants: Coordinate[]) => {
    // This nested loop checks each combination once.
    for (let i=0; i<ants.length-1; i++) {
        for (let j=i+1; j<ants.length; j++) {
            /** trust me bro
             * Okay, seriously, I worked it out with a one-dimensional toy example
             * In that case the following worked:
             * a + (a-b)
             * b + (b-a)
             * So we just extend that to two dimensions. */
            antinodes.push([
                ants[i][0] + (ants[i][0] - ants[j][0]),
                ants[i][1] + (ants[i][1] - ants[j][1])
            ], [
                ants[j][0] + (ants[j][0] - ants[i][0]),
                ants[j][1] + (ants[j][1] - ants[i][1])
            ])
        }
    }

})

// The question is looking for the number of locations in bounds with antinode(s).
// First we prune the ones that are out of bounds.
const validAntinodes = antinodes.filter(([x, y]) => {
    return x >= 0 && y >= 0 && x < MAP_SIZE[0] && y < MAP_SIZE[1]
});

// Then we count only unique ones.
console.log(`${new Set(validAntinodes.map(([x, y]) => `${x},${y}`)).size} locations with antinodes.`)
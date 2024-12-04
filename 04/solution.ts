import { readGrid } from '../utils/fs.ts';
import { EIGHT_WAY_VECTORS } from '../utils/grid.ts';

export {}

// Turns text input into a character grid
const input = await readGrid("input.txt");

// note, I'm using (x, y) in the solution for simplicity
// it doesn't actually matter which dimension is X and which is Y
// as long as it's consistent
const getValue = (x: number, y: number):string|undefined => {
    return input[x] === undefined ? undefined : input[x][y]
}

const getSafeValue = (x: number, y: number, replacement: string = ''): string => {
    /* Like getValue but certain to return a string */
    const value = getValue(x, y);
    return value === undefined ? replacement : value;
}

const searchFourLetterWord = (
    startX: number,
    startY: number,
    vectorX: number,
    vectorY: number
): string => {
    /* Given starting coordinates and x/y vectors, find the four letter word */
    return [0,1,2,3].map(x => getSafeValue(startX + x*vectorX, startY + x*vectorY)).join('');
}

let runningCount = 0;

for(let i=0; i<input.length; i++) {
    for (let j=0; j<input[i].length; j++) {
        // We can optimize this slightly by skipping squares that are not "X"
        if (input[i][j] !== "X") continue;

        EIGHT_WAY_VECTORS.forEach(([vectorX, vectorY]) => {
            if (searchFourLetterWord(i, j, vectorX, vectorY) === "XMAS") {
                runningCount += 1;
            }
        })
    }
}

console.log(`Part 1: XMAS found ${runningCount} times.`)

// Part 2: Find "MAS" in an X shape, diagonally either way
runningCount = 0;

const isXMas = (x: number, y: number):boolean => {
    // Must be "A" in the middle
    if (getValue(x, y) !== 'A') return false;

    // If left-right diagonal does not have an M and an S
    // on either end, it is not an X-MAS
    if ((
        ['M', 'S'].includes(getSafeValue(x - 1, y - 1))
        && ['M', 'S'].includes(getSafeValue(x + 1, y + 1))
        && getSafeValue(x - 1, y - 1) !== getSafeValue(x + 1, y + 1)
    ) === false) return false;

    // Same check for right-left diagonal
    if ((
        ['M', 'S'].includes(getSafeValue(x + 1, y - 1))
        && ['M', 'S'].includes(getSafeValue(x - 1, y + 1))
        && getSafeValue(x + 1, y - 1) !== getSafeValue(x - 1, y + 1)
    ) === false) return false;

    // Check passes
    return true;
}

for(let i=0; i<input.length; i++) {
    for (let j=0; j<input[i].length; j++) {
        if (isXMas(i, j)) runningCount++;
    }
}

console.log(`Part 2: X-MAS found ${runningCount} times`)

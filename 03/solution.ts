import { readText } from '../utils/fs.ts';

export {}

const input = await readText("input.txt");

// Find all strings in the format "mul(1,2)", and capture the factors.
// Factors must be 1-3 digits.
const matches = input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)

// Sum the product of all factors.
// x[1] and x[2] will be the captured number groups.
const result = [...matches].reduce((a, x) => {
    return a + Number(x[1]) * Number(x[2])
}, 0)

console.log(`Part 1: ${result}`)

// matchAll includes the index of the match, which will be useful here.
// First we'll build a list of all the dos and donts.

const toggleMatches = input.matchAll(/do(n't)?\(\)/g);
const instructions = [...toggleMatches].map((x) => {
    const index = x.index;
    const enabled = x[0] === "do()";
    return {index, enabled}
})

// Given an index, get the most recent instruction.
const isEnabledAtIndex = (index: number): boolean => {
    const latestInstruction = instructions.reduce((a, x) => {
        if (index > x.index && x.index > a.index) return x;
        return a;
    }, {index: 0, enabled: true});
    return latestInstruction.enabled;
}

// Then we'll go through the matches again, only including results when
// it is enabled.
const newResult = [...input.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)].reduce((a, x) => {
    if (isEnabledAtIndex(x.index)) return a + Number(x[1]) * Number(x[2]);
    else return a;
}, 0)

console.log(`Part 2: ${newResult}`)
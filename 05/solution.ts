import { readLines } from '../utils/fs.ts';

export {}

// Turns text input into a character grid
const input = await readLines("input.txt");

// Filter the rules part of the input
// which matches the format "12|45"
// Turn into array of pairs
const rules: number[][] = input
    .filter(x => x.match(/^\d+|\d+$/))
    .map(x => x.split('|').map(y => Number(y)))

// Filter the updates part of the input
// which match the format "12,34,45"
// Updates can have any odd amount >=3 of pages.
// Turn into arrays
const updates: number[][] = input
    .filter(x => x.match(/^(\d+,)*\d+$/))
    .map(x => x.split(',').map(y => Number(y)))

// For each update, identify the applicable rules
// Then identify if the update is valid
const validateUpdate = (x: number[]) => {
    for (let i=0; i<rules.length; i++) {
        const indexA = x.indexOf(rules[i][0]);
        const indexB = x.indexOf(rules[i][1]);

        // If one page in the rule does not exist, the rule does not apply.
        if (indexA === -1 || indexB === -1) continue;

        // If the second page does not come after the first page, the update is invalid
        if (indexA > indexB) return false;
    }

    // All applicable rules pass, update is valid
    return true;
};

const validUpdates: number[][] = updates.filter(validateUpdate);

// Return the sum of the middle values of valid updates
const sumOfMiddles = (a: number, x: number[]) => {
    const index = (x.length - 1) / 2;
    return a + x[index];
}

console.log(`Part 1: ${validUpdates.reduce(sumOfMiddles, 0)}`);

// Part 2: Fix the invalid updates
const invalidUpdates: number[][] = updates.filter(x => !validateUpdate(x));

// For each invalid update, we must fix it.
// In theory, this should be doable with brute force
// eg. for each broken rule, we put the second page immediately after the first
// and then retry until it works.
const fixedUpdates: number[][] = invalidUpdates.map(y => {
    let x = [...y];
    outer: while (true) {
        inner: for (let i=0; i<rules.length; i++) {
            const indexA = x.indexOf(rules[i][0]);
            const indexB = x.indexOf(rules[i][1]);
    
            // If one page in the rule does not exist, the rule does not apply.
            if (indexA === -1 || indexB === -1) continue;
    
            // If the second page does not come after the first page,
            // we fix it and then try again
            if (indexA > indexB) {
                x = [...x.slice(0, indexB), rules[i][0], rules[i][1], ...x.slice(indexB + 1, indexA), ...x.slice(indexA + 1)]
                continue outer;
            }
        }
        break;
    }
    return x;
})

console.log(`Part 2: ${fixedUpdates.reduce(sumOfMiddles, 0)}`)

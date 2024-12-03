import { readLines } from '../utils/fs.ts';

export {}

// Parse lines, filtering out the newline at the end.
const lines:number[][] = (await readLines("input.txt")).map(x => x.split(' ').map(y => Number(y))).filter(x => x.length > 1);

// "Safe" lines must satisfy both conditions:
// 1: All numbers either ascending or descending
// 2: Each number differs 1-3 from the last

const safeLines:number[][] = lines.filter((x) => {
    // If second value is greater than the first, check that each number is ascending
    // Otherwise check that each number is descending
    const vector = x[0] < x[1] ? 1 : -1;

    // oh no, granny loop
    for(let i=1; i<x.length; i++) {
        // For each entry in the line, ensure it is continuing to
        // ascend/descend by 1-3 in the right direction
        const difference = (x[i] - x[i - 1]) * vector;
        if (difference > 3 || difference < 1) return false;
    }

    return true;
})

console.log(`Part 1: ${safeLines.length}`);

// Part 2.

const extraSafeLines:number[][] = lines.filter((x) => {
    let vector = x[0] < x[1] ? 1 : -1;
    // This time, we allow a single unsafe entry
    let noUnsafeLevel = true;

    // oh no, granny loop
    for(let i=1; i<x.length; i++) {
        const difference = (x[i] - x[i - 1]) * vector;
        if (difference > 3 || difference < 1) {
            noUnsafeLevel = false;
            break;
        }
    }

    // No unsafe level found, statement passes
    if (noUnsafeLevel) return true;

    // There is at least one unsafe level. Iterate through each
    // permutation of line with one level removed.

    outer: for(let j=0; j<x.length; j++) {
        // Create a new line with the entry at index j removed
        const newLine = [...x.slice(0, j), ...x.slice(j+1)]
        // Reinitialize the vector
        vector = newLine[0] < newLine[1] ? 1 : -1;
        inner: for(let i=1; i<newLine.length; i++) {
            const difference = (newLine[i] - newLine[i - 1]) * vector;
            if (difference > 3 || difference < 1) {
                // This permutation fails, onto the next
                continue outer;
            }
        }
        // We did not continue which means this permutation passes
        return true;
    }

    // No valid permutation found
    return false;
})

console.log(`Part 2: ${extraSafeLines.length}`);
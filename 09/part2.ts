import { readText } from '../utils/fs.ts';

const input = await readText("input.txt");

const disk: (number|null)[] = [];

// Increment file ID
let fileID = 0;
// Alternate between files and blank spaces
let isFile = true;

input.split('').map(Number).forEach((x) => {
    const value = isFile ? fileID++ : null;
    for (let i=0; i<x; i++) disk.push(value);
    isFile = !isFile;
});

// Now we have our forwards input, we need to fill in the blanks.
for(let i=disk.length - 1; i>0; i--) {
    // We only need to fill blank spaces
    if (disk[i] === null) continue;

    // Figure out where the block starts and ends, and its size.
    let blockEnd = i;
    let blockStart = i;
    while (blockStart > 0 && disk[blockStart-1] === disk[blockEnd]) blockStart--;

    // Add one because end and start are inclusive.
    let blockSize = blockEnd - blockStart + 1;

    // Starting from the left, look for the first run of free blocks
    // large enough to fit the current file block
    let freeStart = 0;
    for (let j=0; j<blockStart; j++) {
        // If block is not free, move to the next
        if (disk[j] !== null) {
            freeStart = j+1;
            continue;
        } else if (j - freeStart + 1 === blockSize) {
            // We have found enough free space
            for(let k=freeStart; k<=j; k++) {
                disk[k] = disk[blockStart]
            }
            for(let k=blockStart; k<=blockEnd; k++) {
                disk[k] = null;
            }
            // We moved the block, break
            break;
        }
    }

    // Skip the rest of the current block, we already handled it.
    i = blockStart;
}

// Now we should have an array of numbers.
// The checksum is the sum of each block's file id multipled by its index.
const result = disk.reduce((a, x, i) => a + (x ?? 0) * i, 0);

console.log(`Checksum is ${result}`)

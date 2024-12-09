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
for(let i=0; i<disk.length; i++) {
    // We only need to fill blank spaces
    if (disk[i] !== null) continue;

    // If a blank space is encountered, fill from the end
    // Stop popping things off once we reach our current index
    while (disk.length > i) {
        const popped = disk.pop()!
        if (popped === null) continue;
        disk[i] = popped;
        break;
    }
}

// Now we should have an array of numbers.
// The checksum is the sum of each block's file id multipled by its index.
const result = disk.reduce((a, x, i) => a + (x ?? 0) * i, 0);

console.log(`Checksum is ${result}`)
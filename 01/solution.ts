import { readLines } from '../utils/fs.ts';

export {}

// Parse lines, filtering out the newline at the end.
const lines:string[][] = (await readLines("input.txt")).map(x => x.split('   ')).filter(x => x.length > 1);

// Get and sort both lists in ascending order
const firsts:number[] = lines.map(x => Number(x[0])).toSorted()
const lasts:number[] = lines.map(x => Number(x[1])).toSorted()

// Iterate through the first list and tally the difference of the corresponding
// item in the second list
const sumDifference:number = firsts.reduce((a, x, i) => {return a + Math.abs(x - lasts[i])}, 0);

console.log(`Part 1: ${sumDifference}`);

// Create a map of entry counts in the second list
const lastsCounts:{
    [key: number]: number
} = {}

lasts.forEach(x => {
    if (lastsCounts[x] === undefined) lastsCounts[x] = 1;
    else lastsCounts[x] += 1;
})

// Utility function for accessing the counts
const getCount = (x: number): number => lastsCounts[x] === undefined ? 0 : lastsCounts[x];

// Tally the "similarity scores"
const totalSimilarityScore = firsts.reduce((a, x) => {return a + getCount(x) * x}, 0)

console.log(`Part 2: ${totalSimilarityScore}`);

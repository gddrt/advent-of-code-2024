export {}

// Read file. Should make this a utility function.
using file = await Deno.open("input.txt", { read: true });
const fileInfo = await file.stat();
const buf = new Uint8Array(fileInfo.size);
await file.read(buf);
const text:string = new TextDecoder().decode(buf);

// Parse lines, filtering out the newline at the end.
const lines:string[][] = text.split('\n').map(x => x.split('   ')).filter(x => x.length > 1);

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

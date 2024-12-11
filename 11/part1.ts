import { readText } from "../utils/fs.ts"

const input = await readText("input.txt")

const numbers = input.split(" ").map(Number);

const blink = (stones: number[]): number[] => {
    let newStones: number[] = [];
    stones.forEach(x => {
        if (x === 0) {
            // If the stone is 0, it is replaced by 1
            newStones.push(1);
        } else if (Math.floor(Math.log10(x)) % 2 === 1) {
            // If the stone has an even number of digits, it is replaced by two stones
            const stoneString = x.toString()
            newStones.push(
                Number(stoneString.substring(0, stoneString.length / 2)),
                Number(stoneString.substring(stoneString.length / 2))
            )
        } else {
            // Otherwise the stone is multiplied by 2024
            newStones.push(x * 2024)
        }
    })
    return newStones;
}

let result = numbers;
for(let i=0; i<25; i++) {
    result = blink(result);
}

console.log(`${result.length} stones`)
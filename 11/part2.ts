import { readText } from "../utils/fs.ts"

const input = await readText("input.txt")

const numbers = input.split(" ").map(Number);

// Part 2 is too hard to brute force.
// Memoization to the rescue!
const cached:{
    [key: string]: number
} = {}

const blink = (stone:number, level:number): number => {
    // Never repeat a calculation.
    // If we already know how many stones a stone X at level Y
    // ultimately yields, we can use the cached value.
    const key = `${stone},${level}`;
    if (cached[key] !== undefined) return cached[key];

    // Cache miss -- so calculate and store.
    const result = (() => {
        if (level === 75) return 1;
        if (stone === 0) return blink(1, level + 1);
        if (Math.floor(Math.log10(stone)) % 2 === 1) {
            const stoneString = stone.toString();
            const leftStone = Number(stoneString.substring(0, stoneString.length / 2));
            const rightStone = Number(stoneString.substring(stoneString.length / 2));
            return blink(leftStone, level + 1) + blink(rightStone, level + 1)
        }
        return blink(stone * 2024, level + 1);
    })();

    cached[key] = result;
    return result;
}

const result = numbers.reduce((a, x) => a + blink(x, 0), 0)
console.log(`${result} stones`);

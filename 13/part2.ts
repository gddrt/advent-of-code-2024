import { readLines } from "../utils/fs.ts"

const input = await readLines("input.txt");

const totalInputGroups = input.length / 4;

type ClawMachine = {
    a: [number, number],
    b: [number, number],
    prize: [number, number]
}

const parseButtonOffset = (line: string): [number, number] => {
    return [
        Number(line.match(/X\+?(-?\d+)/)![1]),
        Number(line.match(/Y\+?(-?\d+)/)![1])
    ];
}

const parsePrizeOffset = (line: string): [number, number] => {
    return [
        Number(line.match(/X=(-?\d+)/)![1]) + 10000000000000,
        Number(line.match(/Y=(-?\d+)/)![1]) + 10000000000000
    ]
}

const parsedInput:ClawMachine[] = [];
for (let i=0; i<totalInputGroups; i++) {
    parsedInput.push({
        a: parseButtonOffset(input[i*4]),
        b: parseButtonOffset(input[i*4 + 1]),
        prize: parsePrizeOffset(input[i*4 + 2])
    })
}

const getPrizeCost = (cm: ClawMachine, a: number, b: number): number|null => {
    // Get resulting coordinates from all presses
    const x = cm.a[0] * a + cm.b[0] * b;
    const y = cm.a[1] * a + cm.b[1] * b;

    // This combination has gone too far
    if (x > cm.prize[0] || y > cm.prize[1]) return null;

    // This combination has not gone far enough
    if (x !== cm.prize[0] || y !== cm.prize[1]) return null;

    // It costs 3 per A press and 1 per B press.
    return a * 3 + b;
}

/**
 * Obviously this is too moduluslicated to brute force. But there's a trick.
 * In base 10, every 10th multiple of a number will repeat its last digit.
 * And every 100th multiple of a number will repeat its last two digits, and so on.
 * By working backwards like this we can eliminate impossible combinations very quickly.
 */
const getMachineCost = (cm: ClawMachine): number|null => {
    // Start at 10**0, ie. ones
    let exponent = 0;

    // Multiples that match our answer.
    let validMultiples:[number, number][] = [[0, 0]];

    // Track the cheapest valid solution if there is one
    let lowestCost: number|null = null;

    while (validMultiples.length > 0 && exponent < Math.log10(Math.min(cm.prize[0], cm.prize[1]))) {
        let newValidMultiples: [number, number][] = [];

        // For each valid multiple, try each combination one tens place up.
        // ie. If 5xA and 7xB work, we want to try 5,15,25,35...xA and 7,17,27,37...xB
        validMultiples.forEach(n => {
            const factor = Math.pow(10, exponent)
            const modulus = factor*10;

            for (let i=0; i<factor * 10; i+=factor) {
                for (let j=0; j<factor * 10; j+=factor) {
                    const aPresses = n[0] + i;
                    const bPresses = n[1] + j;
                    const x = cm.a[0] * aPresses + cm.b[0] * bPresses;
                    const y = cm.a[1] * aPresses + cm.b[1] * bPresses;

                    // If the resulting end digits match the prize coordinates, we have a potential match
                    if ((x % modulus) === (cm.prize[0] % modulus) && (y % modulus) === (cm.prize[1] % modulus)) {
                        // Check if it actually does match
                        let guess = getPrizeCost(cm, aPresses, bPresses);
                        if (guess !== null) {
                            if (lowestCost === null) lowestCost = guess;
                            else lowestCost = Math.min(guess, lowestCost);
                        } else {
                            // If not, maybe it's too low, try the next tens place over.
                            const [newX, newY] = [aPresses, bPresses];
                            newValidMultiples.push([newX, newY]);
                        }
                    }
                }
            }
        });
        exponent++;
        validMultiples = [...newValidMultiples];
    }
    return lowestCost;
}

const totalCost = parsedInput.reduce((a: number, cm: ClawMachine) => {
    return a + (getMachineCost(cm) ?? 0)
}, 0);

console.log(totalCost);
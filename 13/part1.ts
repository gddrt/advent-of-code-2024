import { readLines } from "../utils/fs.ts"

const input = await readLines("input.txt");

const totalInputGroups = input.length / 4;

type ClawMachine = {
    a: [number, number],
    b: [number, number],
    prize: [number, number]
}

type FailureReason = "tooFar"|"tooShort";

const parseButtonOffset = (line: string): [number, number] => {
    return [
        Number(line.match(/X\+?(-?\d+)/)![1]),
        Number(line.match(/Y\+?(-?\d+)/)![1])
    ];
}

const parsePrizeOffset = (line: string): [number, number] => {
    return [
        Number(line.match(/X=(-?\d+)/)![1]),
        Number(line.match(/Y=(-?\d+)/)![1])
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

const getPrizeCost = (cm: ClawMachine, a: number, b: number): number|FailureReason => {
    // Get resulting coordinates from all presses
    const x = cm.a[0] * a + cm.b[0] * b;
    const y = cm.a[1] * a + cm.b[1] * b;

    // This combination has gone too far
    if (x > cm.prize[0] || y > cm.prize[1]) return "tooFar";

    // This combination has not gone far enough
    if (x !== cm.prize[0] || y !== cm.prize[1]) return "tooShort";

    // It costs 3 per A press and 1 per B press.
    return a * 3 + b;
}

const getCheapestPrizeCost = (cm: ClawMachine): number|undefined => {
    let cheapest;
    for (let a=0; a<=100; a++) {
        for (let b=0; b<=100; b++) {
            const result = getPrizeCost(cm, a, b);
            if (result === "tooFar") break;
            if (result === "tooShort") continue;
            if (cheapest === undefined || cheapest > result) cheapest = result;
        }
    }
    return cheapest;
}

const solution = parsedInput.reduce((a, x) => a + (getCheapestPrizeCost(x) ?? 0), 0)

console.log(`${solution} total coins`)
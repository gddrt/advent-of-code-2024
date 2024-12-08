import { readLines } from "../utils/fs.ts";

const input = await readLines("input.txt");

type Equation = [number, number[]]

const equations: Equation[] = input.map(x => x.split(': ')).map(x => [Number(x[0]), x[1].split(' ').map(Number)])

const recursivelyOperate = (targetNum: number, firstNum: number, remainingNums: number[]) => {
    if (remainingNums.length === 0) return targetNum === firstNum;

    const newRemainingNums = remainingNums.slice(1);
    return (
        recursivelyOperate(targetNum, firstNum + remainingNums[0], newRemainingNums)
        || recursivelyOperate(targetNum, firstNum * remainingNums[0], newRemainingNums)
        || recursivelyOperate(targetNum, Number(firstNum.toString() + remainingNums[0].toString()), newRemainingNums)
    )
}

const validateEquation = ([result, nums]: Equation): boolean => {
    const newNums = nums.slice(1)
    return recursivelyOperate(result, nums[0], newNums);
}

const partOneAnswer = equations.filter(validateEquation).reduce((a, x) => a + x[0], 0)

console.log(partOneAnswer);
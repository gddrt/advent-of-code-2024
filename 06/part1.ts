import { readGrid } from '../utils/fs.ts';
import { FOUR_WAY_VECTORS } from '../utils/grid.ts';
import type { Direction, Coordinate } from '../utils/grid.ts';

export {}

const input:string[][] = await readGrid("input.txt")

// For this puzzle, direction does matter. Remember coordinates are [y][x]!
// Find the start position. Assume the guard is pointing UP.

const startPos: Coordinate = (() => {for (let i=0; i<input.length; i++) {
    let found = input[i].indexOf('^');
    if (found !== -1) {
        return [found, i];
    }}
})()! // ! we trust AOC to give us a solvable input

const turnRight = ( currentDirection: Direction): Direction => {
    switch (currentDirection) {
        case "UP":
            return "RIGHT";
        case "RIGHT":
            return "DOWN";
        case "DOWN":
            return "LEFT";
        case "LEFT":
            return "UP";
    }
}

type CoordinateContent = "CLEAR" | "OBSTACLE" | "OOB"

const getCoordinateContent = ([x, y]: Coordinate): CoordinateContent => {
    if (x < 0 || y < 0) return "OOB";
    if (y >= input.length) return "OOB";
    if (x >= input[y].length) return "OOB";

    return input[y][x] === "#" ? "OBSTACLE" : "CLEAR";
}

const getNextCoordinate = ([x, y]: Coordinate, d: Direction): Coordinate => {
    return [x + FOUR_WAY_VECTORS[d][1], y + FOUR_WAY_VECTORS[d][0]]
}

let guardDirection: Direction = "UP";
let currentPos = startPos;
let visited: String[] = [];

// While the guard is in bounds, he goes for a walk.
while (getCoordinateContent(currentPos) !== "OOB") {
    // store the string representation of visited coordinates
    visited.push(`${currentPos[0]},${currentPos[1]}`)

    let nextPos = getNextCoordinate(currentPos, guardDirection);
    // While the guard is facing an obstacle, he turns right.
    while (getCoordinateContent(nextPos) === "OBSTACLE") {
        guardDirection = turnRight( guardDirection );
        nextPos = getNextCoordinate(currentPos, guardDirection);
    }

    // Next square is clear, so go there.
    currentPos = nextPos;
}

// Remove duplicate visited
const visitedSet = new Set(visited)

console.log(`Part 1: The guard visited ${visitedSet.size} squares.`)

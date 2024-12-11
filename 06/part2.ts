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

const getPrevCoordinate = ([x, y]: Coordinate, d: Direction): Coordinate => {
    return [x - FOUR_WAY_VECTORS[d][1], y - FOUR_WAY_VECTORS[d][0]]
}

let guardDirection: Direction = "UP";
let currentPos = startPos;

const coordinatesAreEqual = (a: Coordinate, b: Coordinate): boolean => {
    return a[0] === b[0] && a[1] === b[1]
}
const nextObstacle = (pos: Coordinate, dir: Direction, pseudoObstacle: Coordinate):string|null => {
    let nextPos = getNextCoordinate(pos, dir);
    while (getCoordinateContent(nextPos) === "CLEAR" && !coordinatesAreEqual(nextPos, pseudoObstacle)) {
        nextPos = getNextCoordinate(nextPos, dir);
    }

    // Obstacle found, return a key
    if (getCoordinateContent(nextPos) === "OBSTACLE" || coordinatesAreEqual(nextPos, pseudoObstacle)) {
        return `${nextPos[0]},${nextPos[1]},${dir}`
    }
    // Next is OOB, so no obstacle
    return null;
};

const destructureKey = (key: string): [Coordinate, Direction] => {
    const coords = key.split(',').slice(0,2).map(Number) as Coordinate;
    const dir = key.split(',')[2] as Direction;
    return [coords, dir];
}

const nextObstacleFromKey = (key: string, pseudoObstacle: Coordinate):string|null => {
    let [ coords, dir ] = destructureKey(key)

    // The obstacle would be recorded at, say, (5, 0, UP)
    // We want to start then from (5, 1, RIGHT)
    coords = getPrevCoordinate(coords, dir);
    dir = turnRight(dir);
    let result = nextObstacle(coords, dir, pseudoObstacle);
    return result;
}

const goodPlacesToPutAnObstacle:Coordinate[] = [];

// While the guard is in bounds, he goes for a walk.
let coordsChecked:Set<string> = new Set();

let nextPos = getNextCoordinate(currentPos, guardDirection);
while (getCoordinateContent(nextPos) !== "OOB") {

    // While the guard is facing an obstacle, he turns right.
    while (getCoordinateContent(nextPos) === "OBSTACLE") {
        guardDirection = turnRight( guardDirection );
        nextPos = getNextCoordinate(currentPos, guardDirection);
        console.log("Turning", nextPos);
    }

    if (getCoordinateContent(nextPos) === "OOB") break;

    // If the guard's next space is clear, simulate blocking it.
    if (getCoordinateContent(nextPos) === "CLEAR") {
        let stringCoords = `${nextPos[0]},${nextPos[1]}`;

        // Careful not to check an obstacle at the same coordinate twice.
        if (coordsChecked.has(stringCoords)) {
            currentPos = nextPos;
            nextPos = getNextCoordinate(currentPos, guardDirection);
            continue;
        }

        coordsChecked.add(stringCoords);
        const simulatedDirection = turnRight(guardDirection);
        const obstaclesStruck: string[] = [];
        let result = nextObstacle(currentPos, simulatedDirection, nextPos);
        while (result !== null) {
            if (obstaclesStruck.includes(result)) {
                // We are in a loop!
                goodPlacesToPutAnObstacle.push(nextPos);
                break;
            }
            obstaclesStruck.push(result);
            result = nextObstacleFromKey(result, nextPos);
        }
    }

    // Next square is clear, so go there.
    currentPos = nextPos;
    nextPos = getNextCoordinate(currentPos, guardDirection);
}

// Remove duplicate visited
const obstaclesSet = new Set(goodPlacesToPutAnObstacle.map(([x, y]) => `${x},${y}`));

console.log(`Part 2: You can cause a loop in ${obstaclesSet.size} positions.`)
import { readLines } from "../utils/fs.ts"

const input = await readLines("input.txt");

type Coordinate = {
    x: number,
    y: number
}

const MAP_WIDTH = 101;
const MAP_HEIGHT = 103;

// Classes!
const Robot = class {
    position: Coordinate;
    velocity: Coordinate;

    constructor(position: Coordinate, velocity: Coordinate) {
        this.position = position;
        this.velocity = velocity;
    }

    move(ticks: number): void {
        // move the robot the number of ticks, accounting for wrapping.
        let newX = (this.position.x + this.velocity.x * ticks) % MAP_WIDTH;
        let newY = (this.position.y + this.velocity.y * ticks) % MAP_HEIGHT;

        // modulo is happy to give us negatives, but we don't want that.
        if (newX < 0) newX += MAP_WIDTH;
        if (newY < 0) newY += MAP_HEIGHT;

        this.position = {
            x: newX,
            y: newY
        }
    }

    getQuadrant(): number|null {
        // Robots that are in the exact middle are not in a quadrant
        if (this.position.x * 2 + 1 === MAP_WIDTH) return null;
        if (this.position.y * 2 + 1 === MAP_HEIGHT) return null;

        const eastWest = this.position.x * 2 > MAP_WIDTH ? 1 : 0;
        const northSouth = this.position.y * 2 > MAP_HEIGHT ? 1 : 0;

        // Return a number 1, 2, 3, 0. It doesn't really matter which is which.
        return eastWest * 2 + northSouth;
    }

    getStringCoordinates(): string { 
        return `${this.position.x},${this.position.y}`
    }
}

const robots = input.map((x) => {
    // p=0,4 v=3,-3
    const [px, py, vx, vy] = x.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!.slice(1,5).map(Number)
    return new Robot({x: px, y: py}, {x: vx, y: vy})
});

const robotCountPerQuadrant = [0, 0, 0, 0];
robots.forEach((r) => {
    r.move(100);
    const quadrant = r.getQuadrant();
    if (quadrant !== null) robotCountPerQuadrant[quadrant] += 1;
})

const safetyRating = robotCountPerQuadrant.reduce(((a, x) => a * x));
console.log(`Part 1: Safety rating is: ${safetyRating}`)
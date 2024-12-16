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

        // we use abs to avoid storing -0, yes that's a thing
        this.position = {
            x: Math.abs(newX),
            y: Math.abs(newY)
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

const getStringCoordinates = (x: number, y: number): string => `${x},${y}`;

const robots = input.map((x) => {
    // p=0,4 v=3,-3
    const [px, py, vx, vy] = x.match(/p=(\d+),(\d+) v=(-?\d+),(-?\d+)/)!.slice(1,5).map(Number)
    return new Robot({x: px, y: py}, {x: vx, y: vy})
});

// I guess we need to visualize, since the question doesn't tell us exactly what the christmas tree looks like.
// I started by simply drawing every sequential output (ie. after 1 step, 2 steps, 3 steps) and looking for patterns.
const stepAndDrawRobots = (steps=1): boolean => {
    const coords = new Map();
    // Here is the step
    robots.forEach((r) => {
        r.move(steps);
        const robotCoords = r.getStringCoordinates();
        coords.set(robotCoords, true);
    })

    // I noticed there was a sort of resonance every ~100ish
    // where many robots align themselves in a column that looks like a tree trunk.
    // Let's assume the correct solution has a vertical line of 5 somewhere in the middle.

    let lineFound = false;
    coords.forEach((v, k) => {
        let [x, y] = k.match(/(\d+),(\d+)/).slice(1,3).map(Number);
        if (x < 30 || x > 80) return;
        for (let ya=y; ya<y+5; ya++) {
            if (!coords.has(getStringCoordinates(x, ya))) return;
        }
        lineFound = true;
    })

    // No vertical line found, it's probably not a picture of anything.
    if (!lineFound) return false;

    // We found a line so let's draw it.
    for (let y=0; y<MAP_HEIGHT; y++) {
        let line = '';
        for (let x=0; x<MAP_WIDTH; x++) {
            line += coords.has(getStringCoordinates(x, y)) ? 'X' : ' '
        }
        console.log(line);
    }
    return true;
}

let steps=0;
let userInput = prompt("Starting steps?", "0");
while (isNaN(Number(userInput))) {
    console.log("Invalid entry.")
    userInput = prompt("Starting steps?", "0");
}
steps = Number(userInput);

let validPictures = 0;
while( validPictures < 50 ) {
    steps++;
    if (stepAndDrawRobots(1)) {
        validPictures++;
        console.log(`After ${steps} steps`)
        prompt("Continue")
    }
}

// There it is, after 7572 steps. In my input, at least. It looks like this. Tricky!
/*
                                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX            X                    X
                                    X                             X
                                    X                             X
                                    X                             X
                                 X  X                             X
                                    X              X              X            X
                                    X             XXX             X
                                    X            XXXXX            X
                X           X       X           XXXXXXX           X
    X                               X          XXXXXXXXX          X
                                    X            XXXXX            X
                              X     X           XXXXXXX           X
                                    X          XXXXXXXXX          X
              X                     X         XXXXXXXXXXX         X
            X                       X        XXXXXXXXXXXXX        X  X
                                  X X          XXXXXXXXX          X
  X                   X             X         XXXXXXXXXXX         X                           X
                                    X        XXXXXXXXXXXXX        X                           X
                                    X       XXXXXXXXXXXXXXX       X
                                    X      XXXXXXXXXXXXXXXXX      X          X
                                    X        XXXXXXXXXXXXX        X                               X
       XX                           X       XXXXXXXXXXXXXXX       X
                                    X      XXXXXXXXXXXXXXXXX      X                            X   X
                                 X  X     XXXXXXXXXXXXXXXXXXX     X
                                    X    XXXXXXXXXXXXXXXXXXXXX    X
     X                              X             XXX             X
                   X                X             XXX             X
                         X          X             XXX             X  X    X
                  X                 X                             X               X
                            X       X                             X
                                    X                             X
                                    X                             X
                                    XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
*/
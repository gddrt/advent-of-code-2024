// All combinations of movement vectors
export const EIGHT_WAY_VECTORS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];

export type Direction = "UP"|"LEFT"|"RIGHT"|"DOWN"
export type Coordinate = [number, number]

export const FOUR_WAY_VECTORS = {
    "UP": [-1, 0],
    "LEFT": [0, -1],
    "RIGHT": [0, 1],
    "DOWN": [1, 0]
}

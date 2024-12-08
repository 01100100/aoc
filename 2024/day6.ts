import * as fs from 'fs';
import * as path from 'path';

console.time('Total Execution');

const input_path: string = path.join(__dirname, `${path.basename(__filename, ".ts")}-input.txt`);
const input: string = fs.readFileSync(input_path, 'utf-8');
const lines: string[] = input.split('\n');

const testData =
    `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`

const testLines = testData.split('\n');

const grid: string[][] = [];
const testGrid: string[][] = [];
for (const line of testLines) {
    testGrid.push(line.split(''));
}

for (const line of lines) {
    grid.push(line.split(''));
}


console.log(`grid is ${grid.length} x ${grid[0].length}`);
function traverse(grid: string[][]): string[][] {
    const directions: Record<string, number[]> = {
        "^": [-1, 0],
        "v": [1, 0],
        "<": [0, -1],
        ">": [0, 1],
    };

    const rotate: Record<string, string> = {
        "^": ">",
        ">": "v",
        "v": "<",
        "<": "^",
    };

    let direction: string = "^";
    let position: { x: number, y: number } = { x: 0, y: 0 };

    // Find starting position
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '^') {
                position = { x: i, y: j };
                break;
            }
        }
    }

    while (true) {
        const nextX = position.x + directions[direction][0];
        const nextY = position.y + directions[direction][1];

        // Check both x and y bounds
        if (nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length) {
            // Out of bounds so mark the current position and return the grid.
            grid[position.x][position.y] = 'X';
            return grid;
        }

        const nextChar = grid[nextX][nextY];

        if (nextChar === '#') {
            // Hit a wall so rotate.
            direction = rotate[direction];
            continue;
        }

        if (nextChar === '.' || nextChar === 'X') {
            // Move forward and mark the path and the current position and direction.
            grid[position.x][position.y] = 'X';
            position = { x: nextX, y: nextY };
            grid[position.x][position.y] = direction;
        }
    }
}

function loopDetector(grid: string[][]): boolean {
    const directions: Record<string, number[]> = {
        "^": [-1, 0],
        "v": [1, 0],
        "<": [0, -1],
        ">": [0, 1],
    };

    const rotate: Record<string, string> = {
        "^": ">",
        ">": "v",
        "v": "<",
        "<": "^",
    };

    let direction = "^";
    let position = { x: 0, y: 0 };
    const visited = new Set<string>();
    const maxSteps = grid.length * grid[0].length * 4; // There are four directions we could possibly go over the entire grid so this is a very generous upper bound
    let steps = 0;

    // Find starting position
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '^') {
                position = { x: i, y: j };
                break;
            }
        }
    }

    // Traverse the grid
    while (steps < maxSteps) {
        const nextX = position.x + directions[direction][0];
        const nextY = position.y + directions[direction][1];
        const state = `${position.x},${position.y},${direction}`;

        if (nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length) {
            // Out of bounds
            return false;
        }

        if (visited.has(state)) {
            // Loop entered
            return true;
        }

        // record state including coordinates and direction
        visited.add(state);

        const nextChar = grid[nextX][nextY];
        if (nextChar === '#') {
            // Hit a wall so rotate
            direction = rotate[direction];
        } else {
            // Move forward
            position = { x: nextX, y: nextY };
        }
        steps++;
    }
    return true;
}

function countLoops(grid: string[][]): number {
    // Brute force over all possible grids with a single "#" added and count if a loop is detected.
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '.') {
                const gridCopy = grid.map(row => [...row]);
                gridCopy[i][j] = '#';
                if (loopDetector(gridCopy)) {
                    count++;
                    console.log(`Loop detected adding "#" in (${i},${j}).`);
                }
            }
        }
    }
    return count;
}

const output = traverse(structuredClone(grid));
const part1Count = output.flat().filter(cell => cell === 'X').length; 
console.log("Part 1:", part1Count);
console.log("Part 2:", countLoops(grid));
console.timeEnd('Total Execution');
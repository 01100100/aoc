import * as fs from 'fs';
import * as path from 'path';
import { off } from 'process';

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
    // set the starting position to be the coordinates of the '^' character and the direction to be up
    let directions: Record<string, number[]> = {
        "^": [-1, 0],
        "v": [1, 0],
        "<": [0, -1],
        ">": [0, 1],
    };
    let rotate: Record<string, string> = {
        "^": ">",
        "v": "<",
        "<": "^",
        ">": "v",
    };
    let direction = "^";
    let position: Record<string, number> =
    {
        x: 0,
        y: 0
    };

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '^') {
                position.x = i;
                position.y = j;
            }
        }
    }
    // loop until the next position goes out of bounds
    while (true) {
        if (position.x + directions[direction][0] < 0 || position.x + directions[direction][0] >= grid.length) {
            grid[position.x][position.y] = 'X';
            return grid;
        }
        let nextChar = grid[position.x + directions[direction][0]][position.y + directions[direction][1]];
        if (nextChar === '.' || nextChar === 'X') {
            grid[position.x][position.y] = 'X';
            position.x += directions[direction][0];
            position.y += directions[direction][1];
            grid[position.x][position.y] = direction;
        }
        if (nextChar === '#') {
            // rotate 90 degrees clockwise
            direction = rotate[direction] || "^";
        }

    }
}

const output = traverse(grid);
// for (const line in output) {
//     console.log(output[line].join(''));
// }

// count the number of X's in the grid
let count = 0;
for (let i = 0; i < output.length; i++) {
    for (let j = 0; j < output[i].length; j++) {
        if (output[i][j] === 'X') {
            count++;
        }
    }
}


console.log("part 1 test answer = ", count);

console.timeEnd('Total Execution');



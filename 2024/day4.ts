import * as fs from 'fs';
import * as path from 'path';


const input_path: string = path.join(__dirname, `${path.basename(__filename, ".ts")}-input.txt`);
const input: string = fs.readFileSync(input_path, 'utf-8');
const lines: string[] = input.split('\n');

// p1) I want to determine how many times "xmas" is given in a 2d array of letters. Like a word search, xmas can be normal or reversed and found horizontally, vertically, and diagonally.

// Lets start by parsing the input into a 2d grid of letters.

let grid: string[][] = [];
for (const line of lines) {
    grid.push(line.split(''));
}

const test_data = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`

let test_grid: string[][] = [];
for (const line of test_data.split('\n')) {
    test_grid.push(line.split(''));
}

function countXMAS(grid: string[][]): number {
    let count: number = 0;
    const height = grid.length;
    const width = grid[0].length;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            // Horizontal (right)
            if (j <= width - 4) {
                if (grid[i][j] === 'X' && grid[i][j + 1] === 'M' && grid[i][j + 2] === 'A' && grid[i][j + 3] === 'S') {
                    count++;
                }
                if (grid[i][j] === 'S' && grid[i][j + 1] === 'A' && grid[i][j + 2] === 'M' && grid[i][j + 3] === 'X') {
                    count++;
                }
            }

            // Vertical (down)
            if (i <= height - 4) {
                if (grid[i][j] === 'X' && grid[i + 1][j] === 'M' && grid[i + 2][j] === 'A' && grid[i + 3][j] === 'S') {
                    count++;
                }
                if (grid[i][j] === 'S' && grid[i + 1][j] === 'A' && grid[i + 2][j] === 'M' && grid[i + 3][j] === 'X') {
                    count++;
                }
            }

            // Diagonal (down-right)
            if (i <= height - 4 && j <= width - 4) {
                if (grid[i][j] === 'X' && grid[i + 1][j + 1] === 'M' && grid[i + 2][j + 2] === 'A' && grid[i + 3][j + 3] === 'S') {
                    count++;
                }
                if (grid[i][j] === 'S' && grid[i + 1][j + 1] === 'A' && grid[i + 2][j + 2] === 'M' && grid[i + 3][j + 3] === 'X') {
                    count++;
                }
            }

            // Diagonal (down-left)
            if (i <= height - 4 && j >= 3) {
                if (grid[i][j] === 'X' && grid[i + 1][j - 1] === 'M' && grid[i + 2][j - 2] === 'A' && grid[i + 3][j - 3] === 'S') {
                    count++;
                }
                if (grid[i][j] === 'S' && grid[i + 1][j - 1] === 'A' && grid[i + 2][j - 2] === 'M' && grid[i + 3][j - 3] === 'X') {
                    count++;
                }
            }
        }
    }
    return count;
}

console.log("part 1 answer = ", countXMAS(grid));

// p2) I want to determine how many times two "MAS" come up in a x.

// eg. M.S or S.S ect...
//     .A.    .A.
//     M.S    M.M
function checkMAS(grid: string[][]): number {
    let count = 0;
    const height = grid.length;
    const width = grid[0].length;

    for (let i = 0; i < height - 2; i++) {
        for (let j = 0; j < width - 2; j++) {
            if (i + 2 < height && j + 2 < width) {
                // Center must always be 'A'
                if (grid[i + 1][j + 1] !== 'A') continue;

                // Check forward diagonal (top-left to bottom-right)
                const fd1 = grid[i][j] + grid[i + 1][j + 1] + grid[i + 2][j + 2];
                // Check reverse diagonal (top-right to bottom-left)
                const fd2 = grid[i][j + 2] + grid[i + 1][j + 1] + grid[i + 2][j];

                // Check all valid combinations
                if ((fd1 === "MAS" || fd1 === "SAM") &&
                    (fd2 === "MAS" || fd2 === "SAM")) {
                    count++;
                }
            }
        }
    }
    return count;
}

console.log("part 2 answer = ", checkMAS(grid));
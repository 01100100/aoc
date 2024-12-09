import * as fs from 'fs';
import * as path from 'path';

console.time('Total Execution');

const input_path: string = path.join(__dirname, `${path.basename(__filename, ".ts")}-input.txt`);
const input: string = fs.readFileSync(input_path, 'utf-8');
const lines: string[] = input.split('\n');

const testData =
    `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`

// Each antenna is tuned to a specific frequency indicated by a single lowercase letter, uppercase letter, or digit.

const testLines = testData.split('\n');
let grid: string[][] = [];
let testGrid: string[][] = [];

for (const line of testLines) {
    testGrid.push(line.split(''));
}
console.log(`test grid is ${testGrid.length} x ${testGrid[0].length}`);

for (const line of lines) {
    grid.push(line.split(''));
}
console.log(`grid is ${grid.length} x ${grid[0].length}`);

interface AntennaData {
    count: number;
    positions: number[][];
}

function parseInput(grid: string[][]): Record<string, AntennaData> {
    const antennas: Record<string, AntennaData> = {};

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j];
            if (cell != ".") {
                if (!antennas[cell]) {
                    antennas[cell] = {
                        count: 0,
                        positions: []
                    };
                }
                antennas[cell].count++;
                antennas[cell].positions.push([i, j]);
            }
        }
    }

    return antennas;
}


function calculateAntiNodes(grid: string[][]): [string[][], number] {
    const antennas = parseInput(grid);
    console.log(`grid has ${Object.keys(antennas).length} unique antennas`);

    let outputGrid: string[][] = grid.map(row => [...row]);
    let antiNodes = new Set<string>();

    for (const antenna in antennas) {
        const positions = antennas[antenna].positions;
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const [x1, y1] = positions[i];
                const [x2, y2] = positions[j];
                const [dx, dy] = [x2 - x1, y2 - y1];

                // Calculate single anti-node in each direction
                const [anti1X, anti1Y] = [x1 - dx, y1 - dy];
                const [anti2X, anti2Y] = [x2 + dx, y2 + dy];

                // Check and add first anti-node
                if (isValidPosition(anti1X, anti1Y, outputGrid)) {

                    if (outputGrid[anti1X][anti1Y] != '#') {
                        if (outputGrid[anti1X][anti1Y] === '.') {
                            antiNodes.add(`${anti1X},${anti1Y}`);
                            outputGrid[anti1X][anti1Y] = '#';
                        } else {
                            antiNodes.add(`${anti1X},${anti1Y}`);
                        }
                    }
                }
                if (isValidPosition(anti2X, anti2Y, outputGrid)) {

                    // Check and add second anti-node
                    if (outputGrid[anti2X][anti2Y] != '#') {
                        if (outputGrid[anti2X][anti2Y] === '.') {
                            antiNodes.add(`${anti2X},${anti2Y}`);
                            outputGrid[anti2X][anti2Y] = '#';
                        } else {
                            antiNodes.add(`${anti2X},${anti2Y}`);
                        }
                    }
                }
            }
        }
    }
    return [outputGrid, antiNodes.size];
}

function calculateMoreAntiNodes(grid: string[][]): [string[][], number] {

    const antennas = parseInput(grid);
    console.log(`grid has ${Object.keys(antennas).length} unique antennas`);

    let outputGrid: string[][] = grid.map(row => [...row]);
    let antiNodes = new Set<string>();

    for (const antenna in antennas) {
        const positions = antennas[antenna].positions;
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const [x1, y1] = positions[i];
                const [x2, y2] = positions[j];
                const [dx, dy] = [x2 - x1, y2 - y1];
                // Include all Antennas as they are by def antiNodes in p2
                antiNodes.add(`${x1},${y1}`)
                antiNodes.add(`${x2},${y2}`)

                // Check anti-nodes in negative direction
                let [currentX, currentY] = [x1 - dx, y1 - dy];
                while (isValidPosition(currentX, currentY, outputGrid)) {
                    if (outputGrid[currentX][currentY] === '.') {
                        antiNodes.add(`${currentX},${currentY}`);
                        outputGrid[currentX][currentY] = '#';
                    } else {
                        antiNodes.add(`${currentX},${currentY}`);
                        
                    }
                    currentX -= dx;
                    currentY -= dy;
                }

                // Check anti-nodes in positive direction
                [currentX, currentY] = [x2 + dx, y2 + dy];
                while (isValidPosition(currentX, currentY, outputGrid)) {
                    if (outputGrid[currentX][currentY] === '.') {
                        antiNodes.add(`${currentX},${currentY}`);
                        outputGrid[currentX][currentY] = '#';
                    } else {
                        antiNodes.add(`${currentX},${currentY}`)
                    }
                    currentX += dx;
                    currentY += dy;
                }
            }
        }
    }
    return [outputGrid, antiNodes.size];
}

function isValidPosition(x: number, y: number, grid: string[][]): boolean {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
}

const [testOutput1, testP1] = calculateAntiNodes(testGrid);
for (const line of testOutput1) {
    console.log(line.join(''));
}
console.log("part 1 test answer = ", testP1);

const [testOutput2, testP2] = calculateMoreAntiNodes(testGrid);
for (const line of testOutput2) {
    console.log(line.join(''));
}
console.log("part 2 test answer = ", testP2);

const [output1, p1] = calculateAntiNodes(grid);
for (const line of output1) {
    console.log(line.join(''));
}
console.log("part 1 answer = ", p1);

const [output2, p2] = calculateMoreAntiNodes(grid);
for (const line of output2) {
    console.log(line.join(''));
}
console.log("part 2 answer = ", p2);

console.timeEnd('Total Execution');

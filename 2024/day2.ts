import * as fs from 'fs';
import * as path from 'path';


const input_path: string = path.join(__dirname, `${path.basename(__filename, ".ts")}-input.txt`);
const input: string = fs.readFileSync(input_path, 'utf-8');
const lines: string[] = input.split('\n');

// p1) I want to determine if a "report" of numbers is "safe" or "unsafe". A "report" is considered safe if the absolute difference between each pair of adjacent "levels" is less than 4, and the row is either strictly increasing or strictly decreasing... Otherwise the row is unsafe.

let safe: number = 0;

function isSafe(numbers: number[]): boolean {
    for (let i = 0; i < numbers.length - 1; i++) {
        if (Math.abs(numbers[i] - numbers[i + 1]) > 3) {
            // console.log(numbers, `difference between ${numbers[i]} and ${numbers[i + 1]} is > 3`);
            return false;
        }
        if (numbers[0] < numbers[1]) {
            // strictly increasing
            if (numbers[i] >= numbers[i + 1]) {
                // console.log(numbers, `not strictly increasing as ${numbers[i]} >= ${numbers[i + 1]}`);
                return false;
            }
        }
        else if (numbers[0] > numbers[1]) {
            // increasing
            if (numbers[i] <= numbers[i + 1]) {
                // console.log(numbers, `not strictly decreasing as ${numbers[i]} <= ${numbers[i + 1]}`);
                return false;
            }
        }
        else if (numbers[0] === numbers[1]) {
            // console.log(numbers, `first two numbers are equal ${numbers[0]} === ${numbers[1]}`);
            return false;
        }
        else {
            // console.log(numbers, 'error: unexpected case');
        }
    }
    // console.log(numbers, 'safe');
    return true
}

for (let line of lines) {
    let numbers: number[] = line.split(' ').map(Number);
    if (isSafe(numbers)) {
        safe++;
    }
}

console.log("part 1 answer = ", safe);

// p2) I want to determine if a "report" of numbers is "safe" or "unsafe" but allow removing a single number from the report.

// I can reuse the isSafe function from part 1, and create a new function that tries removing each number one at a time, its not the most efficient solution but it should work.

function isSafeSingleErrorRemoved(numbers: number[]): boolean {
    if (isSafe(numbers)) {
        return true;
    }
    for (let i = 0; i < numbers.length; i++) {
        const newNumbers = [...numbers.slice(0, i), ...numbers.slice(i + 1)];
        if (isSafe(newNumbers)) {
            return true;
        }
    }
    return false;
}

safe = 0;
for (let line of lines) {
    let numbers: number[] = line.split(' ').map(Number);
    if (isSafeSingleErrorRemoved(numbers)) {
        safe++;
    }
}

console.log("part 2 answer = ", safe);
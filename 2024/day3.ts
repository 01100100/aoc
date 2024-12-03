import * as fs from 'fs';
import * as path from 'path';

const input_path: string = path.join(__dirname, `${path.basename(__filename, ".ts")}-input.txt`);
const input = fs.readFileSync(input_path, 'utf-8');

// p1) I want to do pattern matching and extract all groups of the form "MUL(x,y)" where x and y are integers.

// Lets start with a regex pattern to do just that, and parse the input string to extract all such groups.

const regex_pattern: RegExp = /mul\((\d+),(\d+)\)/g // regular expression literal consists of a pattern enclosed between slashes, must include the global flag.

let sum: number = 0;

for (const match of input.matchAll(regex_pattern)) {
    sum += parseInt(match[1]) * parseInt(match[2]);
}
console.log("part 1 answer = ", sum);
const testInput = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"

// p2) I want to substitute out any group between "don't()" and the next "do()", this can be done with a regex pattern and the str.replaceAll method.

const betterInput = input.replaceAll(/don't\(\).*?do\(\)/gs, ""); // the g flag is for global, the s flag is for dotall which makes the dot match newlines, this is essential as the input has multiple lines.

sum = 0;
for (const match of betterInput.matchAll(regex_pattern)) {
    sum += parseInt(match[1]) * parseInt(match[2]);
}
console.log("part 2 answer = ", sum);

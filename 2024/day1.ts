import * as fs from 'fs';
import * as path from 'path';


const input_path: string = path.join(__dirname, `${path.basename(__filename, ".ts")}-input.txt`);
const input: string = fs.readFileSync(input_path, 'utf-8');
const lines: string[] = input.split('\n');


// p1) I want to parse the input into two lists of integers, and calculate the sum of the distance between the ordered elements of each list.

// Lets start by parsing the input into two lists of integers, and sorting them.

let listA: number[] = [];
let listB: number[] = [];
let sum: number = 0;

for (const [index, line] of lines.entries()) {
    const [a, b]: [number, number] = line.split('   ').map(Number) as [number, number];
    if (isNaN(a) || isNaN(b)) {
        console.log(`invalid input line number #${index}`, line,);
        continue
    }
    listA.push(a);
    listB.push(b);
}

listA.sort((a, b) => a - b);
listB.sort((a, b) => a - b);

// Now that we have two sorted lists, we can iterate over them and calculate the distance using the absolute differences between the ordered elements of each list.

while (listA.length > 0) {
    const smallestA = listA.shift();
    const smallestB = listB.shift();
    if (smallestA !== undefined && smallestB !== undefined) {
        sum += Math.abs(smallestA - smallestB);
    }
}

console.log("part 1 answer = ", sum);

// p2) I want to calculate the so called "similarity score" by adding up each number in the left list after multiplying it by the number of times that number appears in the right list.

// First I will repopulate the lists.


for (const [index, line] of lines.entries()) {
    const [a, b]: [number, number] = line.split('   ').map(Number) as [number, number];
    if (isNaN(a) || isNaN(b)) {
        console.log(`invalid input line number #${index}`, line,);
        continue
    }
    listA.push(a);
    listB.push(b);
}

// Now I will create a map of the counts of each number in the right list.
const counts = new Map<number, number>();
for (const x of listB) {
    counts.set(x, (counts.get(x) || 0) + 1);
}

// Now that we have the counts, we can iterate over the left list and calculate the similarity score by multiplying each number by the count of that number in the right list.
let similarityScore: number = 0;
for (const x of listA) {
    similarityScore += x * (counts.get(x) || 0);
}

console.log("part 2 answer = ", similarityScore);

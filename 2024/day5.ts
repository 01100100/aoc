import * as fs from 'fs';
import * as path from 'path';


console.time('Total Execution');

const input_path: string = path.join(__dirname, `${path.basename(__filename, ".ts")}-input.txt`);
const input: string = fs.readFileSync(input_path, 'utf-8');
const lines: string[] = input.split('\n');

const test_data = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`;

let test_lines: string[] = test_data.split('\n');

// p1) I will parse the input to useful a useful data struct and then write a function to determine if a given update is valid based on the ordering rules. Then I will take the middle element of each valid update and sum them all up.

type selection = "orderingRules" | "updates";
// forwardRules will be a array with each elements representing a page number based on its index, each element will be either an empty array or an array of page numbers that should follow the indexed positioned page as defined in the orderingRules.
let forwardRules: number[][] = [];
// reverseRules will be a array with each elements representing a page number based on its index, each element will be either an empty array or an array of page numbers that should precede the indexed positioned page as defined in the orderingRules.
let reverseRules: number[][] = [];
let updates: number[][] = [];

function parseInput(lines: string[]): [number[][], number[][], number[][]] {
    const forwardRules: number[][] = [];
    const reverseRules: number[][] = [];
    const updates: number[][] = [];
    let selection: selection = "orderingRules";
    for (const line of lines) {
        if (line === "") {
            selection = "updates";
            continue;
        }
        if (selection === "orderingRules") {
            const parts = line.split('|').map(Number);
            if (parts.length === 2) {
                const [beforePage, afterPage]: [number, number] = parts as [number, number];
                if (!forwardRules[beforePage]) forwardRules[beforePage] = [];
                if (!reverseRules[afterPage]) reverseRules[afterPage] = [];
                forwardRules[beforePage].push(afterPage);
                reverseRules[afterPage].push(beforePage);
            }
        }
        else if (selection === "updates") {
            updates.push(line.split(',').map(Number));
        }
    }
    return [forwardRules, reverseRules, updates];
}


function isValid(update: number[], forwardRules: number[][], reverseRules: number[][]): boolean {
    for (let i = 0; i < update.length; i++) {
        for (let j = i + 1; j < update.length; j++) {
            const earlier = update[i];
            const later = update[j];
            // Check if later should come before earlier based on rules
            if (reverseRules[earlier]?.includes(later)) {
                return false;
            }
            // Check if earlier should come after later based on rules
            if (forwardRules[later]?.includes(earlier)) {
                return false;
            }
        }
    }
    return true;
}

console.time('Parsing Input');
[forwardRules, reverseRules, updates] = parseInput(lines);
console.timeEnd('Parsing Input');

console.time('p1')
const validUpdates: number[][] = []
const invalidUpdates: number[][] = []
for (const update of updates) {
    if (isValid(update, forwardRules, reverseRules)) {
        validUpdates.push(update);
    } else {
        invalidUpdates.push(update);
    }
}

let score: number = 0
for (const update of validUpdates) {
    // take the middle element of the update array
    const middleIdx: number = Math.floor(update.length / 2);
    score += update[middleIdx];
}

console.log("part 1 test answer", score);
console.timeEnd('p1');

// p2) I want to take the invalid updates and permutate the elements to find a "corrected" valid update. Then I will take the middle element of the corrected update and sum them all up.

// While python has the itertools library built in, there is no such library in javascript. I will write a simple recursive function to generate all permutations of an array.

function allPermutationsRecursive(arr: number[]): number[][] {
    if (arr.length === 0) return [[]];
    const [first, ...rest] = arr;
    const perms: number[][] = [];
    for (const perm of allPermutationsRecursive(rest)) {
        for (let i = 0; i <= perm.length; i++) {
            perms.push([...perm.slice(0, i), first, ...perm.slice(i)]);
        }
    }
    return perms;
}

// This function got a FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
// It is probably due to the implementation, because the data doesn't seem so big. For an array of length n we should expect n! permutations.

// const maxLength = Math.max(...invalidUpdates.map(arr => arr.length));
// console.log("Maximum length of arrays:", maxLength);

// The largest array has 23 elements. Factorials grow very quickly, and 23!=2.5852017e+22 which is pretty dam big. 

// I will try to implement a more efficient permutation function, instead of calculating all permutations at once, I will calculate them one by one.

// To calculate a next permutation, I will find the pivot point, then find the element from the right that is greater than the pivot, swap them, and then reverse the elements from pivot + 1 to the end.

function nextPermutation(arr: number[]): boolean {
    const swap = (i: number, j: number) => {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    };

    // Find pivot point
    let i = arr.length - 2;
    while (i >= 0 && arr[i] >= arr[i + 1]) i--;
    
    // If no pivot found, array is in descending order - no next permutation
    if (i < 0) return false;

    // Reverse suffix
    let j = i + 1, k = arr.length - 1;
    while (j < k) swap(j++, k--);

    // Find successor to pivot and swap
    for (j = i + 1; arr[i] >= arr[j]; j++);
    swap(i, j);

    return true;
}

function* permutationGenerator(arr: number[]): Generator<number[]> {
    // Start with sorted array
    const current = [...arr].sort((a, b) => a - b);
    
    yield [...current];
    while (nextPermutation(current)) {
        yield [...current];
    }
}


function correctUpdate(update: number[], forwardRules: number[][], reverseRules: number[][]): number[] {
    for (const potentialUpdate of permutationGenerator(update)) {
        if (isValid(potentialUpdate, forwardRules, reverseRules)) {
            return potentialUpdate;
        }
    }
    console.log("No valid update found for update", update);
    return [];
}


// ok, even with a generator, it is still taking too long. There are too many possible permutations in the space, and most are invalid so we are wasting time generating them.

// it should take the elements as a set and try to arrange them in a way that respects the rules. It should start with a single element of the invalid update and then try to add the next element in a way that respects the rules. If it can't, it should backtrack and try a different arrangement.

// // check that all the updates have unique elements
// for (const update of updates) {
//     const set = new Set(update);
//     if (set.size !== update.length) {
//         console.log("Update has duplicate elements", update);
//     }
// }

// All updates have unique elements, so we do not have to worry about repeated elements. We also know the outputted update will have the same length as the input update.

// we will iterate over the invalid update, and use each element to start a potentialUpdate.
// then we will look up the forwardRules and reverseRules to determine the next element in the potentialUpdate.
// if we can't find a valid next element, we will backtrack and try a different element.
function correctUpdateBasedOnRules(update: number[], forwardRules: number[][], reverseRules: number[][]): number[] {
    const used = new Set<number>();
    const result: number[] = [];
    
    function isValidNext(current: number, next: number): boolean {
        if (reverseRules[next]?.includes(current)) return false;
        if (forwardRules[current]?.includes(next)) return false;
        return true;
    }

    function backtrack(pos: number): boolean {
        if (pos === update.length) {
            return true;
        }

        // Try each unused number from the original update
        for (const num of update) {
            if (!used.has(num)) {
                if (result.length === 0 || isValidNext(result[result.length - 1], num)) {
                    result.push(num);
                    used.add(num);
                    if (backtrack(pos + 1)) {
                        return true;
                    }
                    result.pop();
                    used.delete(num);
                }
            }
        }
        return false;
    }

    backtrack(0);
    return result;
}

console.log(invalidUpdates);
console.time('p2');
let score2: number = 0
for (const update of invalidUpdates) {
    console.time('Correcting Update');
    const correctedUpdate = correctUpdateBasedOnRules(update, forwardRules, reverseRules);
    console.log("Corrected update", correctedUpdate, "Original update", update);
    console.timeEnd('Correcting Update');
    const middleIdx: number = Math.floor(correctedUpdate.length / 2);
    score2 += correctedUpdate[middleIdx];
}
console.timeEnd('p2');

console.log("part 2 test answer", score2);
console.timeEnd('Total Execution');

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const year = process.argv[2];
const day = process.argv[3];

if (!year || !day) {
  console.error('Usage: npx ts-node getInput.ts <year> <day>');
  process.exit(1);
}

const cookie = process.env.SESSION_COOKIE
if (!cookie) {
  console.error('Please set the SESSION_COOKIE environment variable');
  process.exit(1);
}

const inputUrl = `https://adventofcode.com/${year}/day/${day}/input`;
const inputFilePath = path.join(__dirname, `${year}/day${day}-input.txt`);
const solutionFilePath = path.join(__dirname, `${year}/day${day}.ts`);

const options = {
  headers: {
    'Cookie': `session=${cookie}`
  }
};

https.get(inputUrl, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to get input for day ${day}: ${res.statusCode}`);
    res.resume();
    return;
  }

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    fs.writeFileSync(inputFilePath, data);
    console.log(`Input for day ${day} saved to ${inputFilePath}`);
    fs.writeFileSync(solutionFilePath, `import * as fs from 'fs';
import * as path from 'path';


const input_path: string = path.join(__dirname, \`\${path.basename(__filename, ".ts")}-input.txt\`);
const input: string = fs.readFileSync(input_path, 'utf-8');
const lines: string[] = input.split('\\n');
`);
    console.log(`Solution file created at ${solutionFilePath}`);
  });
}).on('error', (e) => {
  console.error(`Failed to get input for day ${day}:`, e);
});
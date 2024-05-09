import readline from 'readline';
import { performUp, performCd, performLs } from './commands/fileNavigation.js';
import { performCat, performAdd, performRm, performMv, performCp, performRn } from './commands/basicOperations.js';
import { performOsInfo } from './commands/osInfo.js';
import { performHash } from './commands/hashOperation.js';
import { performCompress, performDecompress } from './commands/compression.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '>'
});

const username = process.argv[2]?.split('=')[1];

if (!username) {
  console.error('Please provide a username with --username=your_username');
  process.exit(1);
}

console.log(`Welcome to the File Manager, ${username}! You are currently in ${process.cwd()}`);
rl.prompt();

const commandHandlers = {
  up: performUp,
  cd: performCd,
  ls: performLs,
  cat: performCat,
  add: performAdd,
  rm: performRm,
  mv: performMv,
  cp: performCp,
  rn: performRn,
  os: performOsInfo,
  hash: performHash,
  compress: performCompress,
  decompress: performDecompress,
  '.exit': () => rl.close(),
};

rl.on('line', (line) => {
  const [command, ...args] = line.trim().split(/\s+/);
  const handler = commandHandlers[command];
  if (handler) {
    handler(args);
  } else {
    console.log('Invalid input');
  }
  rl.prompt();
});

rl.on('close', () => {
  console.log(`Thank you for using File Manager, ${username}! Goodbye!`);
  process.exit(0);
});
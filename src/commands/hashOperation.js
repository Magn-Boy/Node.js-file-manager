import crypto from 'crypto';
import fs from 'fs';
import { pipeline } from 'stream/promises';

export const performHash = async (args) => {
  if (args.length !== 1) {
    console.log('Invalid input. Usage: hash <path_to_file>');
    return;
  }

  const [filePath] = args;
  try {
    const hash = crypto.createHash('sha256');
    const readStream = fs.createReadStream(filePath);

    await pipeline(readStream, hash);

    console.log(`The SHA-256 hash of ${filePath} is: ${hash.digest('hex')}`);
  } catch (error) {
    console.error(`Failed to calculate hash for ${filePath}: ${error.message}`);
  }
};
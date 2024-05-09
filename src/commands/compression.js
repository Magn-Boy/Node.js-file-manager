import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { pipeline } from 'stream/promises';
import path from 'path';

const performOperation = async (args, operation) => {
  if (args.length !== 2) {
    console.log(`Invalid input. Usage: ${operation} <source_path> <destination_path>`);
    return;
  }

  const [source, destination] = args.map(arg => path.resolve(process.cwd(), arg));
  const streamTransformer = operation === 'compress' ? createBrotliCompress() : createBrotliDecompress();
  const sourceStream = createReadStream(source);
  const destinationStream = createWriteStream(destination);

  try {
    await pipeline(
      sourceStream,
      streamTransformer,
      destinationStream
    );
    console.log(`File has been ${operation === 'compress' ? 'compressed' : 'decompressed'} and saved to ${destination}`);
  } catch (error) {
    console.error(`Failed to ${operation} file: ${error.message}`);
  }
};

export const performCompress = async args => performOperation(args, 'compress');

export const performDecompress = async args => performOperation(args, 'decompress');

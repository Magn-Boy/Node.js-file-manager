import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { promisify } from 'util';
import path from 'path';

const pipeline = promisify(require('stream').pipeline); // Промисифицируем pipeline

export const performCompress = async (args) => {
  if (args.length !== 2) {
    console.log('Invalid input. Usage: compress <path_to_file> <path_to_destination>');
    return;
  }

  const [source, destination] = args.map(arg => path.resolve(process.cwd(), arg));
  const compressStream = createBrotliCompress();
  const sourceStream = createReadStream(source);
  const destinationStream = createWriteStream(destination);

  try {
    await pipeline(
      sourceStream,
      compressStream,
      destinationStream
    );
    console.log(`File has been compressed and saved to ${destination}`);
  } catch (error) {
    console.error(`Failed to compress file: ${error.message}`);
  }
};

export const performDecompress = async (args) => {
  if (args.length !== 2) {
    console.log('Invalid input. Usage: decompress <path_to_compressed_file> <path_to_destination>');
    return;
  }

  const [source, destination] = args.map(arg => path.resolve(process.cwd(), arg));
  const decompressStream = createBrotliDecompress();
  const sourceStream = createReadStream(source);
  const destinationStream = createWriteStream(destination);

  try {
    await pipeline(
      sourceStream,
      decompressStream,
      destinationStream
    );
    console.log(`File has been decompressed and saved to ${destination}`);
  } catch (error) {
    console.error(`Failed to decompress file: ${error.message}`);
  }
};

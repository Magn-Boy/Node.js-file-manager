import { promises as fs } from 'fs';
import zlib from 'zlib';
import path from 'path';

export const performCompress = async (args) => {
  if (args.length !== 2) {
    console.log('Invalid input. Usage: compress <path_to_file> <path_to_destination>');
    return;
  }

  const [source, destination] = args.map(arg => path.resolve(process.cwd(), arg));
  
  try{
    const sourceData = await fs.readFile(source);
    const compressedData = zlib.brotliCompressSync(sourceData);
    await fs.writeFile(destination, compressedData);
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
  
  try {
    const compressedData = await fs.readFile(source);
    const decompressedData = zlib.brotliDecompressSync(compressedData);
    await fs.writeFile(destination, decompressedData);
    console.log(`File has been decompressed and saved to ${destination}`);
  } catch (error) {
    console.error(`Failed to decompress file: ${error.message}`);
  }
};

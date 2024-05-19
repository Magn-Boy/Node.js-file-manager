import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const resolveFilePath = (...args) => path.resolve(process.cwd(), ...args);

const performAction = async (action, args, usage, successMessage) => {
  if (args.length !== usage.length) {
    console.log(`Invalid input. Usage: ${usage.join(' ')}`);
    return;
  }

  try {
    await action(...args);
    console.log(successMessage);
  } catch (error) {
    console.error(`Operation failed: ${error.message}`);
  }
};

export const performCat = async (args) => {
  if (args.length !== 1) {
    console.log('Invalid input. Usage: cat <path_to_file>');
    return;
  }

  const [filePath] = args.map(arg => path.resolve(process.cwd(), arg));
  try {
    const readStream = createReadStream(filePath, { encoding: 'utf-8' });
    readStream.pipe(process.stdout);
  } catch (error) {
    console.error(`Failed to read file ${filePath}: ${error.message}`);
  }
};

export const performAdd = async (args) => {
  if (args.length !== 1) {
    console.log('Invalid input. Usage: add <new_file_name>');
    return;
  }

  const [fileName] = args;
  const filePath = path.resolve(process.cwd(), fileName);

  try {
    await fs.writeFile(filePath, '');
    console.log(`File ${fileName} has been created`);
  } catch (error) {
    console.error(`Failed to create file ${filePath}: ${error.message}`);
  }
};

export const performRm = async (args) => {
  if (args.length !== 1) {
    console.log('Invalid input. Usage: rm <path_to_file>');
    return;
  }

  const filePath = resolveFilePath(args[0]);

  try {
    await fs.unlink(filePath);
    console.log(`File ${filePath} has been deleted`);
  } catch (error) {
    console.error(`Failed to delete file: ${error.message}`);
  }
};

export const performRn = async (args) => {
  if (args.length !== 2) {
    console.log('Invalid input. Usage: rn <path_to_file> <new_filename>');
    return;
  }

  const [oldPath, newName] = args.map(arg => resolveFilePath(arg));
  performAction(
    () => fs.rename(oldPath, newName),
    [],
    ['rn', '<path_to_file>', '<new_filename>'],
    `File has been renamed to ${newName}`
  );
};

export const performCp = async (args) => {
  if (args.length !== 2) {
    console.log('Invalid input. Usage: cp <path_to_file> <path_to_new_directory>');
    return;
  }

  const [source, destination] = args.map(arg => path.resolve(process.cwd(), arg));
  try {
    await pipeline(
      createReadStream(source),
      createWriteStream(destination)
    );
    console.log(`File has been copied to ${destination}`);
  } catch (error) {
    console.error(`Failed to copy file: ${error.message}`);
  }
};

export const performMv = async (args) => {
  if (args.length !== 2) {
    console.log('Invalid input. Usage: mv <path_to_file> <path_to_new_directory>');
    return;
  }

  const [source, destination] = args.map(arg => resolveFilePath(arg));

  const sourceStream = createReadStream(source);
  const destinationStream = createWriteStream(destination);

  try {
    await pipeline(sourceStream, destinationStream);
    await fs.unlink(source); // Delete the source file after successful copying
    console.log(`File has been moved to ${destination}`);
  } catch (error) {
    console.error(`Failed to move file: ${error.message}`);
  }
};


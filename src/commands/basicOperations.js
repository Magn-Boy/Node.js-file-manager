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

  const filePath = resolveFilePath(args[0]);
  performAction(
    () => createReadStream(filePath, { encoding: 'utf-8' }).pipe(process.stdout),
    [],
    ['cat', '<path_to_file>'],
    `Operation completed successfully`
  );
};

export const performAdd = async (args) => {
  if (args.length !== 1) {
    console.log('Invalid input. Usage: add <new_file_name>');
    return;
  }

  const fileName = args[0];
  const filePath = resolveFilePath(fileName);
  performAction(
    () => fs.writeFile(filePath, ''),
    [],
    ['add', '<new_file_name>'],
    `File ${fileName} has been created`
  );
};

export const performRm = async (args) => {
  if (args.length !== 1) {
    console.log('Invalid input. Usage: rm <path_to_file>');
    return;
  }

  const filePath = resolveFilePath(args[0]);

  try {
    if (await checkExists(filePath)) { // Use the imported checkExists function
      await fs.unlink(filePath);
      console.log(`File ${filePath} has been deleted`);
    } else {
      console.error(`File '${filePath}' does not exist`);
    }
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

  const [source, destination] = args.map(arg => resolveFilePath(arg));
  console.log(`Copying file from ${source} to ${destination}`);
  performAction(
    () => pipeline(createReadStream(source), createWriteStream(destination)),
    [],
    ['cp', '<path_to_file>', '<path_to_new_directory>'],
    `File has been copied to ${destination}`
  );
};

export const performMv = async (args) => {
  if (args.length !== 2) {
    console.log('Invalid input. Usage: mv <path_to_file> <path_to_new_directory>');
    return;
  }

  const [source, destination] = args.map(arg => resolveFilePath(arg));

  performAction(
    async () => {
      try {
        await fs.rename(source, destination);
        console.log(`File has been moved to ${destination}`);
      } catch (error) {
        console.error(`Failed to move file: ${error.message}`);
      }
    },
    [], 
    ['mv', '<path_to_file>', '<path_to_new_directory>'],
    `File has been moved to ${destination}`
  );
};


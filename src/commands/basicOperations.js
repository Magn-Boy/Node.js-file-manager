import { createReadStream, createWriteStream, unlink, writeFile, rename } from 'fs/promises';
import path from 'path';

const performAction = async (action, args, usage) => {
  if (args.length !== usage.length) {
    console.log(`Invalid input. Usage: ${usage.join(' ')}`);
    return;
  }

  const resolvedArgs = args.map(arg => path.resolve(process.cwd(), arg));
  try {
    await action(...resolvedArgs);
    console.log(`Operation completed successfully`);
  } catch (error) {
    console.error(`Operation failed: ${error.message}`);
  }
};

export const performCat = async (args) => {
  await performAction(createReadStream, args, ['cat', '<path_to_file>']);
};

export const performAdd = async (args) => {
  await performAction(writeFile, [args[0], ''], ['add', '<new_file_name>']);
};

export const performRm = async (args) => {
  await performAction(unlink, args, ['rm', '<path_to_file>']);
};

export const performRn = async (args) => {
  await performAction(rename, [args[0], args[1]], ['rn', '<path_to_file>', '<new_filename>']);
};

export const performCp = async (args) => {
  await performAction(copyFile, args, ['cp', '<path_to_file>', '<path_to_new_directory>']);
};

export const performMv = async (args) => {
  await performAction(moveFile, args, ['mv', '<path_to_file>', '<path_to_new_directory>']);
};

const copyFile = async (source, destination) => {
  await pipeline(
    createReadStream(source),
    createWriteStream(destination)
  );
};

const moveFile = async (source, destination) => {
  await copyFile(source, destination);
  await unlink(source);
};

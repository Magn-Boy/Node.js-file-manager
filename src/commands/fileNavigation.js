import os from 'os';
import fs from 'fs/promises';
import path from 'path';

export const performUp = async () => {
    const newDir = path.resolve(process.cwd(), '..');
    const homeDir = os.homedir();
    if (newDir !== homeDir && newDir.startsWith(homeDir)) {
        process.chdir(newDir);
        console.log(`You are currently in ${process.cwd()}`);
    }
};

export const performCd = async (args) => {
    if (args.length !== 1) {
        console.log('Usage: cd <path_to_directory>');
        return;
    }
    const newDir = path.resolve(process.cwd(), args[0]);
    try {
        await fs.access(newDir);
        process.chdir(newDir);
        console.log(`You are currently in ${process.cwd()}`);
    } catch {
        console.error('The specified path does not exist or is not accessible');
    }
};

export const performLs = async () => {
    try {
        const files = await fs.readdir(process.cwd(), { withFileTypes: true });
        const detailedFiles = files
            .map(dirent => ({ name: dirent.name, type: dirent.isDirectory() ? 'directory' : 'file' }))
            .sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
        
        console.table(detailedFiles);
    } catch {
        console.error('Unable to list the contents of the directory');
    }
};

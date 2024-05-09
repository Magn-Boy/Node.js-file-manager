import fs from 'fs/promises';
import path from 'path';

// Проверка, является ли путь папкой
export const isDirectory = async (fullPath) => {
  try {
    const stats = await fs.stat(fullPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
};

// Проверка, не выходим ли мы за пределы допустимой директории
export const isPathAccessible = (pathToCheck, homeDir) => {
  const resolvedPath = path.resolve(pathToCheck);
  return resolvedPath.startsWith(homeDir);
};
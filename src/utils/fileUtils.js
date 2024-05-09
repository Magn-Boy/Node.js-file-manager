import fs from 'fs/promises';

// Проверка существования файла или директории
export const checkExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};
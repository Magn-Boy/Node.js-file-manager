import path from 'path';

// Получение полного пути с учётом текущего рабочего каталога
export const getFullPath = (relativePath) => {
  return path.resolve(process.cwd(), relativePath);
};
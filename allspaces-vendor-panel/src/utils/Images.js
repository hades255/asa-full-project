import { BACKEND_BASE_URL } from './Constants';

export const getImageFullPath = (path) => {
  if (path.startsWith('https://'))
    return path;

  if (!path)
    return '';

  return `${BACKEND_BASE_URL}${addLeadingSlashPath(path)}`
};

export const getImageNameFromPath = (path) => {
  if (!path)
    return '';

  return addLeadingSlashPath(path).split('/')[2]
};

const addLeadingSlashPath = (path) => {
  if (!path.startsWith('/')) {
    return `/${path}`;
  }

  return path;
};

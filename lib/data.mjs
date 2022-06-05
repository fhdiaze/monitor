import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const baseDir = path.join(dirName, '../.data/');

const create = (dir, file, data) => {
  const fileDescriptor = fs.openSync(`${baseDir}/${dir}/${file}.json`, 'wx');

  if (!fileDescriptor) {
    throw new Error('Could not create new file, it mays already exists');
  }

  const stringData = JSON.stringify(data);
  fs.writeFileSync(fileDescriptor, stringData);
  fs.close(fileDescriptor);
};

const read = (dir, file) => {
  const fullPath = path.join(baseDir, dir, `${file}.json`);
  const content = fs.readFileSync(fullPath, 'utf-8');

  return content;
};

const update = (dir, file, data) => {
  const fullPath = path.join(baseDir, dir, `${file}.json`);
  const fileDescriptor = fs.openSync(fullPath, 'r+');
  const stringData = JSON.stringify(data);
  fs.truncateSync(fileDescriptor);
  fs.writeFileSync(fileDescriptor, stringData);
};

const del = (dir, file) => {
  const fullPath = path.join(baseDir, dir, `${file}.json`);
  fs.unlinkSync(fullPath);
}

export { baseDir, create, read, update, del };

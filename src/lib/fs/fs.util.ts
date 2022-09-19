import * as os from 'os';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const tmpdir = os.tmpdir();
const pid = process.pid;
let pidTempFolderCreated = false;

export function tempFileName(extension: string = null) {
  createTempFolder();
  if (extension) {
    return `${tmpdir}/${pid}/${uuidv4()}.${extension}`;
  } else {
    return `${tmpdir}/${pid}/${uuidv4()}`;
  }
}

function createTempFolder() {
  if (pidTempFolderCreated) {
    return;
  }
  try {
    fs.mkdirSync(`${tmpdir}/${pid}`, { recursive: true });
  } catch (e) {
    console.error(e);
  }
  pidTempFolderCreated = true;
}

// RITZ SKIP
import { CallContextEvent, CCE, dedent, getRuntime } from "ritz2";
import { FileOperationOptions, FileOperationReturn } from "./fs.model";
import { file } from './fs.ritz.default';
import * as fs from 'fs';
import * as YAML from 'yaml';
import * as prependFile from 'prepend-file';
import { promise } from "@jovian/type-tools";

export { YAML };

function fileModel(cce: CallContextEvent, ...args) {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        return resolve(Object.assign({
          isFileTarget: true,
          'on a >> this': (cce: CCE, opName, self, a, b, c) => {
            const content = Buffer.isBuffer(a) ? a: typeof a === 'string' ? Buffer.from(a, self.encoding) : null;
            return promise(async (resolve2, reject2) => {
              fs.appendFile(self.file, content, { encoding }, e => { if (e) { return reject2(e); } return resolve2(void 0); });
            });
          },
          'on this << b': (cce: CCE, opName, self, a, b, c) => {
            const content = Buffer.isBuffer(b) ? b: typeof b === 'string' ? Buffer.from(b, self.encoding) : null;
            return promise(async (resolve2, reject2) => {
              fs.appendFile(self.file, content, { encoding }, e => { if (e) { return reject2(e); } return resolve2(void 0); });
            });
          },
          'on a > this': (cce: CCE, opName, self, a, b, c) => {
            const content = Buffer.isBuffer(a) ? a: typeof a === 'string' ? Buffer.from(a, self.encoding) : null;
            return promise(async (resolve2, reject2) => {
              fs.writeFile(self.file, content, { encoding }, e => { if (e) { return reject2(e); } return resolve2(void 0); });
            });
          },
          'on this < b': (cce: CCE, opName, self, a, b, c) => {
            const content = Buffer.isBuffer(b) ? b: typeof b === 'string' ? Buffer.from(b, self.encoding) : null;
            return promise(async (resolve2, reject2) => {
              fs.writeFile(self.file, content, { encoding }, e => { if (e) { return reject2(e); } return resolve2(void 0); });
            });
          },
        }, fileOp) as any as FileOperationReturn);
      } catch (e) { reject(e); }
    });
}
(fileModel as any).exists = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.exists', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.access(fileOp.file, fs.constants.F_OK, e => {
          return resolve(e ? false : true);
        })
      } catch (e) { reject(e); }
    });
}
(fileModel as any).read = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.read', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        if ((encoding as any) === 'buffer') {
          fs.readFile(fileOp.file, (e, data) => {
            if (e) { return reject(e); }
            return resolve(data);
          });
        } else {
          fs.readFile(fileOp.file, encoding, (e, data) => {
            if (e) { return reject(e); }
            return resolve(data);
          });
        }
      } catch (e) { reject(e); }
    });
}
(fileModel as any).readJSON = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.readJSON', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.readFile(fileOp.file, encoding, (e, data) => {
          if (e) { return reject(e); }
          try { return resolve(JSON.parse(data)); } catch (e2) { return reject(e2); }
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).readYAML = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.readYAML', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.readFile(fileOp.file, encoding, (e, data) => {
          if (e) { return reject(e); }
          try { return resolve(YAML.parse(data)); } catch (e2) { return reject(e2); }
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).write = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, content, error } = getWriteArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.write', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.writeFile(fileOp.file, content, { encoding }, e => {
          if (e) { return reject(e); }
          return resolve(void 0);
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).writeJSON = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, content, error } = getWriteArg(cce, args, 'json');
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.writeJSON', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.writeFile(fileOp.file, content, { encoding }, e => {
          if (e) { return reject(e); }
          return resolve(void 0);
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).writeYAML = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, content, error } = getWriteArg(cce, args, 'yaml');
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.writeYAML', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.writeFile(fileOp.file, content, { encoding }, e => {
          if (e) { return reject(e); }
          return resolve(void 0);
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).append = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, content, error } = getWriteArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.append', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.appendFile(fileOp.file, content, { encoding }, e => {
          if (e) { return reject(e); }
          return resolve(void 0);
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).prepend = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, content, error } = getWriteArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.prepend', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        await prependFile.default(fileOp.file, content);
      } catch (e) { reject(e); }
    });
}
(fileModel as any).truncate = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.prepend', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.truncate(fileOp.file, e => {
          if (e) { return reject(e); }
          return resolve(void 0);
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).delete = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.delete', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.unlink(fileOp.file, e => {
          if (e) { return reject(e); }
          return resolve(void 0);
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).unlink = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.unlink', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.unlink(fileOp.file, e => {
          if (e) { return reject(e); }
          return resolve(void 0);
        });
      } catch (e) { reject(e); }
    });
}
(fileModel as any).stat = (cce: CallContextEvent, ...args) => {
  const { fileOp, encoding, error } = getReadArg(cce, args);
  return getRuntime().scopedExec(
    cce, 'lugger:fs:file.stat', { data: { fileOp } },
    async (resolve, reject, scopeContext) => {
      if (error) { return reject(error); }
      try {
        fs.stat(fileOp.file, (e, data) => {
          if (e) { return reject(e); }
          return resolve(data);
        });
      } catch (e) { reject(e); }
    });
}

export const file__ = fileModel as any as (typeof file);

function getReadArg(cce: CCE, args: any[]) {
  let error: Error;
  const arg0 = args[0];
  let fileOp: FileOperationOptions = (arg0 as any);
  if (typeof arg0 === 'string') {
    fileOp = cce.fromTaggedTemplate ? { file: arg0 } as FileOperationOptions : { file: arg0 } as FileOperationOptions;
  }
  if (!fileOp.file) {
    error = new Error(`cannot operate on file without file location`);
  }
  let encoding = args[1] as BufferEncoding;
  if (!encoding) { encoding = 'utf8'; fileOp.encoding = encoding;  }
  return { fileOp, encoding, error };
}

function getWriteArg(cce: CCE, args: any[] , contentType: 'default' | 'json' | 'yaml' = 'default') {
  let error: Error;
  const arg0 = args[0];
  let arg1 = args[1];
  let fileOp: FileOperationOptions = (arg0 as any);
  if (typeof arg0 === 'string') {
    fileOp = cce.fromTaggedTemplate ? { file: arg0 } as FileOperationOptions : { file: arg0 } as FileOperationOptions;
  }
  let encoding = args[2] as BufferEncoding;
  if (!encoding) { encoding = 'utf8'; fileOp.encoding = encoding; }
  let content: Buffer = null;
  try {
    if (fileOp?.dedent && typeof arg1 === 'string') {
      arg1 = dedent(arg1);
    }
    if (contentType === 'default') {
      content = Buffer.isBuffer(arg1) ? arg1:
                  typeof arg1 === 'string' ? Buffer.from(arg1, encoding) :
                  null;
    } else if (contentType === 'json') {
      content = Buffer.from(JSON.stringify(arg1, null, 4), encoding);
    } else if (contentType === 'yaml') {
      content = Buffer.from(YAML.stringify(arg1), encoding);
    }
  } catch (e) {
    error = e;
  }
  if (!fileOp.file) {
    error = new Error(`cannot operate on file without file location`);
  }
  return { fileOp, encoding, content, error };
}

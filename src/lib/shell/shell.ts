/* Jovian (c) 2020, License: MIT */
import { dp, ok, promise, Result, ReturnCodeFamily } from '@jovian/type-tools';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { ShellCodes, ShellProcessOptions, ShellProcessReturn } from './shell.model';
import { CallContextEvent, dedent, getRuntime } from 'ritz2';
import { tempFileName } from '../fs/fs.util';
import * as YAML from 'yaml';

export function sh__(cce: CallContextEvent, ...args): any {
  const arg0 = args[0];
  const arg1 = args[1];
  let shArg: ShellProcessOptions = (arg0 as any);
  if (typeof arg0 === 'string') {
    if (cce.fromTaggedTemplate) {
      shArg = { script: args.map(a => dedent(a)).join('\n') };
    } else {
      shArg = { script: dedent(arg0) };
      if (typeof arg1 === 'string') {
        shArg.returnType = arg1 as any;
      }
    } 
  } else {
    if (typeof arg1 === 'string') {
      shArg.script = dedent(arg1);
    }
  }
  if (shArg.failFast === null || shArg.failFast === undefined) {
    shArg.failFast = true;
  }
  let shRet: ShellProcessReturn = { canceled: false, timeCalled: Date.now() };
  return getRuntime().scopedExec(
    cce, 'lugger:shell:sh', { data: { shellArg: shArg }},
    async (resolve, reject, scopeContext) => {
      try {
        const shFile = tempFileName('sh');
        const shSpecialReturnFile = shFile + '.ret';
        // const bailOutClause = `STATUS=$?\nif [ $STATUS -ne 0 ]; then\n  return $STATUS 2>/dev/null || exit $STATUS;\nfi`;
        const fullScript = `export RETURN='${shSpecialReturnFile}';\n${shArg.script}`;
        // console.log(fullScript);
        fs.writeFile(shFile, fullScript, e => {
          if (e) {
            const e2 = ShellCodes.error('SH_TEMP_FILE_WRITE_ERROR', e).error;
            console.error(e2)
            return reject(e2);
          }
          const flags = [];
          if (shArg.printSteps) { flags.push('x'); }
          if (shArg.failFast) { flags.push('e'); }
          let willReturnOutput = false; 
          switch (shArg.returnType) {
            case 'string': case 'buffer':  case 'base64': case 'hex': case 'utf8': case 'ucs2': case 'ascii':
              willReturnOutput = true;
            break;
          }
          let willOutputToReturnFile = false;
          switch (shArg.returnType) {
            case 'object-json': case 'object-yaml':
              willOutputToReturnFile = true;
            break;
          }
          shRet.timeStarted = Date.now();
          const proc = spawn('bash', flags.length === 0 ? [shFile] : [`-${flags.join('')}`, shFile]);
          const allBuffers: Buffer[] = [];
          let writeStream: fs.WriteStream;
          proc.stdout.on('data', (chunk: Buffer) => {
            if (shRet.timeEnded) { return; }
            if (shArg.onStdoutData) { shArg.onStdoutData(chunk); }
            allBuffers.push(chunk);
            if (writeStream && !writeStream.closed) { writeStream.write(chunk); }
            if (!shArg.quietConsole && (shArg.tee || !shArg.outputFile)) { process.stdout.write(chunk); }
          });
          proc.stderr.on('data', (chunk: Buffer) => {
            if (shRet.timeEnded) { return; }
            if (shArg.onStderrData) { shArg.onStderrData(chunk); }
            allBuffers.push(chunk);
            if (writeStream && !writeStream.closed) { writeStream.write(chunk); }
            if (!shArg.quietConsole && (shArg.tee || !shArg.outputFile)) { process.stderr.write(chunk); }
          });
          // if (shArg.tee || !shArg.outputFile) {
          //   proc.stdout.pipe(process.stdout);
          //   proc.stderr.pipe(process.stderr);
          // }
          const outputFile = shArg.outputFile ? shArg.outputFile : tempFileName('log');
          const mode = shArg.outputFileMode ? shArg.outputFileMode : 'a'; // default append
          writeStream = fs.createWriteStream(outputFile, { encoding: 'binary', flags: mode, emitClose: true });
          proc.on('close', async (code) => {
            shRet.timeEnded = Date.now();
            shRet.duration = shRet.timeEnded - shRet.timeStarted;
            fs.unlink(shFile, e => {});
            const returnFile = willOutputToReturnFile ? shSpecialReturnFile : outputFile;
            let outputBuffer: Buffer;
            let error: Error;
            for (let i = 0; i < 5; ++i) {
              try {
                outputBuffer = await readFileAwaitable(returnFile);
                error = null;
                break;
              } catch (e2) {
                await promise(async resolve => setTimeout(resolve, 5));
                error = e2;
              }
            }
            const totalBuffer = Buffer.concat(allBuffers);
            fs.unlink(shSpecialReturnFile, e => {});
            if (writeStream) { writeStream.close(); }
            if (error) {
              if (willOutputToReturnFile) {
                return reject(ShellCodes.error('SH_TEMP_OUTPUT_FILE_READ_ERROR', error).error);
              } else {
                return reject(ShellCodes.error('SH_TEMP_SPECIAL_OUTPUT_FILE_READ_ERROR', error).error);  
              }
            }
            if (shArg.returnExitCode) {
              return resolve(code);
            }
            if (willReturnOutput) {
              switch (shArg.returnType) {
                case 'string':
                  return resolve(totalBuffer.toString('utf8'));
                case 'utf8':
                    return resolve(totalBuffer.toString('utf8'));
                case 'ucs2':
                  return resolve(totalBuffer.toString('ucs2'));
                case 'hex':
                    return resolve(totalBuffer.toString('hex'));
                case 'base64':
                  return resolve(totalBuffer.toString('base64'));
                case 'ascii':
                  return resolve(totalBuffer.toString('ascii'));
                case 'buffer':
                  return resolve(totalBuffer);
              }
              return reject(ShellCodes.error('SH_RETURN_TYPE_ERROR_SERIALIZABLE_TYPE').error);
            }
            if (willOutputToReturnFile) {
              switch (shArg.returnType) {
                case 'object-json':
                  try {
                    return resolve(JSON.parse(outputBuffer.toString('utf8')));
                  } catch (e2) {
                    return reject(ShellCodes.error('SH_RETURN_PARSE_ERROR_BAD_JSON_FORMAT', e2).error);
                  }
                case 'object-yaml':
                  try {
                    return resolve(YAML.parse(outputBuffer.toString('utf8')));
                  } catch (e2) {
                    return reject(ShellCodes.error('SH_RETURN_PARSE_ERROR_BAD_YAML_FORMAT', e2).error);
                  }
              }
              return reject(ShellCodes.error('SH_RETURN_TYPE_ERROR_OBJECT_TYPE').error);
            }
            if (shArg.returnOutput) {
              return resolve(totalBuffer.toString('utf8'));
            }
            if (code === 0) {
              shRet.exitcode = code;
              shRet.outputBuffer = totalBuffer;
              shRet.outputText = totalBuffer.toString('utf8');
              shRet.callArgs = shArg;
              return resolve(shRet);
            }
            return reject(new Error(`sh returned non-zero exit code (${code}) while running:\n${shArg.script}`));
          });
          if (shArg.onProcess) {
            shArg.onProcess(proc, shArg);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
}

export function echo__(cce: CallContextEvent, ...args): any {
  if (typeof args[0] === 'string') {
    if (cce.fromTaggedTemplate) {
      for (const arg of args) {
        console.log(arg);
      }
    } else {
      console.log(args[0]);
    } 
  }
}

export namespace git__ {
  export function clone() {}
}

function readFileAwaitable(file: string) {
  return promise<Buffer>(async (resolve, reject) => {
    fs.readFile(file, (e, outputBuffer) => {
        if (e) { return reject(e); }
        return resolve(outputBuffer);
    });
  });
}

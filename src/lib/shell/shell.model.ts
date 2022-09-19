/* Jovian (c) 2020, License: MIT */
import { ReturnCodeFamily } from '@jovian/type-tools';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { PostfixWrappedReturn } from 'ritz2';

enum ShellCodesEnum {
  SH_TEMP_FILE_WRITE_ERROR,
  SH_TEMP_OUTPUT_FILE_READ_ERROR,
  SH_RETURN_TYPE_ERROR_SERIALIZABLE_TYPE,
  SH_TEMP_SPECIAL_OUTPUT_FILE_READ_ERROR,
  SH_RETURN_TYPE_ERROR_OBJECT_TYPE,
  SH_RETURN_PARSE_ERROR_BAD_JSON_FORMAT,
  SH_RETURN_PARSE_ERROR_BAD_YAML_FORMAT,
}
export const ShellCodes = ReturnCodeFamily('ShellCodes', ShellCodesEnum);

export type ShellReturnType = (
  'process' |
  'string' |
  'base64' |
  'hex' |
  'utf8' |
  'ucs2' |
  'ascii' |
  'buffer' |
  'exitcode' |
  'object-json' |
  'object-yaml'
);

export interface ShellProcessReturn {
  exitcode?: number;
  outputText?: string;
  outputBuffer?: Buffer;
  duration?: number;
  timeCalled?: number;
  timeStarted?: number;
  timeEnded?: number;
  canceled?: boolean;
  callArgs?: ShellProcessOptions;
}

type configBoolean = true | false | 1 | 0;
type configTrue = true | 1;
type configFalse = false | 0;

export interface ShellProcessOptions {
  script?: string;
  tee?: configBoolean;
  showCommands?: configBoolean;
  failFast?: configBoolean;
  printSteps?: configBoolean;
  quietConsole?: configBoolean;
  outputFile?: string;
  outputFileMode?: 'r' | 'r+' | 'w' | 'w+' | 'a' | 'a+'; // https://cplusplus.com/reference/cstdio/fopen/
  returnOutput?: configBoolean;
  returnExitCode?: configBoolean;
  returnType?: ShellReturnType;
  onStdoutData?: (data: Buffer) => any;
  onStderrData?: (data: Buffer) => any;
  onProcess?: (proc: ChildProcessWithoutNullStreams, shArg: ShellProcessOptions) => any;
  otherData?: any;
}

export interface ShellProcessOptionsGeneric extends ShellProcessOptions {
  returnType: 'process';
}

export interface ShellProcessOptionsReturnString extends ShellProcessOptions {
  returnType: 'string' | 'base64' | 'hex' | 'utf8' | 'ucs2' | 'ascii';
}

export interface ShellProcessOptionsReturnObject extends ShellProcessOptions {
  returnType: 'object-json' | 'object-yaml';
}

export interface ShellProcessOptionsReturnBuffer extends ShellProcessOptions {
  returnType: 'buffer';
}

export interface ShellProcessOptionsReturnOutput extends ShellProcessOptions {
  returnOutput: configTrue;
}

export interface ShellProcessOptionsReturnExitCode extends ShellProcessOptions {
  returnExitCode: configTrue;
}

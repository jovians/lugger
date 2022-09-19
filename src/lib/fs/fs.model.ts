export interface FileOperationOptions {
  file: string;
  fullpath?: string;
  pretty?: boolean;
  dedent?: boolean;
  encoding?: BufferEncoding;
}

export type FileOperationReturn = number & { isFileTarget: true } & FileOperationOptions;

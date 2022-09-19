/* Jovian (c) 2020, License: MIT */
import { PostfixReturn, ritzIfaceGuard, TaggedTemplateSelfChain } from 'ritz2';
import { FileOperationOptions, FileOperationReturn } from './fs.model';
import * as fs from 'fs';

class fileModel {
  static exists(file: FileOperationOptions): PostfixReturn<boolean>;
  static exists(file: string): PostfixReturn<boolean>;
  static exists(command) { ritzIfaceGuard('lugger:file:exists', __filename); return null; }

  static read(file: FileOperationOptions): PostfixReturn<string>;
  static read(file: FileOperationOptions, encoding: 'buffer'): PostfixReturn<Buffer>;
  static read(file: FileOperationOptions, encoding: BufferEncoding): PostfixReturn<string>;
  static read(file: string): PostfixReturn<string>;
  static read(file: string, encoding: 'buffer'): PostfixReturn<Buffer>;
  static read(file: string, encoding: BufferEncoding): PostfixReturn<string>;
  static read(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<string>>;
  static read(command) { ritzIfaceGuard('lugger:file:read', __filename); return null; }

  static readJSON<T extends Object = any>(file: string, encoding?: BufferEncoding): PostfixReturn<T>;
  static readJSON(command) { ritzIfaceGuard('lugger:file:readJSON', __filename); return null; }

  static readYAML<T extends Object = any>(file: string, encoding?: BufferEncoding): PostfixReturn<T>;
  static readYAML(command) { ritzIfaceGuard('lugger:file:readYAML', __filename); return null; }

  static writeJSON<T extends Object = any>(file: string, object: T, encoding?: BufferEncoding): PostfixReturn<void>;
  static writeJSON(command) { ritzIfaceGuard('lugger:file:writeJSON', __filename); return null; }

  static writeYAML<T extends Object = any>(file: string, object: T, encoding?: BufferEncoding): PostfixReturn<void>;
  static writeYAML(command) { ritzIfaceGuard('lugger:file:writeYAML', __filename); return null; }

  static write(file: FileOperationOptions, content: Buffer): PostfixReturn<void>;
  static write(file: FileOperationOptions, content: string, encoding?: BufferEncoding): PostfixReturn<void>;
  static write(file: string, content: Buffer): PostfixReturn<void>;
  static write(file: string, content: string, encoding?: BufferEncoding): PostfixReturn<void>;
  static write(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<void>>;
  static write(command) { ritzIfaceGuard('lugger:file:write', __filename); return null; }

  static append(file: FileOperationOptions, content: Buffer): PostfixReturn<void>;
  static append(file: FileOperationOptions, content: string, encoding?: BufferEncoding): PostfixReturn<void>;
  static append(file: string, content: Buffer): PostfixReturn<void>;
  static append(file: string, content: string, encoding?: BufferEncoding): PostfixReturn<void>;
  static append(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<void>>;
  static append(command) { ritzIfaceGuard('lugger:file:append', __filename); return null; }

  static prepend(file: FileOperationOptions, content: Buffer): PostfixReturn<void>;
  static prepend(file: FileOperationOptions, content: string, encoding?: BufferEncoding): PostfixReturn<void>;
  static prepend(file: string, content: Buffer): PostfixReturn<void>;
  static prepend(file: string, content: string, encoding?: BufferEncoding): PostfixReturn<void>;
  static prepend(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<void>>;
  static prepend(command) { ritzIfaceGuard('lugger:file:prepend', __filename); return null; }

  static truncate(file: FileOperationOptions): PostfixReturn<void>;
  static truncate(file: string): PostfixReturn<void>;
  static truncate(command) { ritzIfaceGuard('lugger:file:truncate', __filename); return null; }

  static delete(file: FileOperationOptions): PostfixReturn<void>;
  static delete(file: string): PostfixReturn<void>;
  static delete(command) { ritzIfaceGuard('lugger:file:delete', __filename); return null; }

  static unlink(file: FileOperationOptions): PostfixReturn<void>;
  static unlink(file: string): PostfixReturn<void>;
  static unlink(command) { ritzIfaceGuard('lugger:file:unlink', __filename); return null; }

  static stat(file: FileOperationOptions): PostfixReturn<fs.Stats>;
  static stat(file: string): PostfixReturn<fs.Stats>;
  static stat(command) { ritzIfaceGuard('lugger:file:stat', __filename); return null; }
}

export const file = fileModel as (typeof fileModel & ((filename: string) => FileOperationReturn));

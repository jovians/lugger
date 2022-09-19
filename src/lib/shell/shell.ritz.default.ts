/* Jovian (c) 2020, License: MIT */
import { Class, Result } from '@jovian/type-tools';
import { PostfixReturn, ritzIfaceGuard, TaggedTemplateSelfChain } from 'ritz2';
import { ShellProcessOptions, ShellProcessOptionsGeneric, ShellProcessOptionsReturnBuffer, ShellProcessOptionsReturnExitCode, ShellProcessOptionsReturnObject, ShellProcessOptionsReturnOutput, ShellProcessOptionsReturnString, ShellProcessReturn } from './shell.model';

export function sh(procArgs: ShellProcessOptionsGeneric, command?: string): PostfixReturn<ShellProcessReturn>;
export function sh(procArgs: ShellProcessOptionsReturnExitCode, command?: string): PostfixReturn<number>;
export function sh(procArgs: ShellProcessOptionsReturnString | ShellProcessOptionsReturnOutput, command?: string): PostfixReturn<string>;
export function sh(procArgs: ShellProcessOptionsReturnBuffer, command?: string): PostfixReturn<Buffer>;
export function sh<T extends Object = Object>(procArgs: ShellProcessOptionsReturnObject, command?: string): PostfixReturn<T>;
export function sh(command: string): PostfixReturn<ShellProcessReturn>;
export function sh(command: string, returnType: 'string' | 'base64' | 'utf8' | 'ucs2' | 'ascii'): PostfixReturn<string>;
export function sh(command: string, returnType: 'exitcode'): PostfixReturn<number>;
export function sh(command: string, returnType: 'buffer'): PostfixReturn<Buffer>;
export function sh<T extends Object = Object>(command: string, returnType: 'object-json' | 'object-yaml'): PostfixReturn<T>;
export function sh(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<ShellProcessReturn>>;
export function sh(command) { ritzIfaceGuard('sh', __filename); return null; }

export function echo(command: string): PostfixReturn<string>;
export function echo(strArr: TemplateStringsArray, ...args: any[]): TaggedTemplateSelfChain<PostfixReturn<string>>;
export function echo(command) { ritzIfaceGuard('echo', __filename); return null; }

export namespace git {
  function cloneModel() {

  }
  export const clone = cloneModel as (typeof cloneModel & Class<any>);
}

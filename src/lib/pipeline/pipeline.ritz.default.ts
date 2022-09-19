/* Jovian (c) 2020, License: MIT */
import { Class, Result } from '@jovian/type-tools';
import { ritzIfaceGuard } from 'ritz2';
import { ParallelOptions, StageOptions, StageReturn, StepReturn, Workflow } from './pipeline.model';

export function stage(stageName?: string, stageClosure?: () => any): StageReturn;
export function stage(stageOptions?: StageOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export function stage(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export function stage(...args): any { return ritzIfaceGuard('stage', __filename); }

export function step(stepName?: string): StepReturn { return ritzIfaceGuard('step', __filename); }

export function task(taskName?: string): StepReturn { return ritzIfaceGuard('task', __filename); }

export function sleep(seconds: number) { ritzIfaceGuard('sleep', __filename); return null;}
export function msleep(miliseconds: number) { ritzIfaceGuard('msleep', __filename); return null;}

function parallelModel(options: ParallelOptions | 'failFast');
function parallelModel(options: ParallelOptions | 'failFast', parallelClosure: () => any);
function parallelModel(options: ParallelOptions | 'failFast', closures: {[parallelTaskName: string]: () => any});
function parallelModel(closures: {[parallelTaskName: string]: () => any});
function parallelModel(parallelClosure: () => any);
function parallelModel(...args) {}
class ParallelModel { static failFast: typeof parallelModel = parallelModel; }
export const parallel = parallelModel as (typeof parallelModel & typeof ParallelModel);

export function runWorkflow<T extends Workflow<any, any> = any>(workflowClass: Class<T>):
ReturnType<T['finalReturn']> extends Promise<any> ? ReturnType<T['finalReturn']> : Promise<ReturnType<T['finalReturn']>> {
  return ritzIfaceGuard('runWorkflow', __filename);
}
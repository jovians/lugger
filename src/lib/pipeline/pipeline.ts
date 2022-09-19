// RITZ SKIP
import { Class, ClassLineage, ok, promise, PromUtil, Result, ReturnCodeFamily } from '@jovian/type-tools';
import { backfillArgs, CallContextEvent, CCE, decoratorHandler, errorCheck, getRuntime, InCollationArguments, InCollationHandler, InCollationReturn, notFromTransformedContext, punchGrab, __BlockContext, __BlockContextRoot, __RuntimeCollator, __RuntimeContext, __ScopeContext } from 'ritz2';
import { Workflow, StageReturn, FlowContext, StageOptions, ParallelExecError, StageInfo, ParallelOptions } from './pipeline.model';
import { v4 as uuidv4 } from 'uuid';
// import { __ritz_reflect } from '../../ritz.default';

enum PipelineCodesEnum {
  PARALLEL_EXEC_FAILURE,
}
export const PipelineCodes = ReturnCodeFamily('PipelineCodes', PipelineCodesEnum);

function getAnonContextname(cce: CCE, name: string) {
  return `(anonymous_${name}_${cce.blockContext.sourceFile.file.ts.split('/').pop()}:${cce.blockContext.lastRunSource})`;
}

export class StageReflect__ {
  stage(...args): any {}

  // @__ritz_reflect
  stage_0(stageName?: string, stageClosure?: (scopeContext: __ScopeContext) => any): StageReturn { return null; };
  stage_2(stageOptions?: StageOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void { return null; }
  stage_3(...args: any[]): any { return null; }
}

export namespace run__ {
  export let parallel = null;
}

let _stage_reflect: StageReflect__;
export const stage__: typeof _stage_reflect.stage = (...args): any => {
  // Decorator handler
  if (notFromTransformedContext(args)) {
    if (!args[0]) {
      // called decorator with 0 arg
      return decoratorHandler({
        member: (target, memberName) => {
          addFlowContext(target, 'stage', memberName);
        }
      });
    } else if (typeof args[0] === 'object' && !Array.isArray(args[0]) && !args[1]) {
      // called decorator with first arg (StageOptions)
      const stageOptions = args[0];
      return decoratorHandler({
        member: (target, memberName) => {
          addFlowContext(target, 'stage', memberName, stageOptions);
          const anyFcb = getRuntime().functionContextCallbacks.any;
          const funcPath = `${target.constructor.name}.${memberName as string}`;
          if (!anyFcb[funcPath]) { anyFcb[funcPath] = []; }
          anyFcb[funcPath].push(fnCtx => {
            if (stageOptions) {
              if (stageOptions.name) { stageOptions.stageName = stageOptions.name; }
              Object.assign(fnCtx.scopeContext.data, stageOptions);
            }
          });
        }
      });
    }
    // uncalled decorator
    return decoratorHandler(args, {
      member: (target, memberName) => {
        addFlowContext(target, 'stage', memberName);
      }
    });
  }
  // Stage function
  // console.log('stage called', args[1]);
  const cce = args[0] as CallContextEvent;
  const a = backfillArgs(args.slice(1), 'stageOptions', 'stageClosure');
  if (typeof a.stageOptions === 'string') {
    a.stageOptions = {
      name: a.stageOptions
    } as StageOptions;
  }
  // console.log(a);
  return getRuntime().scopedExec<Result<StageReturn>>(
    cce, 'lugger:pipeline:stage', {},
    async (resolve, reject, scopeContext) => {
      const parentScope = scopeContext.parent;
      let opts: StageOptions = parentScope?.data.stageOptions ? parentScope?.data.stageOptions : a.stageOptions;
      if (!opts) { opts = {}; }
      if (!opts.name) { opts.name = getAnonContextname(cce, 'stage'); }
      scopeContext.data.stageName = opts.name;
      try {
        if (opts.when) {
          await punchGrab(opts.when(parentScope.data.workflowInst))
        }
        let res: any;
        if (a.stageClosure) {
          res = await errorCheck(a.stageClosure(scopeContext));
        }
        if (!res) { res = {}; }
        resolve(ok(res));
      } catch (e) {
        reject(e);
      }
    });
};
(stage__ as any).inCollationHandler = ((ica: InCollationArguments): InCollationReturn => {
  const a = backfillArgs(ica.args.slice(1), 'stageOptions', 'stageClosure');
  if (typeof a.stageOptions === 'string') { a.stageOptions = { name: a.stageOptions } as StageOptions; }
  const stageName = a.stageOptions?.name ? a.stageOptions?.name : getAnonContextname(ica.cce, 'stage');
  return { collationName: stageName };
}) as InCollationHandler;


export function step__(cce: CallContextEvent, ...stepArgs): any {
  const a = backfillArgs(stepArgs, 'stepName', 'stepClosure');
  if (!a.stepName) { a.stepName = getAnonContextname(cce, 'step'); }
  return getRuntime().scopedExec(
    cce, 'lugger:pipeline:step', { data: { stepName: a.stepName }, requireParent: ['lugger:pipeline:stage', 'lugger:pipeline:parallel'] },
    async (resolve, reject, scopeContext) => {
      try {
        let res: StageReturn;
        if (a.stepClosure) {
          res = await errorCheck(a.stepClosure(scopeContext));
        }
        if (!res) { res = {}; }
        resolve(ok(res));
      } catch (e) {
        reject(e);
      }
    });
}
(step__ as any).inCollationHandler = ((ica: InCollationArguments): InCollationReturn => {
  const a = backfillArgs(ica.args.slice(1), 'stepName', 'stepClosure');
  if (!a.stepName) { a.stepName = getAnonContextname(ica.cce, 'step'); }
  return { collationName: a.stepName };
}) as InCollationHandler;

export function task__(cce: CallContextEvent, ...taskArgs): any {
  const a = backfillArgs(taskArgs, 'taskName', 'taskClosure');
  if (!a.taskName) { a.taskName = getAnonContextname(cce, 'task'); }
  return getRuntime().scopedExec(
    cce, 'lugger:pipeline:task', { data: { taskName: a.taskName }, requireParent: ['lugger:pipeline:stage', 'lugger:pipeline:parallel'] },
    async (resolve, reject, scopeContext) => {
      try {
        let res: StageReturn;
        if (a.taskClosure) {
          res = await a.taskClosure(scopeContext);
        }
        if (!res) { res = {}; }
        resolve(ok(res));
      } catch (e) {
        reject(e);
      }
    });
}
(task__ as any).inCollationHandler = ((ica: InCollationArguments): InCollationReturn => {
  const a = backfillArgs(ica.args.slice(1), 'taskName', 'taskClosure');
  if (!a.taskName) { a.taskName = getAnonContextname(ica.cce, 'step'); }
  return { collationName: a.taskName };
}) as InCollationHandler;

let failFastContext = false;
function parallelModel(cce: CallContextEvent, ...args) {
  const collator = new __RuntimeCollator();
  const a = backfillArgs(args, 'parallelOptions', 'collationClosure');
  let closureIsCollation = false;
  if (a.collationClosure && typeof a.collationClosure !== 'function') { closureIsCollation = true; }
  let options: ParallelOptions = a.parallelOptions ? a.parallelOptions : { failFast: false };
  if (typeof options === 'string') {
    const optionStr: string = options;
    options = { failFast: false };
    if (optionStr === 'failFast') { options.failFast = true; }
  }
  if (options.failFast === null || options.failFast === undefined) { options.failFast = false; }
  if (failFastContext) { options.failFast = true; failFastContext = false; }
  return getRuntime().scopedExec(
    cce, 'lugger:pipeline:parallel', { data: { collator } },
    async (resolve, reject, scopeContext) => {
      try {
        let immediateBlock: __BlockContext;
        scopeContext.onImmediateBlockContextAssign.push((scopeCtx, blockCtx) => {
          immediateBlock = blockCtx;
          blockCtx.collator = collator;
        });
        if (closureIsCollation) {
          collator.collation = a.collationClosure;
        } else {
          if (a.collationClosure) {
            await errorCheck(a.collationClosure(scopeContext));
          }
        }
        const proms = [];
        const collationKeys = Object.keys(collator.collation);
        for (const key of collationKeys) {
          proms.push(promise(async (resolve, reject) => {
            try {
              return resolve(await errorCheck(collator.collation[key](scopeContext)));
            } catch (e) {
              if (options.failFast) {
                getRuntime().setScopeError(scopeContext, null, e);
              }
              return reject(e);
            }
          }));
        }
        let res = proms.length ? await PromUtil.allSettled(proms) : [];
        const threadErrors: { key: string, error: Error }[] = [];
        let i = 0;
        const failedCollationKeys: string[] = [];
        res.forEach(a => {
          if (a instanceof Error) {
            const collationKey = collationKeys[i];
            threadErrors.push({ key: collationKey, error: a });
            failedCollationKeys.push(collationKey);
          }
          ++i;
        });
        if (threadErrors.length > 0) {
          const e = new ParallelExecError(`Parallel exec failed at threads: [${failedCollationKeys.join(', ')}]`);
          console.log(threadErrors);
          e.threadErrors = threadErrors;
          return reject(PipelineCodes.error('PARALLEL_EXEC_FAILURE', e).error);
        }
        return resolve(true);
        // if (!res) { res = {}; }
        // resolve(ok(res));
      } catch (e) {
        reject(e);
      }
    });
}
class ParallelModel {
  static failFast(cce: CallContextEvent, ...args) { return parallelModel(cce, ...args); }
}
(parallelModel as any).failFast = ParallelModel.failFast;
export const parallel__ = parallelModel as (typeof parallelModel & typeof ParallelModel);

export function sleep__(ctx: __RuntimeContext, seconds: number) {
  return new Promise<Result<any>>(resolve => {
    setTimeout(() => { resolve(ok(true)) }, seconds * 1000);
  }); 
}
export function msleep__(ctx: __RuntimeContext, miliSeconds: number) {
  return new Promise<Result<any>>(resolve => {
    setTimeout(() => { resolve(ok(true)) }, miliSeconds);
  }); 
}

function addFlowContext(target: Class<any>, type: string, property: string | symbol, stageOptions?: StageOptions) {
  console.log(`adding ${property as string}`, stageOptions)
  if (target.constructor) { target = target.constructor as any; }
  if (!(target as any).flowContexts) { (target as any).flowContexts = []; }
  (target as any).flowContexts.push({ type, target, property, stageOptions } as FlowContext);
}


export function runWorkflow__<T extends Workflow<any, any> = any>(cce: CallContextEvent, workflowClass: Class<T>):
ReturnType<T['finalReturn']> extends Promise<any> ? ReturnType<T['finalReturn']> : Promise<ReturnType<T['finalReturn']>> {
  return promise(async (resolve, reject) => {
    const flowContexts = (workflowClass as any).flowContexts as FlowContext[];
    const workflowId = uuidv4();
    const wfInst = new workflowClass();
    (wfInst as any).__workflowId = workflowId;
    (wfInst as any).__ctx = cce.scopeContext;
    const e: StageInfo = {
      workflow: wfInst,
      workflowId,
      workflowName: workflowClass.name,
      stageName: '',
      stageType: '',
      result: null,
      error: null,
      rethrow: true,
      startTime: Date.now(),
      duration: null,
      endTime: null,
      metadata: {},
    };
    let error: Error;
    try { if (wfInst['setup']) { await errorCheck((wfInst['setup'] as any)(cce.scopeContext)); } } catch (e) { error = e; }
    for (const section of flowContexts) {
      if (error) { break; }
      try {
        await errorCheck(wfInst[section.property](cce.scopeContext));
      } catch (e) {
        error = e;
        break;
      }
    }
    let postErrors: Error[] = [];
    if (!error) {
      try { if (wfInst['success']) { await errorCheck((wfInst['success'] as any)(cce.scopeContext)); } } catch (e) { postErrors.push(e); }
    } else {
      try { if (wfInst['failure']) { await errorCheck((wfInst['failure'] as any)(cce.scopeContext)); } } catch (e) { postErrors.push(e); }
    }
    try { if (wfInst['cleanup']) { await errorCheck((wfInst['cleanup'] as any)(cce.scopeContext)); } } catch (e) { postErrors.push(e); }
    if (error) { return reject(error); }
    let pipelineReturn: ReturnType<typeof wfInst.finalReturn>;
    if (wfInst.finalReturn) {
      pipelineReturn = await punchGrab((wfInst.finalReturn as any)());
    }
    resolve(pipelineReturn as any);
  }) as any;
}

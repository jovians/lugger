import { dp, _ } from '@jovian/type-tools';
import { sh as shh, sh } from '../../src/lib/shell/shell.ritz.default';
import { parallel, sleep, stage, step, task } from '../../src/lib/pipeline/pipeline.ritz.default';
import { DefaultWorkflowStateType, Workflow } from '../../src/lib/pipeline/pipeline.model';
import { flow, should, testDefine } from 'ritz2';
import { context, msleep, ritz } from 'ritz2/ritz.default';


class TestWorkflow {
    @stage
    memberMethod1() {
        check: __context.scope === 'lugger:pipeline:stage'
        check: __context.data.stageName === 'memberMethod1'
    }
    
    @stage({ name: 'test', when: () => {} })
    memberMethod2() {
        check: __context.scope === 'lugger:pipeline:stage'
        check: __context.data.stageName === 'test'
    }
}
const testWorkflowInst = new TestWorkflow;

testDefine(`transformed class with stage decorator method should have stage as context`); {
    testWorkflowInst.memberMethod1();
    testWorkflowInst.memberMethod2();
}

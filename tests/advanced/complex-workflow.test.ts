import { dp, _ } from '@jovian/type-tools';
import { echo, sh } from '../../src/lib/shell/shell.ritz.default';
import { parallel, runWorkflow, sleep, stage, step } from '../../src/lib/pipeline/pipeline.ritz.default';
import { attr, $, should, testDefine, testFileOptions } from 'ritz2';
import { ritz, msleep } from 'ritz2/ritz.default';
import { Workflow } from '../../src/lib/pipeline/pipeline.model';

// testFileOptions({ runAlone: true });

testDefine(`basic pipeline workflow should run in order`); {
    let testWorkflowTicker = 0;
    let testWorkflowOrder = [];
    should.throw; {
        class TestWorkflow extends Workflow {

            setup() {
                ++testWorkflowTicker;
                sh `echo 'workflow-setup'`;
                testWorkflowOrder.push('setup');
            }

            @stage
            firstStage() {
                ++testWorkflowTicker;
                sh `echo 'workflow-test'`;
                testWorkflowOrder.push('stage1');
            }
        
            @stage
            secondStage() {
                ++testWorkflowTicker;
                sh `
                    echo 'workflow-second-start'
                    pwd
                    echo 'workflow-second-end'
                    ls -z   # should fail here
                `;
                sh `
                    echo 'should not be reached'
                `;
                echo `this shouldn't be echoed`;
            }
        
            post() {
                ++testWorkflowTicker;
                sh `echo 'workflow-post'`;
                testWorkflowOrder.push('post');
            }
        
            success() {
                ++testWorkflowTicker;
                sh `echo 'workflow-success'`;
                testWorkflowOrder.push('success');
            }
        
            failure() {
                ++testWorkflowTicker;
                sh `echo 'workflow-failure'`;
                testWorkflowOrder.push('failure');
            }
        
            cleanup() {
                ++testWorkflowTicker;
                testWorkflowOrder.push('cleanup');
            }
        
        }
        runWorkflow(TestWorkflow);
    }
    check: testWorkflowTicker === 5;
    check: testWorkflowOrder.equivalentTo(['setup', 'stage1', 'failure', 'cleanup']);
}

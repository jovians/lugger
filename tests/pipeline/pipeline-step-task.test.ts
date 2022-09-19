import { dp, _ } from '@jovian/type-tools';
import { sh as shh, sh } from '../../src/lib/shell/shell.ritz.default';
import { parallel, sleep, stage, step, task } from '../../src/lib/pipeline/pipeline.ritz.default';
import { DefaultWorkflowStateType, Workflow } from '../../src/lib/pipeline/pipeline.model';
import { flow, should, testDefine } from 'ritz2';
import { context, msleep, ritz } from 'ritz2/ritz.default';

testDefine(`task should throw if not called within stage`); {
    let i = 0;
    should.throw; {
        task; {
            ++i;
        }
    }
    check: i === 0;
}

testDefine(`task should work called within stage`); {
    should.reach.collectAll; {
        stage; {
            should.reach.first;
            task; {
                should.reach.second;
            }
            task; () => {
                should.reach.third;
            }
            task('taskName'); {
                should.reach.fourth;
            }
            task('taskName'); () => {
                should.reach.fifth;
            }
            should.reach.sixth;
        }
    }
}

testDefine({ runAlone: true, try: 3 }, `task should work called within parallel`); {
    should.reach.collectAll; {
        parallel; {
            should.reach.first;
            task; {
                msleep(10);
            }
            task; () => {
                msleep(10);
            }
            task('taskName'); {
                msleep(10);
            }
            task('taskName'); () => {
                msleep(10);
            }
            should.reach.second;
        }
    }
    check: __context.elapsed >= 10;
    check: __context.elapsed <= 20;
}

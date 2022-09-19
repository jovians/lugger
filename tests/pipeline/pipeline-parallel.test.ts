import { dp, _ } from '@jovian/type-tools';
import { sh as shh, sh } from '../../src/lib/shell/shell.ritz.default';
import { parallel, sleep, stage, step, task } from '../../src/lib/pipeline/pipeline.ritz.default';
import { flow, should, testDefine, testFileOptions } from 'ritz2';
import { context, msleep, ritz } from 'ritz2/ritz.default';

testDefine({ runAlone: true, try: 3 }, `transformed class with parallel stage should be able to run with inline block`); {
    let i = 0;
    class TestParallelClass {
        @stage
        memberMethod1() {
            parallel; {
                `task1`; { i += 2; msleep(10); }
                `task2`; { i += 2; msleep(10); }
                `task3`; { i += 2; msleep(10); }
                check: Object.keys(__block.collator.collation).length === 3;
            }
            check: i === 6;
            parallel({ failFast: true }); {
                `task1`; { i += 2; msleep(10); }
                `task2`; { i += 2; msleep(10); }
                `task3`; { i += 2; msleep(10); }
                check: Object.keys(__block.collator.collation).length === 3;
            }
            check: i === 12;
            parallel('failFast'); {
                `task1`; { i += 2; msleep(10); }
                `task2`; { i += 2; msleep(10); }
                `task3`; { i += 2; msleep(10); }
                check: Object.keys(__block.collator.collation).length === 3;
            }
            check: i === 18;
        }
    }
    new TestParallelClass().memberMethod1();
    check: __block.elapsed <= 45;
    check: __block.elapsed >= 30;
    check: i === 18;
}

testDefine({ runAlone: true, try: 3 }, `transformed class with parallel stage should be able to run with arrow function`); {
    let i = 0;
    class TestParallelClass {
        @stage
        memberMethod1() {
            parallel; {
                `task1`; () => { i += 2; msleep(10); }
                `task2`; () => { i += 2; msleep(10); }
                `task3`; () => { i += 2; msleep(10); }
                check: Object.keys(__block.collator.collation).length === 3;
            }
            check: i === 6;
            parallel({ failFast: true }); {
                `task1`; () => { i += 2; msleep(10); }
                `task2`; () => { i += 2; msleep(10); }
                `task3`; () => { i += 2; msleep(10); }
                check: Object.keys(__block.collator.collation).length === 3;
            }
            check: i === 12;
            parallel('failFast'); {
                `task1`; () => { i += 2; msleep(10); }
                `task2`; () => { i += 2; msleep(10); }
                `task3`; () => { i += 2; msleep(10); }
                check: Object.keys(__block.collator.collation).length === 3;
            }
            check: i === 18;
        }
    }
    new TestParallelClass().memberMethod1();
    check: __block.elapsed <= 45;
    check: __block.elapsed >= 30;
    check: i === 18;
}

testDefine({ runAlone: true, try: 3 }, `transformed class with parallel stage with direct closures map should work correctly`); {
    let i = 0;
    class TestParallelClass {
        @stage
        memberMethod1() {
            parallel({
                task1: () => { i += 2; msleep(10); },
                task2: () => { i += 2; msleep(10); },
                task3: () => { i += 2; msleep(10); },
            });
            check: i === 6;
            parallel({ failFast: true }, {
                task1: () => { i += 2; msleep(10); },
                task2: () => { i += 2; msleep(10); },
                task3: () => { i += 2; msleep(10); },
            });
            check: i === 12;
            parallel('failFast', {
                task1: () => { i += 2; msleep(10); },
                task2: () => { i += 2; msleep(10); },
                task3: () => { i += 2; msleep(10); },
            });
            check: i === 18;
        }
    }
    new TestParallelClass().memberMethod1();
    check: __block.elapsed <= 45;
    check: __block.elapsed >= 30;
    check: i === 18;
}


testDefine({ runAlone: true, try: 3 }, `transformed class with parallel.failFast should work correctly`); {
    let i = 0;
    class TestParallelClass {
        @stage
        memberMethod1() {
            parallel.failFast; {
                `task1`; { i += 2; msleep(10); }
                `task2`; { i += 2; msleep(10); }
                `task3`; { i += 2; msleep(10); }
            }
            check: i === 6;
            parallel.failFast({ failFast: true }); {
                `task1`; () => { i += 2; msleep(10); }
                `task2`; () => { i += 2; msleep(10); }
                `task3`; () => { i += 2; msleep(10); }
            }
            check: i === 12;
            parallel.failFast('failFast', {
                task1: () => { i += 2; msleep(10); },
                task2: () => { i += 2; msleep(10); },
                task3: () => { i += 2; msleep(10); },
            });
            check: i === 18;
        }
    }
    new TestParallelClass().memberMethod1();
    check: __block.elapsed <= 45;
    check: __block.elapsed >= 30;
    check: i === 18;
}

testDefine({ runAlone: true, try: 3 }, `parallels should interact with stage.inCollationHandler`); {
    parallel.failFast; {
        stage(`task1`); {
            parallel; {
                `task1_1`; { msleep(10); }
                `task1_2`; { msleep(10); }
                `task1_3`; { msleep(10); }
            }
        }
        stage(`task2`); {
            parallel; {
                `task2_1`; { msleep(10); }
                `task2_2`; { msleep(10); }
                `task2_3`; { msleep(10); }
            }
        }
    }
    check: __block.elapsed <= 25;
    check: __block.elapsed >= 10;
}

testDefine({ runAlone: true, try: 3 }, `nested parallels should work correctly`); {
    parallel.failFast; {
        `task1`; {
            parallel; {
                `task1_1`; { msleep(10); }
                `task1_2`; { msleep(10); }
                `task1_3`; { msleep(10); }
            }
        }
        `task2`; {
            parallel; {
                `task2_1`; { msleep(10); }
                `task2_2`; { msleep(10); }
                `task2_3`; { msleep(10); }
            }
        }
    }
    check: __block.elapsed <= 25;
    check: __block.elapsed >= 10;
}

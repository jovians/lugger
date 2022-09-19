import { echo, git, sh } from '../../src/lib/shell/shell.ritz.default';
import { testDefine } from 'ritz2';
import { v4 as uuidv4 } from 'uuid';
import { msleep, sleep } from 'ritz2/ritz.default';

testDefine(`sh should handle postfix methods`); {
    sh(`echo "posfix test 1"`, 'utf8').try(1).timeout(30, 'm');
    let output2;
    output2 = sh(`echo "posfix test 2"`, 'utf8').try(1).timeout(30, 'm');
    const output3 = sh(`echo "posfix test 3"`, 'utf8').try(1).timeout(30, 'm');
    const output4 = output2 = sh('echo "posfix test 4"', 'utf8').try(1).timeout(30, 'm');
    check: output3 === 'posfix test 3\n';
    check: output4 === 'posfix test 4\n';
    check: output2 === 'posfix test 4\n';
}

testDefine(`sh overloads should honor returnOutput argument`); {
    const output = sh({ returnOutput: 1 }, `echo "returnOutput 1"`);
    check: output === 'returnOutput 1\n';
    const output2 = sh({ returnOutput: true }, `echo "returnOutput 2"`);
    check: output2 === 'returnOutput 2\n';
}

testDefine(`sh overloads should honor returnExitCode argument`); {
    const output = sh({ returnExitCode: 1 }, `echo "returnExitCode 1"`);
    check: output === 0;
    const output2 = sh({ returnExitCode: true }, `echo "returnExitCode 2"`);
    check: output2 === 0;
}

testDefine(`sh overloads should honor returnType argument of buffer`); {
    const input = 'returnType buffer type'
    const inputNewLineBuffer = Buffer.from(`${input}\n`);
    const output = sh({ returnType: 'buffer' }, `echo "${input}"`);
    check: output === inputNewLineBuffer;
}

testDefine(`sh overloads should honor returnType argument of string types`); {
    const input = 'returnType string types'
    const inputNewLine = `${input}\n`;
    let output = sh({ returnType: 'string' }, `echo "${input}"`);
    check: output === inputNewLine;
    output = sh({ returnType: 'base64' }, `echo "${input}"`);
    check: output === inputNewLine.toBase64();
    output = sh({ returnType: 'hex' }, `echo "${input}"`);
    check: output === inputNewLine.toHex();
    output = sh({ returnType: 'ascii' }, `echo "${input}"`);
    check: output === inputNewLine;
    output = sh({ returnType: 'utf8' }, `echo "${input}"`);
    check: output === inputNewLine;
    output = sh({ returnType: 'ucs2' }, `echo "${input}"`);
    check: output !== inputNewLine; // usc2 is 2-byte and must be different
}

testDefine(`sh overloads should honor returnType argument of object types`); {
    const inputJSON = '{"test": "test"}'
    const outputJSON = sh({ returnType: 'object-json' }, `echo '${inputJSON}' > $RETURN`);
    check: outputJSON.equivalentTo({"test": "test"});
    const inputYAML = `
                        # Test YAML
                        someKey: "1.0"
                        nestedArray:
                            - test1
                            - test2
                        `.dedent().replace('\n', '\\n');
    const outputYAML = sh({ returnType: 'object-yaml' }, `echo '${inputYAML}' > $RETURN`);
    check: outputYAML.equivalentTo({ someKey: '1.0', nestedArray: [ 'test1', 'test2' ] });
}

testDefine(`sh overloads with tagged template should work correctly`); {
    const res = sh `echo 'test'`;
    check: res.outputText === 'test\n';
    const res2 = sh
                    `echo 'test';`
                    `echo 'test2';`;
    check: res2.outputText === 'test\ntest2\n';
}

testDefine({ runAloneWithinFile: true }, `sh with hanging sleep 0.1 should wait`); {
    sh `sleep 0.1`;
    check: __context.elapsed > 100;
}

testDefine(`echo should output to console`); {
    const text = 'echo_test_' + uuidv4();
    echo `${text}`;
    git.clone();
}


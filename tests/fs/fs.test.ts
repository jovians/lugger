import { echo, git, sh } from '../../src/lib/shell/shell.ritz.default';
import { should, testDefine } from 'ritz2';
import { v4 as uuidv4 } from 'uuid';
import { msleep, sleep } from 'ritz2/ritz.default';
import { file } from '../../src/lib/fs/fs.ritz.default';
import { tempFileName } from '../../src/lib/fs/fs.util';
import testfileJSONContent from '../resources/testjson.json';
import { testResources } from '../test.const';

testDefine(`file.read be able to read file`); {
    const content = file.read(`${testResources}/testfile.txt`);
    check: content === 'testfile-content';
}

testDefine(`file.read with buffer be able to read file to buffer`); {
    const comparisonBuffer = Buffer.from('testfile-content');
    const content = file.read(`${testResources}/testfile.txt`, 'buffer');
    check: content === comparisonBuffer;
}

testDefine(`file.read with tagged template should work correctly`); {
    const content = file.read `${testResources}/testfile.txt`;
    check: content === 'testfile-content';
}

testDefine(`file.read should throw when invalid filename args`); {
    should.throw; { file.read ``; }
    should.throw; { file.read({ file: '' }); }
    should.throw; { file.read({ } as any); }
}

testDefine(`file.write should create file if it does not exist`); {
    const filename = tempFileName();
    file.write(filename, 'test-content');
    check: file.exists(filename);
    check: file.read(filename) === 'test-content';
}

testDefine(`file.append should create file if it does not exist`); {
    const filename = tempFileName();
    file.append(filename, 'test-content');
    check: file.exists(filename);
    check: file.read(filename) === 'test-content';
}

testDefine(`file.truncate should truncate file`); {
    const filename = tempFileName();
    file.write(filename, 'test-content');
    check: file.exists(filename);
    check: file.read(filename) === 'test-content';
    file.truncate(filename);
    check: file.exists(filename);
    check: file.read(filename) === '';
}

testDefine(`file.delete should delete file`); {
    const filename = tempFileName();
    file.write(filename, 'test-content');
    check: file.exists(filename);
    check: file.read(filename) === 'test-content';
    file.delete(filename);
    check: file.exists(filename) === false;
}

testDefine(`file.unlink should delete file`); {
    const filename = tempFileName();
    file.write(filename, 'test-content');
    check: file.exists(filename);
    check: file.read(filename) === 'test-content';
    file.unlink(filename);
    check: file.exists(filename) === false;
}

testDefine(`file.readJSON should load JSON file`); {
    const jsonObject = file.readJSON(`${testResources}/testjson.json`);
    check: jsonObject.equivalentTo(testfileJSONContent);
}

testDefine(`file.readYAML should load YAML file`); {
    const yamlObject = file.readYAML(`${testResources}/testyaml.yaml`);
    check: yamlObject.equivalentTo({ someKey: '1.0', nestedArray: [ 'test1', 'test2' ] });
}

testDefine(`file.write should write JSON file`); {
    const jsonObject = file.writeJSON(`${testResources}/testjson2.json`, { test: 12345 });
    // check: jsonObject.equivalentTo(testfileJSONContent);
}

// testDefine(`stream operators (>, <, <<, >>) should function correctly`); {
//     const filename1 = tempFileName(); // >
//     const filename2 = tempFileName(); // >>
//     const filename3 = tempFileName(); // <
//     const filename4 = tempFileName(); // <<
//     const content = 'bash-like-stream-test';
//     content.$ > file(filename1);
//     check: file.exists(filename1);
//     check: file.read(filename1) === content;
//     content.$ >> file(filename2);
//     check: file.exists(filename2);
//     check: file.read(filename2) === content;
//     file(filename3) < content.$;
//     check: file.exists(filename3);
//     check: file.read(filename3) === content;
//     file(filename4) << content.$;
//     check: file.exists(filename4);
//     check: file.read(filename4) === content;
// }


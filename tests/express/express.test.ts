import { flow, should, testDefine } from 'ritz2';
import { http } from '../../src/lib/http/http.ritz.default';
import { HttpError } from '../../src/lib/http/http.model';

testDefine({ runAlone: true }, `express server should be able to accept flow finalizer`); {
    const server = http.server(3001).start();
    server.get('/test', async (req, res) => {
        flow.finally(http.finalizer.express(req, res));
        return 'test';
    });
    const res = http.get<string>('http://localhost:3001/test').data;
    check: res === 'test';
    server.stop();
}

testDefine({ runAlone: true }, `express server should 404 when path is not found`); {
    const server = http.server(3001).start();
    should.throw; {
        http.get<string>('http://localhost:3001/test');
    }
    const lastError = __block.lastError as HttpError;
    check: lastError.code === 404;
    server.stop();
}

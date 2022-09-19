import { AsyncWorkerClient, AsyncWorkerExecutor, AsyncWorkerConfig } from '@jovian/type-tools/nodejs';
import { envVarsBytype } from '../src/lib/util/env.util';

export class TestWorkerClient extends AsyncWorkerClient {
  constructor(workerData?: {[key: string]: any}, workerConfig?: AsyncWorkerConfig) {
    super(workerData, Object.assign(workerConfig || {}, { workerFile: __filename }));
  }
  testFunction(msgBase64: string) { return this.call<string>(`testFunction`, msgBase64, r => r); }
  testSh(msgBase64: string) { return this.call<string>(`testSh`, msgBase64, r => r); }
}

export class TestWorkerLogic extends AsyncWorkerExecutor {
  constructor(workerData: any) {
    super(workerData);
    this.setAsReady();
  }
  async handleAction(callId: string, action: string, payload?: string) {
    switch (action) {
      case 'testFunction': {
        return this.returnCall(callId, 'Hello World! :: ' + payload);
      }
    }
  }
}

if (process.env.WORKER_DATA_BASE64) {
  const workerData = JSON.parse(Buffer.from(process.env.WORKER_DATA_BASE64, 'base64').toString('utf8'));
  if (workerData.workerFile === __filename) {
    new TestWorkerLogic(workerData).getSelf();
  }
}

import { ReturnCodeFamily } from '@jovian/type-tools';
import { Request, Response } from 'express';
import { FlowBlockFinalizer } from 'ritz2';
import { AxiosError, AxiosResponse } from "axios";

const serializationError = JSON.stringify({
  status: 'error', code: 500, message: 'Server was unable to serialize the 200 response',
});

export interface HttpError extends Error {
  code?: number;
  codeName?: string;
  getResponse?: () => AxiosResponse;
  getOriginalError?: () => AxiosError;
}

export function HttpFinalizerExpress(req: Request, res: Response): FlowBlockFinalizer {
  return {
    onThrow: async (e) => {
      if (res.writableEnded) { return; }
      const code = (e as any).code ? (e as any).code : 500;
      res.status(code).end(JSON.stringify({
        status: 'error', code, message: e.message,
      }));
    },
    onReturn: async (r) => {
      if (res.writableEnded) { return; }
      if (typeof r === 'string') {
        res.status(200).end(r);
      } else {
        try {
          r = JSON.stringify(r);
          res.status(200).end(r);
        } catch (e) {
          res.status(500).end(serializationError);
        }
      }
    },
  };
}

// RITZ SKIP
import { CallContextEvent, CCE, dedent, getRuntime } from "ritz2";
import { http } from './http.ritz.default';
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Express from 'express';
import { Request, Response } from 'express';
import { Server } from "http";
import { promise, _ } from "@jovian/type-tools";
import { HttpError, HttpFinalizerExpress } from "./http.model";

function httpModel(cce: CallContextEvent, ...args) {
  const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:http:http', { data: { url, config } },
    async (resolve, reject, scopeContext) => {
      try { return resolve(await axios.get(url, config)); } catch (e) { reject(convertAxiosError(e)); }
    });
}
(httpModel as any).get = (cce: CallContextEvent, ...args) => {
  const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:http:http.get', { data: { url, config } },
    async (resolve, reject, scopeContext) => {
      try { resolve(await axios.get(url, config)); } catch (e) { reject(convertAxiosError(e)); }
    });
}
(httpModel as any).head = (cce: CallContextEvent, ...args) => {
  const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:http:http.head', { data: { url, config } },
    async (resolve, reject, scopeContext) => {
      try { resolve(await axios.head(url, config)); } catch (e) { reject(convertAxiosError(e)); }
    });
}
(httpModel as any).post = (cce: CallContextEvent, ...args) => {
  const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:http:http.post', { data: { url, config } },
    async (resolve, reject, scopeContext) => {
      try { resolve(await axios.post(url, config.data, config)); } catch (e) { reject(convertAxiosError(e)); }
    });
}
(httpModel as any).put = (cce: CallContextEvent, ...args) => {
  const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:http:http.put', { data: { url, config } },
    async (resolve, reject, scopeContext) => {
      try { resolve(await axios.put(url, config.data, config)); } catch (e) { reject(convertAxiosError(e)); }
    });
}
(httpModel as any).patch = (cce: CallContextEvent, ...args) => {
  const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:http:http.patch', { data: { url, config } },
    async (resolve, reject, scopeContext) => {
      try { resolve(await axios.patch(url, config.data, config)); } catch (e) { reject(convertAxiosError(e)); }
    });
}
(httpModel as any).delete = (cce: CallContextEvent, ...args) => {
  const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:http:http.delete', { data: { url, config } },
    async (resolve, reject, scopeContext) => {
      try { resolve(await axios.delete(url, config)); } catch (e) { reject(convertAxiosError(e)); }
    });
}
(httpModel as any).finalizer = {
  express: (cce: CallContextEvent, ...args: any[]) => {
    return HttpFinalizerExpress(args[0], args[1]);
  }
};
(httpModel as any).server = (cce: CallContextEvent, ...args) => {
  const port = parseInt(args[0], 10);
  let type: 'express' = args[1]; if (!type) { type = 'express'; }
  return getRuntime().scopedExec(
    cce, 'lugger:http:http.server', { data: { port } },
    async (resolve, reject, scopeContext) => {
      try {
        if (type === 'express') {
          const app = Express();
          (app as any).start = () => {
            return promise(resolve2 => {
              (app as any).server = app.listen(port, () => {
                resolve2(app);
              });
            });
          };
          (app as any).stop = () => {
            return promise(async (resolve2, reject2) => {
              if (!(app as any).server) {
                return reject2(new Error(`cannot stop a server that has never started.`));
              }
              ((app as any).server as Server).close(e => {
                if (e) { return reject2(e); }
                return resolve(app);
              });
              return resolve2();
            });
          };
          return resolve(app);
        }
      } catch (e) { reject(e); }
    });
}

export const http__ = httpModel as any as (typeof http);

function getHttpRequestArgs(args: any[]) {
  const arg0 = args[0];
  if (typeof arg0 === 'string') {
    return {
      url: arg0 as string,
      config: (args[1] ? args[1] : {}) as AxiosRequestConfig,
    }
  } else {
    return {
      url: arg0.url as string,
      config: arg0 as AxiosRequestConfig,
    }
  }
}

function convertAxiosError(axiosE: AxiosError): HttpError {
  const e = new Error(`[${axiosE.code}] ${axiosE.message}`) as HttpError;
  e.codeName = axiosE.code;
  e.code = axiosE.response?.status;
  e.getResponse = () => axiosE.response;
  e.getOriginalError = () => axiosE;
  return e;
}

function couldBeJSON(data: string) {
  data = data.trim();
  return (
    (data.startsWith('{') && data.startsWith('}')) ||
    (data.startsWith('[') && data.startsWith(']'))
  );
}

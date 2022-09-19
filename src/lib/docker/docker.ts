// RITZ SKIP
import { CallContextEvent, CCE, dedent, getRuntime } from "ritz2";
import { docker } from "./docker.ritz.default";
import { DockerPullStatus, UnixSocketGet, UnixSocketPost } from "./docker.model";

function dockerModel(cce: CallContextEvent, ...args) {
  return getRuntime().scopedExec(
    cce, 'lugger:docker:docker', { data: { } },
    async (resolve, reject, scopeContext) => {
      resolve(true);
    });
}
(dockerModel as any).ps = (cce: CallContextEvent, ...args) => {
  return getRuntime().scopedExec(
    cce, 'lugger:docker:docker.ps', { data: { } },
    async (resolve, reject, scopeContext) => {
      try { resolve(JSON.parse(await UnixSocketGet('/var/run/docker.sock', '/containers/json?all=true&size=true'))); } catch (e) { reject(e); }
    });
}
(dockerModel as any).images = (cce: CallContextEvent, ...args) => {
  // const { url, config } = getHttpRequestArgs(args);
  return getRuntime().scopedExec(
    cce, 'lugger:docker:docker.images', { data: { } },
    async (resolve, reject, scopeContext) => {
      try { resolve(JSON.parse(await UnixSocketGet('/var/run/docker.sock', '/images/json'))); } catch (e) { reject(e); }
    });
}
(dockerModel as any).pull = (cce: CallContextEvent, ...args) => {
  const image = args[0];
  return getRuntime().scopedExec(
    cce, 'lugger:docker:docker.pull', { data: { } },
    async (resolve, reject, scopeContext) => {
      try {
        let registryEndpoint: string = 'docker.io';
        const headers = { 'X-Stream-Match': [
          `Status: Image is up to date for :: cached`,
          `Status: Downloaded :: downloaded`,
          `unknown: Not Found :: not_found`,
          `unauthorized: :: unauthorized`,
        ].join(' || ') };
        if (image.indexOf('.') >= 0) {
          registryEndpoint = image.split('/')[0];
          if (scopeContext.parent.data.dockerLogin?.[registryEndpoint]) {
            headers['X-Registry-Auth'] = scopeContext.parent.data.dockerLogin[registryEndpoint];
          }
        }
        const res = await UnixSocketPost('/var/run/docker.sock', `/images/create?fromImage=${image}`, '', headers) as DockerPullStatus;
        if (!res) {
          return reject(new Error(`unknown error while pulling ${image}`));
        } else if (res === 'not_found') {
          return reject(new Error(`image not found: ${image}`));
        } else if (res === 'unauthorized') {
          return reject(new Error(`unauthorized: no valid permission for ${registryEndpoint}`));
        }
        return resolve(res);
      } catch (e) { return reject(e); }
    });
}

(dockerModel as any).login = (cce: CallContextEvent, ...args) => {
  let [ registry, username, password ] = args as [ string, string, string ];
  return getRuntime().scopedExec(
    cce, 'lugger:docker:docker.login', { data: { } },
    async (resolve, reject, scopeContext) => {
      try {
        if (!scopeContext.parent.data.dockerLogin) { scopeContext.parent.data.dockerLogin = {}; }
        scopeContext.parent.data.dockerLogin[registry] = Buffer.from(JSON.stringify({
          serveraddress: registry, username, password, email: '',
        })).toString('base64');
        resolve(void 0);
      } catch (e) { reject(e); }
    });
}

export const docker__ = dockerModel as any as (typeof docker);

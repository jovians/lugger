import { promise, Promise2 } from "@jovian/type-tools";
import http from 'http';

export interface DockerAPIRequest {

}

export interface DockerAPIResponse {

}

export type DockerPullStatus = (
  'downloaded' | 
  'cached' |
  'not_found' |
  'unauthorized' |
  null
);

export interface DockerImage {
  Containers: number;
  Created: number;
  Id: string;
  Labels: { [label: string]: string; };
  ParentId: string;
  RepoDigests: string[];
  RepoTags: string[];
  SharedSize: number;
  Size: number;
  VirtualSize: number;
}

export interface DockerContainer {
  /** e.g. "8dfafdbc3a40" */
  Id: string;
  /** e.g. [ "/boring_feynman" ] */
  Names: string[];
  /** e.g. "ubuntu:latest" */
  Image: string;
  /** e.g. d74508fb6632491cea586a1fd7d748dfc5274cd6fdfedee309ecdcbc2bf5cb82 */
  ImageID: string;
  /** e.g. "echo 1"*/
  Command: string;
  /** e.g. 1367854155 */
  Created: number;
  /** e.g. "Exited" */
  State: 'Exited' | 'Running';
  /** e.g. "Exit 0"*/
  Status: string;
  /**
   * e.g.
   * { "PrivatePort": 2222, "PublicPort": 3333, "Type": "tcp" }
   */
  Ports: {
    PrivatePort: number;
    PublicPort: number;
    Type: 'tcp' | 'udp';
  }[];
  /**
   * e.g.
   * { "com.example.vendor": "Acme", "com.example.license": "GPL" }
   */
  Labels: { [label: string]: string; };
  /** e.g. 12288 */
  SizeRw: number;
  /** e.g. 12288 */
  SizeRootFs: number,
  /** e.g. { NetworkMode: 'default' } */
  HostConfig: {
    NetworkMode: 'default'
  };
  NetworkSettings: {
    Networks: {
      bridge: {
        NetworkID: string;
        EndpointID: string;
        Gateway: string;
        IPAddress: string;
        IPPrefixLen: number;
        IPv6Gateway: string;
        GlobalIPv6Address: string;
        GlobalIPv6PrefixLen: number;
        MacAddress: string;
      }
    }
  },
  Mounts: {
    Name: string;
    Source: string;
    Destination: string;
    Driver: string;
    Mode: string;
    RW: boolean;
    Propagation: string;
  }[];
}

export function UnixSocketGet(socketPath: string, path: string, headers?: {[name: string]: string}, encoding?: BufferEncoding): Promise2<string>;
export function UnixSocketGet(socketPath: string, path: string, headers: {[name: string]: string} = {}, encoding: BufferEncoding = 'utf8') {
  return promise(async (resolve, reject) => {
    const headersTotal = {};
    Object.assign(headersTotal, headers);
    const req = http.get({ path, socketPath, headers: headersTotal });
    req.once('error', reject);
    req.once('response', async res => {
      const buffers: Buffer[] = [];
      for await (const buf of res) { buffers.push(buf); }
      resolve(Buffer.concat(buffers).toString(encoding));
    });
  });
}

export function UnixSocketPost(socketPath: string, path: string, postData: string, headers?: {[name: string]: string}, encoding?: BufferEncoding): Promise2<string>;
export function UnixSocketPost(socketPath: string, path: string, postData: string, headers: {[name: string]: string} = {}, encoding: BufferEncoding = 'utf8') {
  return promise(async (resolve, reject) => {
    const xStreamMatch = headers['X-Stream-Match'];
    const headersTotal = { ...headers };
    if (headersTotal['X-Stream-Match']) { delete headersTotal['X-Stream-Match']; }
    const req = http.request({ method: 'POST', path, socketPath, headers: headersTotal }, res => {
      const buffers: Buffer[] = [];
      if (xStreamMatch) {
        let matched: DockerPullStatus = null;
        const matchPatterns = xStreamMatch.split(' || ')
                                .map(a => ( { pattern: a.split(' :: ')[0], value: a.split(' :: ')[1] } ));
        res.on('data', chunk => {
          if (matched) { return; }
          for (const matcher of matchPatterns) {
            if (chunk.toString('utf8').indexOf(matcher.pattern) >= 0) {
              matched = matcher.value as DockerPullStatus;
              break;
            }  
          }
        });
        res.on('end', () => { resolve(matched); });
      } else {
        res.on('data', chunk => {
          buffers.push(chunk);
        });
        res.on('end', () => { resolve(Buffer.concat(buffers).toString(encoding)); });
      }
    });
    req.once('error', reject);
    req.write(Buffer.from(postData, encoding));
    req.end();
  });
}

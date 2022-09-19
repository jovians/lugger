/* Jovian (c) 2020, License: MIT */
import { PostfixReturn, ritzIfaceGuard, TaggedTemplateSelfChain } from 'ritz2';
import { DockerAPIRequest, DockerAPIResponse, DockerContainer, DockerImage } from './docker.model';

class dockerModel {

  static ps(): PostfixReturn<DockerContainer[]>;
  static ps(...args) { ritzIfaceGuard('lugger:docker:docker.ps', __filename); return null; }

  static images(): PostfixReturn<DockerImage[]>;
  static images(...args) { ritzIfaceGuard('lugger:docker:docker.images', __filename); return null; }

  static pull(image: string): PostfixReturn<'downloaded' | 'cached'>;
  static pull(...args) { ritzIfaceGuard('lugger:docker:docker.pull', __filename); return null; }

  static login(registry: string, username: string, password: string): PostfixReturn<void>;
  static login(...args) { ritzIfaceGuard('lugger:docker:docker.login', __filename); return null; }
}

export const docker = dockerModel as (typeof dockerModel & ((req: DockerAPIRequest) => PostfixReturn<DockerAPIResponse>));

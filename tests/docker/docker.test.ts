import { flow, should, testDefine } from 'ritz2';
import { http } from '../../src/lib/http/http.ritz.default';
import { HttpError } from '../../src/lib/http/http.model';
import { docker } from '../../src/lib/docker/docker.ritz.default';
// import secrets from '../../.secrets.json';

testDefine(`docker ps should work`); {
    const res = docker.ps();
    check: Array.isArray(res);
}

testDefine(`docker images should work`); {
    const res = docker.images();
    check: Array.isArray(res);
}

testDefine(`docker pull should work`); {
    const res = docker.pull('nginx:latest');
    check: res === 'cached' || res === 'downloaded';
}

// testDefine(`docker pull shouldn't work for private registry`); {
//     should.throw; {
//         docker.pull('luggertest.jfrog.io/test-image:latest');
//     }
// }

// testDefine(`docker pull shouldn work for private registry with credentials`); {
//     docker.login('luggertest.jfrog.io', secrets.dockerRegistry.user, secrets.dockerRegistry.pass)
//     const res = docker.pull('luggertest.jfrog.io/test-image:latest');
//     check: res === 'cached' || res === 'downloaded';
// }

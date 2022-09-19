# Lugger

Lugger is an automation framework running on customizable Typescript DSL

Here are some characteristics we desire in this framework:

* **Superset** of Typescript (normal TS flow should run identically)
* Provide frequently used toolchains as **strongly-typed library**
  * SCM (e.g. git), docker (containerized workloads)
  * SSH, Shell scripting
  * Infrastructure automation (e.g. AWS, Azure, GCP, etc.)
* Ability to define workflow **declaratively**
* No need for \`await\` when using DSL (statements are auto awaited)
* Easy **concurrency** (parallel)
* All DSL processes are **serializable** (pause, stash, resume workflow)
* Built-in control against flakiness (e.g. retry, timeout, backoff, repeat, etc.)

```typescript
import { workflow, params, stage, echo, docker, file } from 'lugger';

class MyCiCdWorkFlow extends Workflow {
    
    setup() {
        git.clone({
            repo: `${env.REPO_URL}`,
            branch: 'mybranch',
            folder: './sourcecode'
        });
        sh `mkdir -p metadata`;
        echo `set-up comeplete`;
    }
    
    @stage
    'Build Docker Images'() {
        docker.pull(`nginx:latest`)
              .try(5).backoff('auto').timeout(10, 'm')
        docker.build(`myapp:${BUILD_NUMBER}`, 'sourcecode/Dockerfile')
              .try(2).timeout(10, 'm')
    }
    
    @stage
    'Run Tests'() {
        chdir(`./sourcecode`);
        parallel; {
            stage('Unit Tests'); {
                sh `python tests/unit_test_entrypont.py`
                echo `Unit Tests ended`
            }
            stage('Integration Tests'); {
                sh `bash tests/integration_suites.sh`
                echo `Integration Tests ended`
            }
        }
    }
    
    @stage
    'Deploy'() {
        const { user, pass } = SecretManager.resolve({
            user: '<secret.docker.deployerAccount.user>',
            pass: '<secret.docker.deployerAccount.pass>',
        })
        const deployedImage = `myregistry.com/myapp:${BUILD_NUMBER}`;
        docker.login('myregistry.com', user, pass)
        docker.tag(`myapp:${BUILD_NUMBER}`, deployedImage)
        docker.push(`myapp:${BUILD_NUMBER}`).try(3)
    }
    
    cleanup() {
        // release resources
    }
    
    success() {
        console.log(`I've succeeded`);
    }
    
    failure() {
        console.log(`I've failed!`);
    }

}

// entrypoint
runWorkflow(MyCiCdWorkFlow)
```

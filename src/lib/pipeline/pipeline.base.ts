import { Class, ClassLineage, ok, promise, Promise2, Result } from '@jovian/type-tools';
import { Workflow, StageReturn, FlowContext, StageInfo } from './pipeline.model';
import { v4 as uuidv4 } from 'uuid';
import { errorCheck, punchGrab } from 'ritz2';

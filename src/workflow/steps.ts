import { Result } from "@jovian/type-tools";

export type Steps = (() => void | Promise<void> | Result | Promise<Result>)[];

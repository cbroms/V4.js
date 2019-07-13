import { Error } from "./Error";

export const ArgChecker = (...args: any[]) => {
  for (const arg of args) {
    if (arg.r) {
      if (arg.v instanceof arg.t) {
        Error(arg.v.name + " not an instance of " + arg.t.name);
      }
    }
  }
};

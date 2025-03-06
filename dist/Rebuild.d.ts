import type { extract } from "./Extract.js";
export declare function rebuild(entries: ReturnType<typeof extract>, replacements: Map<string, string>): Buffer<ArrayBuffer>;

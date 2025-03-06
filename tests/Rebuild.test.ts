import { readFileSync, readdirSync } from "fs";

import { describe, expect, it } from "vitest";

import { extract } from "../src/Extract.js";
import { rebuild } from "../src/Rebuild.js";

describe("rebuild() function", () => {
  const originalSamples: Array<[string]> = Array.from(
    new Set(
      readdirSync(`${__dirname}/fixtures`)
        .filter((file) => file.endsWith(".dat"))
        .map((file) => file.substring(0, file.length - 4)),
    ),
  ).map((file) => [file]);

  const samples = [
    ["illegalname", new Map([["illegalname_00", "Arc"]] as const)],
    ...originalSamples,
  ] as const;

  it.each(samples)(
    "rebuild(%j)",
    (file, replacements?) => {
      expect(
        rebuild(
          extract(
            readFileSync(`${__dirname}/fixtures/${file}.dat`),
            readFileSync(`${__dirname}/fixtures/${file}.tbl`),
          ),
          replacements ?? new Map(),
        ).toString("hex"),
      ).toStrictEqual(
        readFileSync(`${__dirname}/fixtures/${file}.dat`).toString("hex"),
      );
    },
    0,
  );
});

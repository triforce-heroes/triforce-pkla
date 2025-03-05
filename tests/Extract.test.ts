import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

import { extract } from "../src/Extract.js";

describe("extract() function", () => {
  const samples = [
    [
      "illegalname",
      [
        {
          hash: 18143095201266417999n,
          name: "illegalname_00",
          message: "Arc",
        },
      ],
    ],
  ] as const;

  it.each(samples)(
    "extract(%j)",
    (file, output) => {
      expect(
        extract(
          readFileSync(`${__dirname}/fixtures/${file}.dat`),
          readFileSync(`${__dirname}/fixtures/${file}.tbl`),
        ),
      ).toStrictEqual(output);
    },
    0,
  );
});

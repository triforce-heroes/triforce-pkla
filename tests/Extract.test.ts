import { readFileSync } from "fs";

import { describe, expect, it } from "vitest";

import { extract } from "@/Extract.js";

describe("extract() function", () => {
  const samples = [
    ["btl_get", []],
    [
      "illegalname",
      [
        {
          hash: 18143095201266417999n,
          name: "illegalname_00",
          flags: 4,
          message: "Arc",
        },
      ],
    ],
    [
      "fieldability",
      [
        {
          hash: 15028289409513731891n,
          name: "ability0",
          flags: 0,
          message: "\u0010\u0002\uBDFF\u0000",
        },
      ],
    ],
    [
      "movie_skip",
      [
        {
          hash: 220750874616692165n,
          name: "skip01",
          flags: 0,
          message: "Skip Movie",
        },
      ],
    ],
    [
      "tamago_demo",
      [
        {
          flags: 4,
          hash: 13722465744160963915n,
          message: "Oh?",
          name: "msg_egg_event_01_01",
        },
        {
          hash: 16894979030163935124n,
          name: "msg_egg_event_02_01",
          flags: 0,
          message: "\u0010\u0002\u0101\u0000 hatched from the Egg!",
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

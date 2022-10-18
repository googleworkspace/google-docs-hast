/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import fs from "fs";
import path from "path";

import { describe, expect, test } from "vitest";

import { hast } from "../src";
import { FIXTURES_DIR, CASES } from "./cases";

expect.addSnapshotSerializer({
  serialize(val) {
    return JSON.stringify(val, null, 2);
  },
  test(val) {
    return typeof val === "object";
  },
});

describe.each(CASES)("%name", ({ name }) => {
  const doc = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, name), "utf8")
  );

  test("hast", () => {
    expect(hast(doc)).toMatchSnapshot();
  });

  test("hast without styles", () => {
    expect(hast(doc, { styles: false })).toMatchSnapshot();
  });
});

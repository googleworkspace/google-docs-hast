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

import prettier from "prettier";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { describe, expect, test } from "vitest";

import { hast } from "../src";
import { CASES, FIXTURES_DIR } from "./cases";

import type { Root } from "hast";

expect.addSnapshotSerializer({
  serialize(val) {
    return val;
  },
  test(val) {
    return typeof val === "string";
  },
});

describe.each(CASES)("%name", ({ name }) => {
  const doc = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, name), "utf8")
  );

  test("html", () => {
    const output = prettier.format(html(hast(doc)), { parser: "html" });
    fs.mkdirSync(path.join(__dirname, "__html__"), { recursive: true });
    fs.writeFileSync(path.join(__dirname, "__html__", `${name}.html`), output);
    expect(output).toMatchSnapshot();
  });

  test("html without styles", () => {
    const output = prettier.format(html(hast(doc, { styles: false })), {
      parser: "html",
    });
    fs.mkdirSync(path.join(__dirname, "__html__"), { recursive: true });
    fs.writeFileSync(
      path.join(__dirname, "__html__", `${name}_styles_false.html`),
      output
    );
    expect(output).toMatchSnapshot();
  });
});

const html = (root: Root): string => {
  return unified()
    .use(rehypeStringify, { collapseEmptyAttributes: true })
    .stringify(root);
};

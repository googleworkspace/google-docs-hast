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

import { describe, expect, test } from "vitest";

import { borderToCss } from "./style";

import type { docs_v1 } from "@googleapis/docs";

describe("common/style", () => {
  test("borderToCss", () => {
    const border: docs_v1.Schema$ParagraphBorder = {
      color: {
        color: {
          rgbColor: {
            blue: 0.5,
            green: 0.5,
            red: 0.5,
          },
        },
      },
      dashStyle: "SOLID",
      width: {
        magnitude: 1,
        unit: "PT",
      },
    };

    expect(borderToCss(border)).toMatchInlineSnapshot(
      '"1PT rgb(127.5, 127.5, 127.5) solid"'
    );
    expect(borderToCss({ ...border, width: undefined })).toMatchInlineSnapshot(
      '""'
    );
  });
});

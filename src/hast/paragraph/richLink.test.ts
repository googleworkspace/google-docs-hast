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

import { transformRichLink } from "./richLink";

import type { docs_v1 } from "@googleapis/docs";

describe("richLink", () => {
  const richLink: docs_v1.Schema$ParagraphElement["richLink"] = {
    richLinkId: "richLinkId",
    richLinkProperties: {
      title: "Title",
      uri: "https://example.com",
    },
  };

  test("transformRichLink generates correct output", () => {
    expect(transformRichLink(richLink)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "type": "text",
            "value": "Title",
          },
        ],
        "properties": {
          "href": "https://example.com",
        },
        "tagName": "a",
        "type": "element",
      }
    `);
  });

  test("transformRichLink uses uri if no title", () => {
    expect(
      transformRichLink({
        ...richLink,
        richLinkProperties: { uri: richLink.richLinkProperties.uri },
      })
    ).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "type": "text",
            "value": "https://example.com",
          },
        ],
        "properties": {
          "href": "https://example.com",
        },
        "tagName": "a",
        "type": "element",
      }
    `);
  });
});

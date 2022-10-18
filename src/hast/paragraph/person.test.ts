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

import { transformPerson } from "./person";

import type { docs_v1 } from "@googleapis/docs";

describe("person", () => {
  const person: docs_v1.Schema$ParagraphElement["person"] = {
    personId: "personId",
    personProperties: {
      email: "john@example.com",
      name: "John Doe",
    },
  };

  test("transformPerson uses name as text value if available", () => {
    expect(transformPerson(person)).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "type": "text",
            "value": "John Doe",
          },
        ],
        "properties": {
          "mailto": "john@example.com",
        },
        "tagName": "a",
        "type": "element",
      }
    `);
  });

  test("transformPerson uses email as text value if no name", () => {
    expect(
      transformPerson({
        ...person,
        personProperties: { email: person.personProperties.email },
      })
    ).toMatchInlineSnapshot(`
      {
        "children": [
          {
            "type": "text",
            "value": "john@example.com",
          },
        ],
        "properties": {
          "mailto": "john@example.com",
        },
        "tagName": "a",
        "type": "element",
      }
    `);
  });
});

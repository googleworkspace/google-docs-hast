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
import { visit } from "unist-util-visit";

import type { Root } from "hast";

/**
 * Replace all header tag IDs with the slug version and update internal links.
 *
 * @param root The HAST tree to process.
 * @returns The processed HAST tree.
 */
export const removeStyles = (root: Root): Root => {
  visit(root, "element", (node) => {
    // remove spans
    if (node.children?.length === 1) {
      const child = node.children[0];
      if (child.type === "element" && child.tagName === "span") {
        node.children = child.children;
      }
    }

    // remove styles
    delete node.properties?.style;
  });

  return root;
};

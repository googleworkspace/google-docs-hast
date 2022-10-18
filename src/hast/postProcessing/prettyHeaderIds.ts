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
import Slugger from "github-slugger";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

import type { Element, Root } from "hast";

/**
 * Replace all header tag IDs with the slug version and update internal links.
 *
 * @param root The HAST tree to process.
 * @returns The processed HAST tree.
 */
export const replaceHeaderIdsWithSlug = (root: Root): Root => {
  const links: { [key: string]: Element[] } = {};

  // find all internal links and track them
  visit(root, "element", (node) => {
    if (node.tagName !== "a") {
      return;
    }
    const { href = "" } = node.properties || {};

    if (typeof href === "string" && href.startsWith("#")) {
      if (!links[href.slice(1)]) {
        links[href.slice(1)] = [];
      }
      // remove the # from the src to match id
      links[href.slice(1)].push(node);
    }
  });

  const slugs = new Slugger();

  // replace all ids for header tags
  visit(root, "element", (node) => {
    if (
      node.tagName.match(/^h[1-6]$/) &&
      typeof node.properties?.id === "string" &&
      node.properties.id.length > 0
    ) {
      const slug = slugs.slug(toString(node));

      //update links with slug
      for (const link of links[node.properties.id] ?? []) {
        link.properties.src = `#${slug}`;
      }

      node.properties.id = slug;
    }
  });

  return root;
};

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

import { h } from "hastscript";

import type { Context } from ".";
import type { docs_v1 } from "@googleapis/docs";
import type { Element } from "hast";

export const isListItem = (el: docs_v1.Schema$StructuralElement): boolean => {
  return Boolean(el.paragraph && el.paragraph.bullet);
};

export const listItemLevel = (el: docs_v1.Schema$StructuralElement): number => {
  return el.paragraph.bullet.nestingLevel ?? 0;
};

export const listElement = (
  el: docs_v1.Schema$StructuralElement,
  { doc }: Context
): Element => {
  const { listId } = el.paragraph.bullet;
  let { nestingLevel } = el.paragraph.bullet;
  nestingLevel = nestingLevel ?? 0;
  const { glyphType, startNumber } =
    doc.lists[listId].listProperties.nestingLevels[nestingLevel];

  const attributes = {
    class: `nesting-level-${nestingLevel + 1}`,
  };

  if ([undefined, "GLYPH_TYPE_UNSPECIFIED", "NONE"].includes(glyphType)) {
    return h("ul", attributes);
  }

  const listStyleType = {
    DECIMAL: "decimal",
    ZERO_DECIMAL: "decimal-leading-zero",
    UPPER_ALPHA: "upper-alpha",
    ALPHA: "lower-alpha",
    UPPER_ROMAN: "upper-roman",
    ROMAN: "lower-roman",
  };

  const style = listStyleType[glyphType];

  return h("ol", {
    ...attributes,
    ...(startNumber !== 1 ? { start: String(startNumber) } : {}),
    ...(style ? { "list-style-type": style } : {}),
  });
};

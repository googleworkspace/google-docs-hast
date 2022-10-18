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

import { borders, textAlign, serializeStyle } from "./style";

import type { docs_v1 } from "@googleapis/docs";
import type { Properties } from "csstype";

export const paragraphStyleToAttributes = ({
  alignment,
  borderBetween,
  borderBottom,
  borderLeft,
  borderRight,
  borderTop,
  direction,
  indentEnd,
  indentFirstLine,
  indentStart,
  lineSpacing,
  namedStyleType,
  spaceAbove,
  spaceBelow,
  headingId,
}: docs_v1.Schema$ParagraphStyle): {
  style?: string;
  class?: string;
  id?: string;
} => {
  const style: Properties = {};

  if (alignment) {
    const value = textAlign(alignment);
    if (value !== "start") {
      style.textAlign = textAlign(alignment);
    }
  }

  Object.assign(
    style,
    borders({ borderBottom, borderLeft, borderRight, borderTop, borderBetween })
  );

  if (direction === "RIGHT_TO_LEFT") {
    style.direction = "rtl";
  }

  // TODO should indents be padding or margin or something else?
  // TODO how does this interact with border.padding?
  if (indentStart?.magnitude != undefined) {
    style.paddingLeft = `${indentStart.magnitude}${indentStart.unit}`;
  }

  if (indentEnd?.magnitude != undefined) {
    style.paddingRight = `${indentStart.magnitude}${indentStart.unit}`;
  }

  if (indentFirstLine?.magnitude != undefined) {
    style.textIndent = `${indentFirstLine.magnitude}${indentFirstLine.unit}`;
  }

  if (lineSpacing && lineSpacing !== 100) {
    style.lineHeight = `${lineSpacing}%`;
  }

  if (spaceAbove?.magnitude != undefined) {
    style.marginTop = `${spaceAbove.magnitude}${spaceAbove.unit}`;
  }

  if (spaceBelow?.magnitude != undefined) {
    style.marginBottom = `${spaceBelow.magnitude}${spaceBelow.unit}`;
  }

  const attributes: ReturnType<typeof paragraphStyleToAttributes> = {};

  if (Object.keys(style).length) {
    attributes.style = serializeStyle(style);
  }

  if (namedStyleType) {
    attributes.class = namedStyleType.replace(/_/g, "-").toLowerCase();
  }

  if (headingId) {
    attributes.id = headingId;
  }

  return attributes;
};

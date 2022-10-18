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

import { rgbColor, serializeStyle } from "../common/style";

import type { docs_v1 } from "@googleapis/docs";
import type { Element, Text } from "hast";

/**
 * Wraps the underlying element in HTML tags such as `<b>` and `<i>` and applies
 * CSS styles to the inner element for styles not capture by HTML tags.
 *
 * @internal
 */
export const wrapStyle = (
  el: Element | Text,
  {
    backgroundColor,
    baselineOffset,
    bold,
    fontSize,
    foregroundColor,
    italic,
    strikethrough,
    underline,
    weightedFontFamily: { weight, fontFamily } = {},
  }: docs_v1.Schema$TextStyle = {}
): Element | Text => {
  const style: { [key: string]: string } = {};

  if (backgroundColor) {
    style.backgroundColor = rgbColor(backgroundColor);
  }

  if (fontSize) {
    style.fontSize = `${fontSize.magnitude}${fontSize.unit}`;
  }

  if (fontFamily) {
    style.fontFamily = fontFamily;
  }

  if (weight) {
    style.fontWeight = String(weight);
  }

  if (foregroundColor) {
    style.color = rgbColor(foregroundColor);
  }

  if (Object.keys(style).length) {
    // upgrade to span if text node
    if (isText(el)) {
      el = h("span", { style: serializeStyle(style) }, el.value);
    } else {
      el.properties.style = serializeStyle(style);
    }
  }

  if (baselineOffset === "SUPERSCRIPT") {
    el = h("sup", [el]);
  }

  if (baselineOffset === "SUBSCRIPT") {
    el = h("sub", [el]);
  }

  if (bold) {
    el = h("strong", [el]);
  }

  if (italic) {
    el = h("i", [el]);
  }

  if (strikethrough) {
    el = h("s", [el]);
  }

  if (underline) {
    el = h("u", [el]);
  }

  return el;
};

export const isText = (o: Element | Text): o is Text => {
  return o.type === "text";
};

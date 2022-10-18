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

import { wrapStyle } from "../common/wrapStyle";

import type { docs_v1 } from "@googleapis/docs";
import type { Element, Text } from "hast";

export const transformTextRun = (
  textRun: docs_v1.Schema$ParagraphElement["textRun"]
): Element | Text => {
  const content = textRun.content
    .replace(/\n/g, "")
    // maintain whitespace
    .replace(/ {2}/g, " \u2002");

  if (textRun.textStyle.link) {
    const { url, bookmarkId, headingId } = textRun.textStyle.link;
    let href: string;

    if (url) {
      href = url;
    }

    if (bookmarkId) {
      console.warn(
        `Unsupported element: paragraph.textRun.textStyle.link.bookmarkId`
      );
      return;
    }

    if (headingId) {
      href = `#${headingId}`;
    }

    return h("a", { href }, content);
  }
  return wrapStyle({ type: "text", value: content }, textRun.textStyle);
};

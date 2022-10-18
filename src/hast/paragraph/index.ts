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

import { paragraphStyleToAttributes } from "../common/paragraphStyle";
import { namedStyleTypeToTag } from "../common/style";
import { transformInlineObject } from "./inlineObject";
import { transformPerson } from "./person";
import { transformRichLink } from "./richLink";
import { transformTextRun } from "./textRun";

import type { Context } from "..";
import type { docs_v1 } from "@googleapis/docs";
import type { Element, Text } from "hast";

export const paragraphToElement = (
  paragraph: docs_v1.Schema$Paragraph,
  { doc }: Context
): Element => {
  // @see https://developers.google.com/docs/api/reference/rest/v1/documents#Paragraph
  const { elements, paragraphStyle, bullet } = paragraph;

  // TODO apply styles to bullets
  if (bullet) {
    return h(
      "li",
      elements.map((el) => paragraphElementToElement(el, doc))
    );
  }
  return h(
    namedStyleTypeToTag(paragraphStyle.namedStyleType),
    paragraphStyleToAttributes(paragraphStyle),
    elements
      .map((el) => paragraphElementToElement(el, doc))
      .filter((el) => el != undefined)
  );
};

const paragraphElementToElement = (
  el: docs_v1.Schema$ParagraphElement,
  doc: docs_v1.Schema$Document
): Element | Text => {
  // @see https://developers.google.com/docs/api/reference/rest/v1/documents#ParagraphElement
  // TODO support other types of paragraph elements
  const { inlineObjectElement, person, richLink, textRun } = el;

  if (inlineObjectElement) {
    return transformInlineObject(inlineObjectElement, doc);
  }

  if (person) {
    return transformPerson(person);
  }

  if (richLink) {
    return transformRichLink(richLink);
  }

  if (textRun) {
    return transformTextRun(textRun);
  }

  console.warn(
    `Unsupported element: paragraph.${Object.keys(el)
      .filter((k) => !k.match(/.*Index$/))
      .pop()}`
  );
};

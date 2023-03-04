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

import {
  listElement,
  isListItem,
  listItemLevel,
  listItemBulletId,
} from "./lists";
import { paragraphToElement } from "./paragraph";
import { replaceHeaderIdsWithSlug } from "./postProcessing/prettyHeaderIds";
import { removeStyles } from "./postProcessing/removeStyles";
import { tableToElement } from "./table";

import type { docs_v1 } from "@googleapis/docs";
import type { Element, Root } from "hast";

export interface HastOptions {
  /**
   * Header IDs are in the form `id="h.wn8l66qm9m7y"` when exported from the
   * Google Docs API. By default, header tag IDs are updated to match their text
   * content. See [github-slugger](https://www.npmjs.com/package/github-slugger)
   * for more information on how this is done.
   *
   * The default behavior can be disabled by setting this option to `false`.
   */
  prettyHeaderIds?: boolean;
  /**
   * Styles are added to elements by default. This can be disabled by setting
   * this option to `false`.
   */
  styles?: boolean;
}

export const DEFAULT_OPTIONS = { prettyHeaderIds: true, styles: true };

export interface Context {
  options: HastOptions;
  doc: docs_v1.Schema$Document;
}

/**
 * Generate an HTML AST from a Google Docs document in JSON form.
 *
 * @param doc JSON representation of a Google Docs document.
 * @param options Options for the transformation.
 * @returns The HTML abstract syntax tree.
 * @see {@link https://developers.google.com/docs/api/reference/rest/v1/documents#Document | Google Docs API}.
 * @see {@link https://github.com/syntax-tree/hast | HTML abstract syntax tree (HAST)}
 */
export const toHast = (
  doc: docs_v1.Schema$Document,
  options: HastOptions = {}
): Root => {
  options = { ...DEFAULT_OPTIONS, ...options };

  // TODO headers, footers, footnotes, etc
  // @see https://developers.google.com/docs/api/reference/rest/v1/documents#Document
  const { body } = doc;

  let tree = h(null, transform(body.content, { doc, options }));

  if (options.prettyHeaderIds) {
    tree = replaceHeaderIdsWithSlug(tree);
  }

  if (options.styles === false) {
    tree = removeStyles(tree);
  }

  return tree;
};

/**
 * @deprecated Use {@link toHast} instead.
 */
export const hast = toHast;

export const transform = (
  content: docs_v1.Schema$StructuralElement[],
  context: Context
): Element[] => {
  return content?.reduce((acc, ...args) => {
    const el = structuralElementToElement(acc, ...args, context);

    // could be undefined because the element was added as a child of another
    // element. e.g. `li` inside a `ul`
    if (el) {
      acc.push(el);
    }

    return acc;
  }, []);
};

const structuralElementToElement = (
  acc: Element[],
  el: docs_v1.Schema$StructuralElement,
  index: number,
  elements: docs_v1.Schema$StructuralElement[],
  context: Context
): Element => {
  // Union field content can be only one of the following:
  // @see https://developers.google.com/docs/api/reference/rest/v1/documents#StructuralElement
  const { paragraph, table } = el;

  if (paragraph) {
    const last = elements[index - 1];
    const parent = acc.at(-1); //[acc.length - 1];

    const renderedElement: Element = paragraphToElement(paragraph, context);

    if (isListItem(el)) {
      const elListItemLevel = listItemLevel(el);
      if (
        isListItem(last) &&
        (listItemBulletId(el) == listItemBulletId(last) || elListItemLevel > 0)
      ) {
        const lastListItemLevel = listItemLevel(last);
        let level: Element = parent;
        // nested list item
        if (elListItemLevel > lastListItemLevel) {
          // traverse from top level `parent` to last rendered element somewhere deep inside
          for (let i = 0; i < 2 * lastListItemLevel; i++) {
            level = getElementLastChild(level);
          }
          const list = listElement(el, context);
          list.children.push(renderedElement);
          getElementLastChild(level).children.push(list);
          return null;
        }
        // item on existing list
        else {
          // traverse from top level `parent` to last rendered element somewhere deep inside
          for (let i = 0; i < 2 * elListItemLevel; i++) {
            level = getElementLastChild(level);
          }
          level.children.push(renderedElement);
          return null;
        }
      }
      // new list
      else {
        const list = listElement(el, context);
        list.children.push(renderedElement);
        return list;
      }
    }

    return renderedElement;
  }

  if (table) {
    return tableToElement(table, context);
  }

  console.warn(
    `Unsupported element: ${Object.keys(el)
      .filter((k) => !k.match(/.*Index$/))
      .pop()}`
  );
};
const isElement = (element: Element): element is Element =>
  element.type === "element";
const getElementLastChild = (el: Element): Element => {
  return el.children.filter(isElement).at(-1);
};

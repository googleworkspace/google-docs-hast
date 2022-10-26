![](./assets/logo.jpg)

[![npm](https://img.shields.io/npm/v/@googleworkspace/google-docs-hast)](https://www.npmjs.com/package/@googleworkspace/google-docs-hast)
[![Test](https://github.com/googleworkspace/google-docs-hast/actions/workflows/test.yml/badge.svg)](https://github.com/googleworkspace/google-docs-hast/actions/workflows/test.yml)
![Release](https://github.com/googleworkspace/google-docs-hast/workflows/Release/badge.svg)
[![Docs](https://img.shields.io/badge/documentation-api-brightgreen)](https://googleworkspace.github.io/google-docs-hast/)

## Description

Converts the JSON representation of a Google Docs document into an [HTML abstract syntax tree (HAST)](https://github.com/syntax-tree/hast) which can be serialized to HTML or converted to Markdown.

> **Note:** This library does **not** intend to match the rendering by Google Docs.

## Install

Install using NPM or similar.

```sh
npm i @googleworkspace/google-docs-hast
```

## Usage

```js
import { hast } from "@googleworkspace/google-docs-hast";

// Retrieve document from API, https://developers.google.com/docs/api
const doc = ...;

// Convert the document to an HTML AST.
const tree = hast(doc);
```

To get the serialized representation of the HTML AST, use the [rehype-stringify](https://www.npmjs.com/package/rehype-stringify) package.

```js
import { unified } from "unified";
import rehypeStringify from "rehype-stringify";

// Convert the document to an HTML string.
const html = unified()
  .use(rehypeStringify, { collapseEmptyAttributes: true })
  .stringify(tree);
```

### Images

All `<img>` elements should be post-processed as the `src` attribute is only valid for a short time and is of the pattern `https://lh6.googleusercontent.com/...`.

```js
import { visit } from "unist-util-visit";

visit(tree, (node) => {
  if (node.type === "element" && node.tagName === "img") {
    const { src } = node.properties;
    // download, store, and replace the src attribute
    node.properties.src = newSrc;
  }
});
```

### Named styles

Named styles are converted to an HTML element matching the following table.

| Named Style | HTML                          |
| ----------- | ----------------------------- |
| Title       | `<h1 class="title"></h1>`     |
| Subtitle    | `<p class="subtitle"></p>`    |
| Heading 1   | `<h1 class="heading-1"></h1>` |
| Heading 2   | `<h2 class="heading-2"></h2>` |
| Heading 3   | `<h3 class="heading-3"></h3>` |
| Heading 4   | `<h4 class="heading-4"></h4>` |
| Heading 5   | `<h5 class="heading-5"></h5>` |
| Heading 6   | `<h6 class="heading-6"></h6>` |
| Normal Text | `<p class="normal-text"></p>` |

### Text styles

Text styles are converted to an HTML element: `<i>`, `<strong>`, `<s>`, `<sub>`, `<sup>`, and `<u>`.

If there is no direct mapping, a `<span>` with CSS is used to support features such as text color and font. This can be disabled with `{ styles: false }`.

### Anchor links

Header IDs are in the form `id="h.wn8l66qm9m7y"` when exported from the Google Docs API. By default, header tag IDs are updated to match their text content. See [github-slugger](https://www.npmjs.com/package/github-slugger) for more information on how this is done.

For example, the following html:

```html
<h1 class="heading-1" id="h.wn8l66qm9m7y">A heading</h1>
```

becomes:

```html
<h1 class="heading-1" id="a-heading">A heading</h1>
```

This can be disabled with `{ prettyHeaderIds: false}`.

```js
const tree = hast(doc, { prettyHeaderIds: false });
```

## Unsupported Features

Some features of Google Docs are not currently supported by this library. This list is not exhaustive.

| Type                                                                          | Supported | Bug |
| ----------------------------------------------------------------------------- | --------- | --- |
| Styles applied to embedded objects including borders, rotations, transparency | ❌        |     |
| `documentStyle` including pageSize, margins, etc                              | ❌        |     |
| `namedStyles` ( only added as class name on the appropriate tag )             | ❌        |     |
| Page numbers                                                                  | ❌        |     |
| Page breaks                                                                   | ❌        |     |
| Equations                                                                     | ❌        |     |
| Columns                                                                       | ❌        |     |
| Suggestions                                                                   | ❌        |     |
| Bookmarks                                                                     | ❌        |     |

> **Note:** This library does **not** intend to match the rendering by Google Docs.

---

This is not an official Google product.

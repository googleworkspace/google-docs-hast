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
import type { docs_v1 } from "@googleapis/docs";
import type { Properties, Property } from "csstype";

export const textAlign = (
  alignment: docs_v1.Schema$ParagraphStyle["alignment"]
): Property.TextAlign => {
  const mapping: {
    [key: docs_v1.Schema$ParagraphStyle["alignment"]]: Property.TextAlign;
  } = {
    ALIGNMENT_UNSPECIFIED: "start",
    START: "start",
    CENTER: "center",
    END: "end",
    JUSTIFIED: "justify",
  };

  return mapping[alignment];
};

export const borderToCss = ({
  color,
  width,
  dashStyle,
}: docs_v1.Schema$ParagraphBorder): string => {
  if (width?.magnitude === undefined) return "";

  const borderStyle = { DOT: "dotted", DASH: "dashed", SOLID: "solid" }[
    dashStyle
  ];
  return `${width.magnitude}${width.unit} ${rgbColor(color)} ${borderStyle}`;
};

type Border =
  | docs_v1.Schema$ParagraphBorder
  | docs_v1.Schema$TableCellBorder
  | docs_v1.Schema$EmbeddedObjectBorder;

export const borders = ({
  borderLeft,
  borderRight,
  borderTop,
  borderBottom,
  borderBetween,
}: {
  borderLeft?: Border;
  borderRight?: Border;
  borderTop?: Border;
  borderBottom?: Border;
  borderBetween?: docs_v1.Schema$ParagraphBorder;
}): Properties => {
  const style: Properties = {};

  if (borderLeft?.width?.magnitude) {
    style.borderLeft = borderToCss(borderLeft);
  }

  if (borderRight?.width?.magnitude) {
    style.borderRight = borderToCss(borderRight);
  }

  if (borderTop?.width?.magnitude) {
    style.borderTop = borderToCss(borderTop);
  }

  if (borderBottom?.width?.magnitude) {
    style.borderBottom = borderToCss(borderBottom);
  }

  if (borderBetween?.width?.magnitude) {
    style.borderTop = borderToCss(borderBetween);
  }

  if (borderBetween?.padding?.magnitude) {
    style.paddingTop = `${borderBetween.padding.magnitude}${borderBetween.padding.unit}`;
    style.paddingBottom = `${borderBetween.padding.magnitude}${borderBetween.padding.unit}`;
  }

  if (isParagraphBorder(borderBottom) && borderBottom?.padding?.magnitude) {
    style.paddingBottom = `${borderBottom.padding.magnitude}${borderBottom.padding.unit}`;
  }

  if (isParagraphBorder(borderTop) && borderTop?.padding?.magnitude) {
    style.paddingBottom = `${borderTop.padding.magnitude}${borderTop.padding.unit}`;
  }

  if (isParagraphBorder(borderLeft) && borderLeft?.padding?.magnitude) {
    style.paddingLeft = `${borderLeft.padding.magnitude}${borderLeft.padding.unit}`;
  }

  if (isParagraphBorder(borderRight) && borderRight?.padding?.magnitude) {
    style.paddingRight = `${borderRight.padding.magnitude}${borderRight.padding.unit}`;
  }

  return style;
};

const isParagraphBorder = (
  border: Border
): border is docs_v1.Schema$ParagraphBorder => {
  return border && "padding" in border;
};

export const rgbColor = ({
  color: {
    rgbColor: { red = 0, green = 0, blue = 0 },
  },
}: docs_v1.Schema$OptionalColor): string => {
  return `rgb(${red * 255}, ${green * 255}, ${blue * 255})`;
};

export const namedStyleTypeToTag = (namedStyleType: string): string => {
  return (
    {
      NORMAL_TEXT: "p",
      TITLE: "h1",
      SUBTITLE: "p",
      HEADING_1: "h1",
      HEADING_2: "h2",
      HEADING_3: "h3",
      HEADING_4: "h4",
      HEADING_5: "h5",
      HEADING_6: "h6",
    }[namedStyleType] ?? "p"
  );
};

export const camelToKebabCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const serializeStyle = (style: Properties): string =>
  Object.entries(style)
    .map(([key, value]) => `${camelToKebabCase(key)}: ${value}`)
    .join("; ");

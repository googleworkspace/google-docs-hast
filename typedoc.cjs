/**
 * @type {import('typedoc').TypeDocOptions}
 */
module.exports = {
  entryPoints: ["src/index.ts"],
  navigationLinks: {
    "Google Docs API":
      "https://developers.google.com/docs/api/reference/rest/v1/documents#Document",
    HAST: "https://github.com/syntax-tree/hast",
  },
  customCss: "assets/docs.css",
  treatWarningsAsErrors: true,
  categorizeByGroup: false,
};

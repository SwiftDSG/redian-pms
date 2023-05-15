// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8000",
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "id",
      },
      titleTemplate: "%s — Redian Grup",
      title: "Redian Grup",
      meta: [
        { charset: "utf-8" },
        { name: "keywords", content: "Website, Application, Digital Agency" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        { name: "googlebot", content: "notranslate" },
      ],
    },
  },
  css: ["~/assets/fonts.scss"],
  build: {
    loaders: {
      scss: {
        implementation: require("sass"),
      },
    },
  },
});

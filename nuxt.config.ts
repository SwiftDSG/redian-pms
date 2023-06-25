// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || "http://localhost:8000",
      base: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "id",
      },
      titleTemplate: "%s — Redian Grup",
      title: "Project Management System",
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
});

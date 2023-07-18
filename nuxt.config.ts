// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: "format-detection", content: "telephone=no" },
        { name: "googlebot", content: "notranslate" },
        { hid: 'description', name: 'description', content: 'PMS | Project Management System' }
      ],
      link: [
        { rel: 'preconnect', href: process.env.API_URL, crossorigin: 'use-credentials' }
      ],
      script: [
        { src: `${process.env.BASE_URL || 'http://localhost:3000'}/theme.js` }
      ]
    },
  },
  css: ["~/assets/fonts.scss"],
});

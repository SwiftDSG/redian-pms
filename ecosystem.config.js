module.exports = {
  apps: [
    {
      name: 'redian-pms',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        "NUXT_APP_BASE_URL": "/pms",
        "PORT": 3005
      }
    }
  ]
}
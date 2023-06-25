module.exports = {
  apps: [
    {
      name: 'redian-pms',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
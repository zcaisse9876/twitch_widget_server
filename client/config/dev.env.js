'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER: '"http://www.justservicestho.com"',
  PORT: '8080',
  HOST: '"165.227.204.214"',
})

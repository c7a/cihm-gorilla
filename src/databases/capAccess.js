const env = require('require-env')
const endpoint = env.requireUrl('CAP_ENDPOINT')
const rp = require('request-promise-native')

const fetch = rp.defaults({
  baseUrl: endpoint.href,
  headers: { Accept: 'application/json' },
  json: true,
  timeout: 5000,
  method: 'GET'
})

module.exports = async (ctx, next) => {
  let ip = ctx.ip.startsWith('::ffff:') ? ctx.ip.slice(7) : ctx.ip
  let access = await fetch({ uri: 'access.json', qs: { ip: ip } })
  ctx.state.accessibleCollections = access.collections || []

  return next()
}

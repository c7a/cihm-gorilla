const request = require('request-promise-native')

module.exports = class Couch {
  constructor (endpoint) {
    this.fetch = request.defaults({
      baseUrl: endpoint.href,
      headers: { Accept: 'application/json' },
      json: true,
      timeout: 60000,
      method: 'GET'
    })
  }

  viewLimit () {
    return 500
  }

  async request (options) {
    let v, responseBody
    try {
      responseBody = await this.fetch(options)

      v = { statusCode: 200, data: responseBody }
    } catch (e) {
      v = { statusCode: e.statusCode || 503, error: e.error || {} }
    }

    return v
  }

  async document (key) {
    return this.request({ uri: key })
  }

  async reducedView (designDoc, viewName, startkey, endkey) {
    return this.request({
      uri: `_design/${designDoc}/_view/${viewName}`,
      qs: {
        startkey,
        endkey,
        reduce: 'true'
      }
    })
  }

  async pagedView (designDoc, viewName, startkey, endkey, limit, skip, descending) {
    return this.request({
      uri: `_design/${designDoc}/_view/${viewName}`,
      qs: {
        startkey,
        endkey,
        limit,
        skip,
        descending,
        reduce: 'false'
      }
    })
  }
}

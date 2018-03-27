const Couch = require('./Couch')
const env = require('require-env')
const endpoint = env.requireUrl('COPRESENTATION_ENDPOINT')
const localEndpoint = env.requireUrl('SELF_ENDPOINT')

const docTypes = {
  series: 'series',
  document: 'item',
  page: 'component'
}

module.exports = class COPresentation extends Couch {
  constructor () {
    super(endpoint)
  }

  async collectionPageList (collection) {
    let response = await this.reducedView(
      'tdr',
      'coltitles',
      `["${collection}"]`,
      `["${collection}",{}]`
    )

    if (response.data) {
      let count = response.data ? response.data.rows[0].value : 0
      let pages = Math.ceil(count / this.viewLimit())

      return { members: Array.from({ length: pages }, (v, k) => `${localEndpoint.href}collection/${collection}/${k + 1}`) }
    } else {
      return { error: response.error.code }
    }
  }

  async titleList (collection, page) {
    let response = await this.pagedView(
      'tdr',
      'coltitles',
      `["${collection}",{}]`,
      `["${collection}"]`,
      this.viewLimit(),
      this.viewLimit() * (page - 1),
      'true'
    )

    if (response.data) {
      return response.data.rows.map(row => {
        let type = row.value && row.value.type ? docTypes[row.value.type] : 'item'
        return { uri: `${localEndpoint.href}${type}/${row.id}`, updated: row.key[1] }
      })
    } else {
      return { error: response.error.code }
    }
  }
}

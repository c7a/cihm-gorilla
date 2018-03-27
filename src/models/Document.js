const env = require('require-env')
const endpoint = env.requireUrl('SELF_ENDPOINT')

const docTypes = {
  series: 'series',
  document: 'item',
  page: 'component'
}

module.exports = class Document {
  constructor (data) {
    this.key = data.key
    this.label = data.label
    this.collection = data.collection
    this.type = docTypes[data.type]
  }

  hasType (type) {
    return this.type === type
  }

  uriForType (type, key) {
    return `${endpoint.href}${type}/${key}`
  }
}

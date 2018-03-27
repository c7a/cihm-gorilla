const Document = require('./Document')

const metadataFields = ['lang', 'tag', 'tagPerson', 'tagName', 'tagPlace', 'tagDate', 'tagNotebook', 'tagDescription', 'tx']

module.exports = class Component extends Document {
  constructor (data) {
    super(data)

    if (!this.hasType('component')) {
      this.redirect = `/${this.type}/${this.key}`
      return
    }

    if (data.pkey) {
      this.parent = {
        uri: this.uriForType('item', data.pkey)
      }
    }

    this.metadata = {}
    metadataFields.forEach(field => {
      if (data[field]) {
        this.metadata[field] = data[field]
      }
    })
  }
}

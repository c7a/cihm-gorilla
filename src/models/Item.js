const Document = require('./Document')

const metadataFields = ['lang', 'identifier', 'ti', 'au', 'pu', 'su', 'no', 'ab', 'no_rights', 'no_source']

module.exports = class Item extends Document {
  constructor (data) {
    super(data)

    if (!this.hasType('item')) {
      this.redirect = `/${this.type}/${this.key}`
      return
    }

    if (data.pkey) {
      this.parent = {
        uri: this.uriForType('series', data.pkey),
        label: data.plabel
      }
    }

    this.components = data.order.map(childKey => {
      return {
        uri: this.uriForType('component', childKey),
        label: data.components[childKey].label
      }
    })

    this.metadata = {}
    metadataFields.forEach(field => {
      if (data[field]) {
        this.metadata[field] = data[field]
      }
    })
  }
}

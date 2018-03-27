const Document = require('./Document')

const metadataFields = ['lang', 'identifier', 'ti', 'au', 'pu', 'su', 'no', 'ab', 'no_rights', 'no_source']

module.exports = class Series extends Document {
  constructor (data) {
    super(data)

    if (!this.hasType('series')) {
      this.redirect = `/${this.type}/${this.key}`
      return
    }

    this.items = data.order.map(childKey => {
      return {
        uri: this.uriForType('item', childKey),
        label: data.items[childKey].label
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

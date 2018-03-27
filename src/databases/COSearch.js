const Couch = require('./Couch')
const COPresentation = require('./COPresentation')
const env = require('require-env')
const endpoint = env.requireUrl('COSEARCH_ENDPOINT')

const copresentation = new COPresentation()

module.exports = class COSearch extends Couch {
  constructor () {
    super(endpoint)
  }

  async document (key) {
    let v = await Couch.prototype.document.call(this, key)
    if (v.data && !v.data.collection && v.data.pkey) {
      let parent = await copresentation.fetch({ uri: v.data.pkey })
      if (parent.collection) {
        v.data.collection = parent.collection
      }
    }
    return v
  }
}

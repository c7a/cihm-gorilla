const Koa = require('koa')
const router = require('koa-route')
const error = require('koa-json-error')
const cors = require('kcors')

const env = require('require-env')
const localEndpoint = env.requireUrl('SELF_ENDPOINT')

const COPresentationClient = require('./databases/COPresentation')
const copresentation = new COPresentationClient()
const COSearchClient = require('./databases/COSearch')
const cosearch = new COSearchClient()

const capAccess = require('./databases/capAccess')

const app = new Koa()

app.use(cors({ origin: '*' }))

app.use(capAccess)

const collections = ['online', 'eco', 'heritage']

app.use(router.get('/', async (ctx) => {
  ctx.body = {
    version: '1.0',
    notes: 'This API is temporary.',
    collections: collections.map(id => `${localEndpoint.href}collection/${id}`)
  }
}))

app.use(router.get('/collection/:id', async (ctx, id) => {
  if (collections.includes(id)) {
    if (ctx.state.accessibleCollections.includes(id)) {
      ctx.body = await copresentation.collectionPageList(id)
      ctx.status = 200
    } else {
      ctx.body = { error: 'Access denied.' }
      ctx.status = 403
    }
  } else {
    ctx.body = { error: `Could not find collection: ${id}` }
    ctx.status = 404
  }
}))

app.use(router.get('/collection/:id/:page', async (ctx, id, page) => {
  if (collections.includes(id)) {
    if (ctx.state.accessibleCollections.includes(id)) {
      ctx.body = await copresentation.titleList(id, page)
      ctx.status = 200
    } else {
      ctx.body = { error: 'Access denied.' }
      ctx.status = 403
    }
  } else {
    ctx.body = { error: `Could not find collection: ${id}` }
    ctx.status = 404
  }
}))

const typeModels = {
  series: {
    constructor: require('./models/Series'),
    client: copresentation
  },
  item: {
    constructor: require('./models/Item'),
    client: copresentation
  },
  component: {
    constructor: require('./models/Component'),
    client: cosearch
  }
}

app.use(router.get('/:type/:id', async (ctx, type, id) => {
  if (Object.keys(typeModels).includes(type)) {
    let model = typeModels[type]
    let document = await model.client.document(id)
    if (document.data) {
      let obj = new model.constructor(document.data)
      if (obj.redirect) {
        ctx.redirect(obj.redirect)
      } else {
        if (ctx.state.accessibleCollections.find(coll => obj.collection.includes(coll))) {
          ctx.body = obj
          ctx.status = 200
        } else {
          ctx.body = { error: 'Access denied.' }
          ctx.status = 403
        }
      }
    } else {
      ctx.body = { error: `Could not find ${type} with key: ${id}` }
      ctx.status = 404
    }
  } else {
    ctx.body = { error: 'Invalid request.' }
    ctx.status = 404
  }
}))

app.use(router.get('/:id', async (ctx, id) => {
  let document = await copresentation.document(id)
  ctx.body = document.data || document.error || {}
  ctx.status = document.statusCode
}))

app.use(error(err => {
  var retval = {status: err.status, message: err.message}
  if (!(process.env.NODE_ENV === 'production')) {
    retval.stack = err.stack
  }
  return retval
}))

app.listen(3000)

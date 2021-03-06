/* eslint-disable curly,no-new */
const {Nuxt, Builder} = require('nuxt')
const chalk = require('chalk')
const path = require('path');
const isDev = think.env === 'development';
const koaConnect = require('koa-connect')
let config = require(path.join(think.ROOT_PATH, '/nuxt.config.js'))
// const nuxtRender = koaConnect(nuxt.render)
// Init Nuxt.js
const nuxt = new Nuxt(config)
// build only in dev mode
if (isDev) {
  new Builder(nuxt).build()
}
module.exports = options => {
  let err = null
  const middleware = async (ctx, next) => {
    let subdomain = ctx.url.split('/')[1]
    if (subdomain === 'api') {
      return next()
    } else {
      // let isApi
      // 默认访问状态为 404
      ctx.status = 200
      ctx.req.session = await ctx.session()
      await nuxt.render(ctx.req, ctx.res)
      const startTime = Date.now();
      return next().catch(e => {
        err = e
      }).then(() => {
          const endTime = Date.now();
          // nuxt.render(ctx.req, ctx.res)
          if (err) return Promise.reject(err); // 如果后续执行逻辑有错误，则将错误返回
          return new Promise((resolve, reject) => {
            // console.log(`request exec time: ${endTime - startTime}ms`);
          })
        }
      )
    }
  }
  return middleware
}

import type Router from 'koa-router'

export default function (router: Router) {
  router.get('/api/graph', ({ query }) => {
    const { depth, includeDeps } = query

    // api/graph?depth=n
    if (depth) {
      const n = Number(depth)
      if (isNaN(n)) return
    }

    // api/graph?includeDeps=true
    // if (includeDeps) {
    // }
  })

  router.get('/api/environment', (ctx) => {
    console.log(ctx)
  })
}

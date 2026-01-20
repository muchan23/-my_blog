import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <title>My Blog</title>
      </head>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  )
})

export default app

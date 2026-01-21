---
title: "Hono を始めよう"
date: "2025-01-20"
tags: ["hono", "tutorial"]
description: "Hono フレームワークの基本的な使い方を紹介します。"
---

## Hono のインストール

まず、プロジェクトを作成して Hono をインストールします。

```bash
bun create hono my-app
cd my-app
bun install
```

## 基本的なルーティング

Hono でのルーティングはシンプルです：

```typescript
import { Hono } from 'hono'

const app = new Hono()

// GET リクエスト
app.get('/', (c) => c.text('Home'))

// パラメータ付きルート
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})

// POST リクエスト
app.post('/api/posts', async (c) => {
  const body = await c.req.json()
  return c.json({ received: body })
})

export default app
```

## ミドルウェア

ミドルウェアも簡単に追加できます：

```typescript
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', logger())
app.use('/api/*', cors())
```

## まとめ

Hono はシンプルでありながら強力な機能を持っています。ぜひ試してみてください！

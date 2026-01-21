---
title: "Hello World"
date: "2025-01-21"
tags: ["hono", "typescript"]
description: "これは最初のブログ記事です。Hono と SSG を使って構築しています。"
---

## はじめに

こんにちは！これは最初のブログ記事です。

Hono と Vite SSG を使ってブログを構築しています。

## Hono とは

Hono は軽量で高速な Web フレームワークです。以下の特徴があります：

- 超軽量（12KB 未満）
- 高速なルーティング
- TypeScript ファーストな設計
- Edge 環境での実行に最適化

## コードサンプル

TypeScript で書いた簡単な例：

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
```

## まとめ

Hono は非常に使いやすく、モダンな Web 開発に最適です。

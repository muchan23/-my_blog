---
title: "宇宙建設ロボット"
date: "2025-01-22"
tags: ["space", "goal"]
description: "宇宙建設ロボットの構想について説明します。"
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

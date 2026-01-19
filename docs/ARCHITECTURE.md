# 技術設計書

## 技術スタック

| 項目 | 技術 | 理由 |
|------|------|------|
| フレームワーク | Hono v4 | 軽量、SSG 対応、JSX サポート |
| 言語 | TypeScript | 型安全、開発体験向上 |
| ビルドツール | Vite | 高速、Hono 公式サポート |
| SSG | @hono/vite-ssg | Vite 統合、シンプル |
| Markdown | unified + remark + rehype | 柔軟、プラグインエコシステム |
| シンタックスハイライト | shiki | 高品質、VSCode 互換テーマ |
| CSS | Vanilla CSS | シンプル、依存なし |
| ホスティング | Cloudflare Pages | Hono 製、高速、無料 |

---

## ディレクトリ構成

```
my_blog/
├── docs/                    # プロジェクトドキュメント
│   ├── SPEC.md             # 仕様書
│   ├── ARCHITECTURE.md     # 技術設計書（このファイル）
│   └── PROGRESS.md         # 進捗管理
│
├── src/                     # ソースコード
│   ├── app.tsx             # Hono アプリ（メインのルート定義）
│   ├── build.ts            # SSG ビルドスクリプト
│   │
│   ├── components/         # JSX コンポーネント
│   │   ├── Layout.tsx      # 共通レイアウト
│   │   ├── Header.tsx      # ヘッダー
│   │   ├── Footer.tsx      # フッター
│   │   ├── PostCard.tsx    # 記事カード（一覧用）
│   │   ├── PostContent.tsx # 記事本文
│   │   ├── TableOfContents.tsx # 目次
│   │   └── ThemeToggle.tsx # ダークモード切替
│   │
│   ├── lib/                # ユーティリティ
│   │   ├── markdown.ts     # Markdown 処理
│   │   ├── posts.ts        # 記事データの読み込み
│   │   └── utils.ts        # 汎用ユーティリティ
│   │
│   └── types/              # 型定義
│       └── index.ts        # Post, Tag などの型
│
├── content/                 # コンテンツ
│   └── posts/              # Markdown 記事
│       └── *.md
│
├── public/                  # 静的アセット（そのまま dist にコピー）
│   ├── styles/
│   │   └── main.css        # メインスタイルシート
│   ├── images/             # 画像
│   └── favicon.ico
│
├── dist/                    # ビルド出力（.gitignore 対象）
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── wrangler.toml            # Cloudflare Pages 設定
```

---

## データフロー

### ビルド時（SSG）

```
1. content/posts/*.md を読み込み
        ↓
2. frontmatter をパース（title, date, tags, description）
        ↓
3. Markdown → HTML 変換（remark + rehype）
        ↓
4. シンタックスハイライト適用（shiki）
        ↓
5. Hono JSX でページをレンダリング
        ↓
6. toSSG() で dist/ に静的 HTML 出力
        ↓
7. public/ の内容を dist/ にコピー
```

### リクエスト時（Cloudflare Pages）

```
ユーザーのリクエスト
        ↓
Cloudflare CDN
        ↓
dist/ の静的ファイルを返却
```

---

## 主要コンポーネントの役割

### `src/app.tsx`

Hono アプリのエントリーポイント。全ルートを定義する。

```typescript
// 概念的なコード
const app = new Hono()

app.get('/', (c) => c.html(<TopPage posts={posts} />))
app.get('/posts/:slug', (c) => c.html(<PostPage post={post} />))
app.get('/archive', (c) => c.html(<ArchivePage posts={posts} />))
// ...

export default app
```

### `src/lib/posts.ts`

記事データの読み込みと加工を担当。

```typescript
// 概念的なコード
export async function getAllPosts(): Promise<Post[]>
export async function getPostBySlug(slug: string): Promise<Post | null>
export function getPostsByTag(posts: Post[], tag: string): Post[]
export function getPostsByYear(posts: Post[]): Map<number, Post[]>
```

### `src/lib/markdown.ts`

Markdown から HTML への変換を担当。

```typescript
// 概念的なコード
export async function parseMarkdown(content: string): Promise<{
  html: string
  headings: Heading[]  // 目次用
}>
```

### `src/components/Layout.tsx`

全ページ共通のレイアウト。

```tsx
// 概念的なコード
export function Layout({ children, title }) {
  return (
    <html>
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/styles/main.css" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <script src="/scripts/theme.js" />
      </body>
    </html>
  )
}
```

---

## 設定ファイル

### `package.json`

```json
{
  "name": "my-blog",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "hono": "^4.x"
  },
  "devDependencies": {
    "@hono/vite-ssg": "^0.x",
    "vite": "^5.x",
    "typescript": "^5.x",
    "gray-matter": "^4.x",
    "unified": "^11.x",
    "remark-parse": "^11.x",
    "remark-rehype": "^11.x",
    "rehype-stringify": "^10.x",
    "shiki": "^1.x",
    "wrangler": "^3.x"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import ssg from '@hono/vite-ssg'

export default defineConfig({
  plugins: [ssg()],
  build: {
    outDir: 'dist',
  },
})
```

### `wrangler.toml`

```toml
name = "my-blog"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"
```

---

## Cloudflare Pages デプロイ設定

### GitHub 連携（推奨）

1. Cloudflare Dashboard → Pages → Create a project
2. GitHub リポジトリを選択
3. ビルド設定:
   - Framework preset: None
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 保存 → 自動デプロイ開始

### 手動デプロイ

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=my-blog
```

---

## 開発フロー

### ローカル開発

```bash
npm run dev
# http://localhost:5173 で開発サーバー起動
```

### ビルド & プレビュー

```bash
npm run build
npm run preview
# http://localhost:4173 でビルド結果を確認
```

### デプロイ

```bash
git add .
git commit -m "記事を追加"
git push origin main
# → Cloudflare Pages が自動でビルド & デプロイ
```

---

## 依存パッケージの役割

| パッケージ | 役割 |
|-----------|------|
| `hono` | Web フレームワーク、JSX レンダリング |
| `@hono/vite-ssg` | Vite で SSG を実行 |
| `vite` | 開発サーバー、ビルド |
| `gray-matter` | Markdown の frontmatter をパース |
| `unified` | テキスト処理のコアライブラリ |
| `remark-parse` | Markdown をパース |
| `remark-rehype` | Markdown AST → HTML AST 変換 |
| `rehype-stringify` | HTML AST → HTML 文字列 |
| `shiki` | シンタックスハイライト |
| `wrangler` | Cloudflare へのデプロイ CLI |

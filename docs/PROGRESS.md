# 進捗管理

## Phase 一覧

| Phase | 内容 | 状態 |
|-------|------|------|
| 1 | プロジェクト初期化 | 未着手 |
| 2 | 最小構成の Hono アプリ | 未着手 |
| 3 | 記事ページの実装 | 未着手 |
| 4 | Markdown 対応 | 未着手 |
| 5 | 一覧・アーカイブ・タグページ | 未着手 |
| 6 | スタイリング | 未着手 |
| 7 | 追加機能とデプロイ | 未着手 |

---

## Phase 1: プロジェクト初期化

**ゴール**: 開発環境のセットアップが完了し、`npm run dev` で起動できる

**タスク**
- [ ] `package.json` を作成
- [ ] 依存パッケージをインストール
- [ ] `tsconfig.json` を作成
- [ ] `vite.config.ts` を作成
- [ ] ディレクトリ構成を作成
- [ ] Git 初期化 & `.gitignore` 設定

**成果物**
- package.json
- tsconfig.json
- vite.config.ts
- .gitignore
- 空のディレクトリ構成

---

## Phase 2: 最小構成の Hono アプリ

**ゴール**: トップページに「Hello World」が表示され、SSG でビルドできる

**タスク**
- [ ] `src/app.tsx` を作成（Hono アプリの基本構成）
- [ ] シンプルな JSX コンポーネントを作成
- [ ] `npm run dev` で動作確認
- [ ] `npm run build` で SSG ビルド確認
- [ ] `dist/index.html` が生成されることを確認

**成果物**
- src/app.tsx
- dist/index.html（ビルド後）

**学習ポイント**
- Hono のルート定義方法
- Hono JSX の基本
- Vite + @hono/vite-ssg の動作

---

## Phase 3: 記事ページの実装

**ゴール**: ハードコードした記事データを表示できる

**タスク**
- [ ] `src/types/index.ts` を作成（Post 型定義）
- [ ] `src/components/Layout.tsx` を作成
- [ ] `src/components/Header.tsx` を作成
- [ ] `src/components/Footer.tsx` を作成
- [ ] `/posts/:slug` ルートを追加
- [ ] 記事ページコンポーネントを作成
- [ ] ハードコードしたサンプル記事で動作確認

**成果物**
- src/types/index.ts
- src/components/Layout.tsx
- src/components/Header.tsx
- src/components/Footer.tsx
- 記事ページが表示される

**学習ポイント**
- Hono JSX でのコンポーネント分割
- Layout パターン
- 動的ルート（`:slug`）の扱い

---

## Phase 4: Markdown 対応

**ゴール**: Markdown ファイルから記事を読み込み、HTML に変換して表示できる

**タスク**
- [ ] `content/posts/` にサンプル記事を作成
- [ ] `src/lib/markdown.ts` を作成（Markdown → HTML 変換）
- [ ] `src/lib/posts.ts` を作成（記事データの読み込み）
- [ ] frontmatter のパース（gray-matter）
- [ ] シンタックスハイライトの実装（shiki）
- [ ] 目次の自動生成
- [ ] 読了時間の計算

**成果物**
- content/posts/sample-post.md
- src/lib/markdown.ts
- src/lib/posts.ts
- Markdown 記事が正しく表示される

**学習ポイント**
- unified / remark / rehype のパイプライン
- frontmatter の構造
- shiki の使い方

---

## Phase 5: 一覧・アーカイブ・タグページ

**ゴール**: 全てのページが揃い、ナビゲーションできる

**タスク**
- [ ] トップページ（記事一覧）を実装
- [ ] アーカイブページ（年別）を実装
- [ ] タグ一覧ページを実装
- [ ] タグ別記事一覧ページを実装
- [ ] About ページを実装
- [ ] RSS フィード生成を実装
- [ ] `src/components/PostCard.tsx` を作成
- [ ] ページネーション（必要に応じて）

**成果物**
- 全ページが表示・遷移できる
- RSS フィード（/feed.xml）

**学習ポイント**
- SSG での動的ルート生成（ssgParams）
- RSS/Atom フィードの形式

---

## Phase 6: スタイリング

**ゴール**: ミニマルで読みやすいデザインが完成

**タスク**
- [ ] `public/styles/main.css` を作成
- [ ] レイアウト（ヘッダー、フッター、メイン）
- [ ] タイポグラフィ（フォント、行間、見出し）
- [ ] コードブロックのスタイル
- [ ] レスポンシブ対応
- [ ] ダークモード対応
- [ ] ダークモード切替 UI（ThemeToggle）
- [ ] `public/scripts/theme.js` を作成

**成果物**
- public/styles/main.css
- public/scripts/theme.js
- src/components/ThemeToggle.tsx
- 見た目が整ったブログ

**学習ポイント**
- CSS カスタムプロパティ（変数）
- prefers-color-scheme
- localStorage でのテーマ永続化

---

## Phase 7: 追加機能とデプロイ

**ゴール**: Cloudflare Pages にデプロイして公開

**タスク**
- [ ] `wrangler.toml` を作成
- [ ] OGP メタタグの追加
- [ ] favicon の設定
- [ ] 最終動作確認
- [ ] GitHub リポジトリ作成 & push
- [ ] Cloudflare Pages との連携設定
- [ ] 本番デプロイ

**成果物**
- wrangler.toml
- 公開されたブログ

**学習ポイント**
- Cloudflare Pages のセットアップ
- GitHub 連携による自動デプロイ

---

## 進捗メモ

### 2025-01-19
- 仕様書作成開始
- SPEC.md 完成
- ARCHITECTURE.md 完成
- PROGRESS.md 完成
- 次: Phase 1（プロジェクト初期化）へ

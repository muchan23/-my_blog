import { Hono } from "hono";
import { Layout } from "./components/Layout";
import type { Post } from "./types";

const app = new Hono();

// ハードコードしたサンプル記事
const samplePosts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    date: "2025-01-21",
    tags: ["hono", "typescript"],
    description:
      "これは最初のブログ記事です。Hono と SSG を使って構築しています。",
    content:
      "<p>こんにちは！これは最初のブログ記事です。</p><p>Hono と Vite SSG を使ってブログを構築しています。</p>",
    readingTime: 1,
  },
  {
    slug: "getting-started-with-hono",
    title: "Hono を始めよう",
    date: "2025-01-20",
    tags: ["hono", "tutorial"],
    description: "Hono フレームワークの基本的な使い方を紹介します。",
    content:
      "<p>Hono は軽量で高速な Web フレームワークです。</p><p>Edge での実行に最適化されています。</p>",
    readingTime: 3,
  },
];

// トップページ
app.get("/", (c) => {
  return c.html(
    <Layout title="My Blog" description="技術ブログ">
      <h1>My Blog</h1>
      <div class="posts">
        {samplePosts.map((post) => (
          <article class="post-card">
            <h2>
              <a href={`/posts/${post.slug}`}>{post.title}</a>
            </h2>
            <p>{post.description}</p>
            <div class="post-meta">
              <time datetime={post.date}>{post.date}</time>
              <span> · {post.readingTime} min read</span>
            </div>
          </article>
        ))}
      </div>
    </Layout>,
  );
});

// 記事ページ
app.get("/posts/:slug", (c) => {
  const slug = c.req.param("slug");
  const post = samplePosts.find((p) => p.slug === slug);

  if (!post) {
    return c.html(
      <Layout title="Not Found">
        <h1>404 - 記事が見つかりません</h1>
        <p>
          <a href="/">トップページに戻る</a>
        </p>
      </Layout>,
      404,
    );
  }

  return c.html(
    <Layout title={post.title} description={post.description}>
      <article class="post">
        <header class="post-header">
          <h1>{post.title}</h1>
          <div class="post-meta">
            <time datetime={post.date}>{post.date}</time>
            <span> · {post.readingTime} min read</span>
          </div>
          <div class="post-tags">
            {post.tags.map((tag) => (
              <a href={`/tags/${tag}`} class="tag">
                {tag}
              </a>
            ))}
          </div>
        </header>
        <div
          class="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </Layout>,
  );
});

export default app;

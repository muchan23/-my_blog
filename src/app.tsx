import { Hono } from "hono";
import { Layout } from "./components/Layout";
import { getAllPosts, getPostBySlug } from "./lib/posts";
import type { TocItem } from "./lib/markdown";

const app = new Hono();

// 目次コンポーネント
const TableOfContents = ({ toc }: { toc: TocItem[] }) => {
  if (toc.length === 0) return null;
  return (
    <nav class="toc">
      <h2>目次</h2>
      <ul>
        {toc.map((item) => (
          <li style={`margin-left: ${(item.level - 2) * 1}rem`}>
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// トップページ
app.get("/", async (c) => {
  const posts = await getAllPosts();

  return c.html(
    <Layout title="My Blog" description="技術ブログ">
      <h1>My Blog</h1>
      <div class="posts">
        {posts.map((post) => (
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
app.get("/posts/:slug", async (c) => {
  const slug = c.req.param("slug");
  const post = await getPostBySlug(slug);

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
        <TableOfContents toc={post.toc} />
        <div
          class="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </Layout>,
  );
});

export default app;

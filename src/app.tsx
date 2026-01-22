import { Hono } from "hono";
import { ssgParams } from "hono/ssg";
import { Layout } from "./components/Layout";
import { PostCard } from "./components/PostCard";
import {
  getAllPosts,
  getPostBySlug,
  getPostsByYear,
  getAllTags,
  getPostsByTag,
} from "./lib/posts";
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
    <Layout title="muchan log" description="技術ブログ">
      <h1>muchan log</h1>
      <div class="posts">
        {posts.map((post) => (
          <PostCard post={post} />
        ))}
      </div>
    </Layout>,
  );
});

// 記事ページ
app.get(
  "/posts/:slug",
  ssgParams(async () => {
    const posts = await getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
  }),
  async (c) => {
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
  },
);

// アーカイブページ（年別）
app.get("/archive", async (c) => {
  const posts = await getAllPosts();
  const postsByYear = getPostsByYear(posts);
  const years = Array.from(postsByYear.keys()).sort((a, b) => b - a);

  return c.html(
    <Layout title="Archive" description="年別アーカイブ">
      <h1>Archive</h1>
      <div class="archive">
        {years.map((year) => (
          <section class="archive-year">
            <h2>{year}</h2>
            <ul>
              {postsByYear.get(year)!.map((post) => (
                <li>
                  <time datetime={post.date}>{post.date}</time>
                  {" - "}
                  <a href={`/posts/${post.slug}`}>{post.title}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Layout>,
  );
});

// タグ一覧ページ
app.get("/tags", async (c) => {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);
  const sortedTags = Array.from(tags.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return c.html(
    <Layout title="Tags" description="タグ一覧">
      <h1>Tags</h1>
      <div class="tags-list">
        {sortedTags.map(([tag, count]) => (
          <a href={`/tags/${tag}`} class="tag">
            {tag} ({count})
          </a>
        ))}
      </div>
    </Layout>,
  );
});

// タグ別記事一覧ページ
app.get(
  "/tags/:tag",
  ssgParams(async () => {
    const posts = await getAllPosts();
    const tags = getAllTags(posts);
    return Array.from(tags.keys()).map((tag) => ({ tag }));
  }),
  async (c) => {
    const tag = c.req.param("tag");
    const posts = await getAllPosts();
    const tagPosts = getPostsByTag(posts, tag);

    if (tagPosts.length === 0) {
      return c.html(
        <Layout title="Not Found">
          <h1>404 - タグが見つかりません</h1>
          <p>
            <a href="/tags">タグ一覧に戻る</a>
          </p>
        </Layout>,
        404,
      );
    }

    return c.html(
      <Layout title={`Tag: ${tag}`} description={`タグ「${tag}」の記事一覧`}>
        <h1>Tag: {tag}</h1>
        <div class="posts">
          {tagPosts.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
        <p>
          <a href="/tags">← タグ一覧に戻る</a>
        </p>
      </Layout>,
    );
  },
);

// About ページ
app.get("/about", (c) => {
  return c.html(
    <Layout title="About" description="このブログについて">
      <h1>About</h1>
      <div class="about-content">
        <p>技術ブログです。</p>
        <p>主に Web 開発、TypeScript、Hono などの技術について書いています。</p>
      </div>
    </Layout>,
  );
});

// RSS フィード
app.get("/feed.xml", async (c) => {
  const posts = await getAllPosts();
  const latestPosts = posts.slice(0, 20);
  const siteUrl = "https://muchan-log.pages.dev"; // TODO: 実際のURLに変更
  const siteName = "muchan log";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>技術ブログ</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${latestPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.description}]]></description>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return c.text(rss, 200, {
    "Content-Type": "application/rss+xml; charset=utf-8",
  });
});

export default app;

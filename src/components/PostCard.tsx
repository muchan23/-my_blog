import type { Post } from '../types'

type PostCardProps = {
  post: Post
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <article class="post-card">
      <h2>
        <a href={`/posts/${post.slug}`}>{post.title}</a>
      </h2>
      {post.description && <p>{post.description}</p>}
      <div class="post-meta">
        <time datetime={post.date}>{post.date}</time>
        <span> · {post.readingTime} min read</span>
      </div>
    </article>
  )
}

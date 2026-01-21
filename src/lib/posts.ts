import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { parseMarkdown, type TocItem } from './markdown'
import type { Post } from '../types'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

// 日本語: 400文字/分、英語: 200単語/分
function calculateReadingTime(content: string): number {
  // 日本語文字数をカウント
  const japaneseChars = (content.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g) || []).length
  // 英語単語数をカウント
  const englishWords = content
    .replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  const japaneseMinutes = japaneseChars / 400
  const englishMinutes = englishWords / 200

  return Math.max(1, Math.ceil(japaneseMinutes + englishMinutes))
}

export type PostWithToc = Post & {
  toc: TocItem[]
}

export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }

  const files = fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'))

  const posts: Post[] = []

  for (const file of files) {
    const slug = file.replace(/\.md$/, '')
    const post = await getPostBySlug(slug)
    if (post) {
      posts.push(post)
    }
  }

  // 日付の新しい順にソート
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<PostWithToc | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  const { html, toc } = await parseMarkdown(content)
  const readingTime = calculateReadingTime(content)

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString().split('T')[0],
    tags: data.tags || [],
    description: data.description || '',
    content: html,
    readingTime,
    toc,
  }
}

export function getPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.tags.includes(tag))
}

export function getPostsByYear(posts: Post[]): Map<number, Post[]> {
  const byYear = new Map<number, Post[]>()

  for (const post of posts) {
    const year = new Date(post.date).getFullYear()
    if (!byYear.has(year)) {
      byYear.set(year, [])
    }
    byYear.get(year)!.push(post)
  }

  return byYear
}

export function getAllTags(posts: Post[]): Map<string, number> {
  const tags = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      tags.set(tag, (tags.get(tag) || 0) + 1)
    }
  }

  return tags
}

import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: [
        "typescript",
        "javascript",
        "bash",
        "json",
        "markdown",
        "html",
        "css",
      ],
    });
  }
  return highlighter;
}

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type MarkdownResult = {
  html: string;
  toc: TocItem[];
};

export async function parseMarkdown(content: string): Promise<MarkdownResult> {
  const toc: TocItem[] = [];
  const hl = await getHighlighter();

  // 見出しを抽出して目次を生成
  const headingRegex = /^(#{2,6})\s+(.+)$/gm;
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "")
      .replace(/\s+/g, "-");
    toc.push({ id, text, level });
  }

  // コードブロックをシンタックスハイライト
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let processedContent = content;
  const codeBlocks: { placeholder: string; html: string }[] = [];

  let codeIndex = 0;
  processedContent = content.replace(codeBlockRegex, (_, lang, code) => {
    const language = lang || "text";
    const placeholder = `CODEBLOCK${codeIndex}PLACEHOLDER`;
    try {
      const html = hl.codeToHtml(code.trim(), {
        lang: language,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      });
      codeBlocks.push({ placeholder, html });
    } catch {
      // 言語がサポートされていない場合はプレーンテキストとして処理
      const html = `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
      codeBlocks.push({ placeholder, html });
    }
    codeIndex++;
    return placeholder;
  });

  // 見出しに id を追加
  processedContent = processedContent.replace(
    /^(#{2,6})\s+(.+)$/gm,
    (_, hashes, text) => {
      const id = text
        .toLowerCase()
        .replace(/[^\w\s\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "")
        .replace(/\s+/g, "-");
      return `${hashes} <span id="${id}">${text}</span>`;
    },
  );

  // Markdown を HTML に変換
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedContent);

  let html = String(result);

  // コードブロックのプレースホルダーを置換
  for (const { placeholder, html: codeHtml } of codeBlocks) {
    html = html.replace(`<p>${placeholder}</p>`, codeHtml);
    html = html.replace(placeholder, codeHtml);
  }

  return { html, toc };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

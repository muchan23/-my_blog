import type { FC, PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";
import { Footer } from "./Footer";

type LayoutProps = PropsWithChildren<{
  title: string;
  description?: string;
  ogType?: "website" | "article";
  ogImage?: string;
}>;

const SITE_URL = "https://muchan-log.pages.dev";
const SITE_NAME = "muchan log";

export const Layout: FC<LayoutProps> = ({
  title,
  description,
  ogType = "website",
  ogImage,
  children,
}) => {
  const pageTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const ogImageUrl = ogImage || `${SITE_URL}/images/og-default.png`;

  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
        {/* OGP */}
        <meta property="og:title" content={title} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        <meta name="twitter:image" content={ogImageUrl} />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* RSS */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={SITE_NAME}
          href="/feed.xml"
        />
        {/* Styles */}
        <link rel="stylesheet" href="/styles/main.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.28/dist/katex.min.css"
        />
        <script src="/scripts/theme.js" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

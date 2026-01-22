import type { FC, PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";
import { Footer } from "./Footer";

type LayoutProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export const Layout: FC<LayoutProps> = ({ title, description, children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <link rel="stylesheet" href="/styles/main.css" />
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

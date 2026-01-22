import type { FC } from "hono/jsx";
import { ThemeToggle } from "./ThemeToggle";

type HeaderProps = {
  siteTitle?: string;
};

export const Header: FC<HeaderProps> = ({ siteTitle = "My Blog" }) => {
  return (
    <header>
      <nav>
        <a href="/" class="site-title">
          {siteTitle}
        </a>
        <div class="nav-links">
          <a href="/">Posts</a>
          <a href="/archive">Archive</a>
          <a href="/tags">Tags</a>
          <a href="/about">About</a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

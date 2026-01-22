import type { FC } from "hono/jsx";

export const Footer: FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {year} muchan log &middot; Powered by Hono</p>
    </footer>
  );
};

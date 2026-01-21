import type { FC } from 'hono/jsx'

export const Footer: FC = () => {
  const year = new Date().getFullYear()
  return (
    <footer>
      <p>&copy; {year} My Blog &middot; Powered by Hono</p>
    </footer>
  )
}

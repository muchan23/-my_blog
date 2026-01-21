import type { FC, PropsWithChildren } from 'hono/jsx'

type PageProps = PropsWithChildren<{
  title: string
}>

export const Page: FC<PageProps> = ({ title, children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

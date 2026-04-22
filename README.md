# portfolio

This is tokku's portfolio repository.

![image](./docs/screenshot.png)

---

[tokku's portfolio](https://www.tokku-tech.dev/)

![vercel](https://img.shields.io/badge/-Next.js-181717.svg?logo=nextdotjs&style=flat)
![vercel](https://img.shields.io/badge/-TypeScript-007ACC.svg?logo=typescript&style=flat)
![vercel](https://img.shields.io/badge/-Vercel-181717.svg?logo=vercel&style=flat)

---

## Requirements

| runtime | version                                     |
| ------- | ------------------------------------------- |
| node    | see `.node-version`                         |
| pnpm    | pinned via `packageManager` in package.json |

Enable pnpm on your machine with `corepack enable` (run once). Corepack ships with Node, so no separate install is needed.

## Getting Started

package install

```bash
pnpm install
```

prepare for local

```bash
cp -pr .env.sample .env
# please override environment variables
```

start local server

```bash
pnpm dev
```

- testing

```bash
# lint
pnpm lint

# unit test
pnpm test
```

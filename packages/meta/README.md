# tanstack-meta

A small library that transforms structured, Next.js [Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)-like objects into metadata compatible with TanStack Router/Start, helping you manage document heads type-safely.

## Why

TanStack Start is awesome, but there’s one thing I’m not fully satisfied with: its [document head management](https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management), which I think still falls short of what Next.js offers.
Simply assigning strings to `name` or `content` is straightforward and easy to understand, but it lacks sufficient autocompletion and makes it hard to catch mistakes, which does not offer a good DX.
To improve this situation, I created a library that enables you to manage metadata as more structured objects and provides type-safe autocompletion.

Here's an example of how you can use `tanstack-meta`.
While it makes the code slightly longer in this case, it provides a more organized structure and enables richer IDE type completion:

| Without `tanstack-meta` | With `tanstack-meta` |
| ----------------------- | -------------------- |
| ![Screenshot](https://github.com/morinokami/tanstack-meta/blob/main/.github/assets/before.webp?raw=true) | ![Screenshot](https://github.com/morinokami/tanstack-meta/blob/main/.github/assets/after.webp?raw=true) |

## Usage

Install `tanstack-meta`:

```bash
npm install tanstack-meta@latest
```

Import `generateMetadata` from `tanstack-meta` and use it in your route's `head` function:

```ts
import { createFileRoute } from "@tanstack/react-router";
import { generateMetadata } from "tanstack-meta";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => {
    const { meta, links } = generateMetadata({
      title: "TanStack Start App",
      description: "An example app built with TanStack Start.",
    });

    return { meta, links };
  },
})
```

You can generally use it the same way as Next.js’s [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) function, but keep the following points in mind:

- Features that work across routes are not supported
  - `title` only accepts a plain string
  - `metadataBase` is not available

## Reference

`tanstack-meta` provides a function called `generateMetadata` that generates the document metadata compatible with TanStack Router/Start's `head` function.

### Parameters

An object containing the document metadata to be set.

### Return Value

An object containing `meta` and `links` properties, which can be used as the return value of the `head` function.

### Supported Metadata Fields

- `charSet`
- `title`
- `description`
- `applicationName`
- `authors`
- `manifest`
- `generator`
- `keywords`
- `referrer`
- `creator`
- `publisher`
- `robots`
- `abstract`
- `archives`
- `assets`
- `bookmarks`
- `pagination`
- `category`
- `classification`
- `other`
- `alternates`
- `itunes`
- `facebook`
- `pinterest`
- `formatDetection`
- `verification`
- `appleWebApp`
- `openGraph`
- `twitter`
- `appLinks`
- `icons`
- `viewport`

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

You can use it almost the same way as Next.js's [`generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) function, but note that currently there is no equivalent option for `metadataBase`.

### Title Template

If you want to use a title template like Next.js's `title.template`, use `createMetadataGenerator` to create a customized metadata generator:

```ts
import { createMetadataGenerator } from "tanstack-meta";

// Create a generator with title template
const generateMetadata = createMetadataGenerator({
  titleTemplate: {
    default: "Default Title", // Used when title is not provided
    template: "%s | My Site"  // %s is replaced with the page title
  }
});

// In your routes:
generateMetadata({ title: "About" })
// Output: <title>About | My Site</title>

generateMetadata({ title: null })
// Output: <title>Default Title | My Site</title>

generateMetadata({})
// Output: <title>Default Title | My Site</title>
```

To opt out of the title template on a specific page, use `title.absolute`:

```ts
generateMetadata({ title: { absolute: "Home" } })
// Output: <title>Home</title> (template is ignored)
```

## Reference

### `generateMetadata`

Generates the document metadata compatible with TanStack Router/Start's `head` function.

#### Parameters

An object containing the document metadata to be set.

#### Return Value

An object containing `meta` and `links` properties, which can be used as the return value of the `head` function.

### `createMetadataGenerator`

Creates a customized metadata generator with options like title templates.

#### Parameters

An options object with the following properties:

- `titleTemplate` (optional): An object containing:
  - `default`: The default title used when no title is provided
  - `template`: A template string where `%s` is replaced with the page title

#### Return Value

A function that accepts metadata (with extended `title` support) and returns the same structure as `generateMetadata`.

### Supported Metadata Fields

- `charSet`
  - The character encoding of the document.
  - ```tsx
    // Input
    { charSet: "utf-8" }
    ```
  - ```html
    <!-- Output -->
    <meta charset="utf-8" />
    ```
- `title`
  - The document title.
  - ```tsx
    // Input
    { title: "My Blog" }
    ```
  - ```html
    <!-- Output -->
    <title>My Blog</title>
    ```
  - When using `createMetadataGenerator` with a title template, you can also use `{ absolute: string }` to bypass the template:
  - ```tsx
    // Input (with createMetadataGenerator)
    { title: { absolute: "Special Page" } }
    ```
  - ```html
    <!-- Output -->
    <title>Special Page</title>
    ```
- `description`
  - The document description.
  - ```tsx
    // Input
    { description: "My Blog Description" }
    ```
  - ```html
    <!-- Output -->
    <meta name="description" content="My Blog Description" />
    ```
- `applicationName`
  - The application name.
  - ```tsx
    // Input
    { applicationName: "My Blog" }
    ```
  - ```html
    <!-- Output -->
    <meta name="application-name" content="My Blog" />
    ```
- `authors`
  - The authors of the document.
  - ```tsx
    // Input
    { authors: [{ name: "TanStack Team", url: "https://tanstack.com" }] }
    ```
  - ```html
    <!-- Output -->
    <meta name="author" content="TanStack Team" />
    <link rel="author" href="https://tanstack.com" />
    ```
- `generator`
  - The generator used for the document.
  - ```tsx
    // Input
    { generator: "TanStack Start" }
    ```
  - ```html
    <!-- Output -->
    <meta name="generator" content="TanStack Start" />
    ```
- `referrer`
  - The referrer setting for the document.
  - ```tsx
    // Input
    { referrer: "origin" }
    ```
  - ```html
    <!-- Output -->
    <meta name="referrer" content="origin" />
    ```
- `viewport`
  - The viewport configuration for the document.
  - ```tsx
    // Input
    {
      width: "device-width",
      initialScale: 1,
      themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
        { media: "(prefers-color-scheme: light)", color: "#ffffff" }
      ],
      colorScheme: "dark"
    }
    ```
  - ```html
    <!-- Output -->
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
    <meta name="color-scheme" content="dark" />
    ```
- `other`
  - Arbitrary name/value pairs for additional metadata.
  - ```tsx
    // Input
    { other: { custom: ["meta1", "meta2"] } }
    ```
  - ```html
    <!-- Output -->
    <meta name="custom" content="meta1" />
    <meta name="custom" content="meta2" />
    ```
- `robots`
  - The robots setting for the document.
  - ```tsx
    // Input
    { robots: "index, follow" }
    ```
  - ```html
    <!-- Output -->
    <meta name="robots" content="index, follow" />
    ```
  - ```tsx
    // Input
    { robots: { index: true, follow: true } }
    ```
  - ```html
    <!-- Output -->
    <meta name="robots" content="index, follow" />
    ```
- `keywords`
  - The keywords for the document.
  - ```tsx
    // Input
    { keywords: "tanstack, react, blog" }
    ```
  - ```html
    <!-- Output -->
    <meta name="keywords" content="tanstack, react, blog" />
    ```
  - ```tsx
    // Input
    { keywords: ["react", "tanstack query"] }
    ```
  - ```html
    <!-- Output -->
    <meta name="keywords" content="react,tanstack query" />
    ```
- `pagination`
  - The pagination link rel properties.
  - ```tsx
    // Input
    {
      pagination: {
        previous: "https://example.com/items?page=1",
        next: "https://example.com/items?page=3"
      }
    }
    ```
  - ```html
    <!-- Output -->
    <link rel="prev" href="https://example.com/items?page=1" />
    <link rel="next" href="https://example.com/items?page=3" />
    ```
- `openGraph`
  - The Open Graph metadata for the document.
  - ```tsx
    // Input
    {
      openGraph: {
        type: "website",
        url: "https://example.com",
        title: "My Website",
        description: "My Website Description",
        siteName: "My Website",
        images: [{ url: "https://example.com/og.png" }]
      }
    }
    ```
  - ```html
    <!-- Output -->
    <meta property="og:title" content="My Website" />
    <meta property="og:description" content="My Website Description" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:site_name" content="My Website" />
    <meta property="og:image" content="https://example.com/og.png" />
    <meta property="og:type" content="website" />
    ```
- `twitter`
  - The Twitter metadata for the document.
  - ```tsx
    // Input
    {
      twitter: {
        card: "summary_large_image",
        site: "@site",
        creator: "@creator",
        images: "https://example.com/og.png"
      }
    }
    ```
  - ```html
    <!-- Output -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@site" />
    <meta name="twitter:creator" content="@creator" />
    <meta name="twitter:image" content="https://example.com/og.png" />
    ```
- `facebook`
  - The Facebook metadata for the document.
  - ```tsx
    // Input
    { facebook: { appId: "12345678" } }
    ```
  - ```html
    <!-- Output -->
    <meta property="fb:app_id" content="12345678" />
    ```
  - ```tsx
    // Input
    { facebook: { admins: ["12345678"] } }
    ```
  - ```html
    <!-- Output -->
    <meta property="fb:admins" content="12345678" />
    ```
- `pinterest`
  - The Pinterest metadata for the document to choose whether opt out of rich pin data.
  - ```tsx
    // Input
    { pinterest: { richPin: true } }
    ```
  - ```html
    <!-- Output -->
    <meta name="pinterest-rich-pin" content="true" />
    ```
- `manifest`
  - The web application manifest for the document.
  - ```tsx
    // Input
    { manifest: "https://example.com/manifest.json" }
    ```
  - ```html
    <!-- Output -->
    <link rel="manifest" href="https://example.com/manifest.json" />
    ```
- `icons`
  - The icons for the document.
  - ```tsx
    // Input
    { icons: "https://example.com/icon.png" }
    ```
  - ```html
    <!-- Output -->
    <link rel="icon" href="https://example.com/icon.png" />
    ```
  - ```tsx
    // Input
    {
      icons: {
        icon: "https://example.com/icon.png",
        apple: "https://example.com/apple-icon.png"
      }
    }
    ```
  - ```html
    <!-- Output -->
    <link rel="icon" href="https://example.com/icon.png" />
    <link rel="apple-touch-icon" href="https://example.com/apple-icon.png" />
    ```
- `appleWebApp`
  - The Apple web app metadata for the document.
  - ```tsx
    // Input
    {
      appleWebApp: {
        capable: true,
        title: "My Website",
        statusBarStyle: "black-translucent"
      }
    }
    ```
  - ```html
    <!-- Output -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="My Website" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    ```
- `appLinks`
  - The Facebook AppLinks metadata for the document.
  - ```tsx
    // Input
    {
      appLinks: {
        ios: { appStoreId: "123456789", url: "https://example.com" },
        android: { packageName: "com.example", url: "https://example.com" }
      }
    }
    ```
  - ```html
    <!-- Output -->
    <meta property="al:ios:app_store_id" content="123456789" />
    <meta property="al:ios:url" content="https://example.com" />
    <meta property="al:android:package" content="com.example" />
    <meta property="al:android:url" content="https://example.com" />
    ```
- `itunes`
  - The metadata for the iTunes App.
  - ```tsx
    // Input
    {
      itunes: {
        app: {
          id: "123456789",
          affiliateData: "123456789",
          appArguments: "123456789"
        }
      }
    }
    ```
  - ```html
    <!-- Output -->
    <meta name="apple-itunes-app" content="app-id=123456789, affiliate-data=123456789, app-arguments=123456789" />
    ```
- `alternates`
  - The canonical and alternate URLs for the document.
  - ```tsx
    // Input
    {
      alternates: {
        canonical: "https://example.com",
        languages: {
          "en-US": "https://example.com/en-US"
        }
      }
    }
    ```
  - ```html
    <!-- Output -->
    <link rel="canonical" href="https://example.com" />
    <link rel="alternate" hreflang="en-US" href="https://example.com/en-US" />
    ```
- `verification`
  - The common verification tokens for the document.
  - ```tsx
    // Input
    { verification: { google: "1234567890", yandex: "1234567890", "me": "1234567890" } }
    ```
  - ```html
    <!-- Output -->
    <meta name="google-site-verification" content="1234567890" />
    <meta name="yandex-verification" content="1234567890" />
    <meta name="me" content="1234567890" />
    ```
- `creator`
  - The creator of the document.
  - ```tsx
    // Input
    { creator: "TanStack Team" }
    ```
  - ```html
    <!-- Output -->
    <meta name="creator" content="TanStack Team" />
    ```
- `publisher`
  - The publisher of the document.
  - ```tsx
    // Input
    { publisher: "TanStack" }
    ```
  - ```html
    <!-- Output -->
    <meta name="publisher" content="TanStack" />
    ```
- `abstract`
  - The brief description of the document.
  - ```tsx
    // Input
    { abstract: "My Website Description" }
    ```
  - ```html
    <!-- Output -->
    <meta name="abstract" content="My Website Description" />
    ```
- `archives`
  - The archives link rel property.
  - ```tsx
    // Input
    { archives: "https://example.com/archives" }
    ```
  - ```html
    <!-- Output -->
    <link rel="archives" href="https://example.com/archives" />
    ```
- `assets`
  - The assets link rel property.
  - ```tsx
    // Input
    { assets: "https://example.com/assets" }
    ```
  - ```html
    <!-- Output -->
    <link rel="assets" href="https://example.com/assets" />
    ```
- `bookmarks`
  - The bookmarks link rel property.
  - ```tsx
    // Input
    { bookmarks: "https://example.com/bookmarks" }
    ```
  - ```html
    <!-- Output -->
    <link rel="bookmarks" href="https://example.com/bookmarks" />
    ```
- `category`
  - The category meta name property.
  - ```tsx
    // Input
    { category: "My Category" }
    ```
  - ```html
    <!-- Output -->
    <meta name="category" content="My Category" />
    ```
- `classification`
  - The classification meta name property.
  - ```tsx
    // Input
    { classification: "My Classification" }
    ```
  - ```html
    <!-- Output -->
    <meta name="classification" content="My Classification" />
    ```
- `formatDetection`
  - Indicates whether devices should interpret certain formats (such as telephone numbers) as actionable links.
  - ```tsx
    // Input
    { formatDetection: { telephone: false } }
    ```
  - ```html
    <!-- Output -->
    <meta name="format-detection" content="telephone=no" />
    ```

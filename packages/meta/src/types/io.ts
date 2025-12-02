import type { AnyRouteMatch } from "@tanstack/react-router";

import type {
	Metadata as NextMetadata,
	ResolvedMetadata,
	ResolvedMetadataWithURLs,
	ResolvedViewport,
	Viewport,
} from "./metadata-interface";

type WithSuggestions<T extends string> = T | (string & {});

export type InputMetadata = {
	// Core Metadata
	/**
	 * The character encoding of the document.
	 *
	 * @example
	 * ```tsx
	 * charSet: "utf-8"
	 * // Renders: <meta charset="utf-8" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta#charset
	 */
	charSet?: WithSuggestions<"utf-8"> | null;
	/**
	 * The document title.
	 *
	 * @example
	 * ```tsx
	 * title: "My Blog"
	 * // Renders: <title>My Blog</title>
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/title
	 */
	title?: string | null;
	/**
	 * The document description.
	 *
	 * @example
	 * ```tsx
	 * description: "My Blog Description"
	 * // Renders: <meta name="description" content="My Blog Description" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta/name#description
	 */
	description?: NextMetadata["description"];
	/**
	 * The application name.
	 *
	 * @example
	 * ```tsx
	 * applicationName: "My Blog"
	 * // Renders: <meta name="application-name" content="My Blog" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta/name#application-name
	 */
	applicationName?: NextMetadata["applicationName"];
	/**
	 * The authors of the document.
	 *
	 * @example
	 * ```tsx
	 * authors: [{ name: "TanStack Team", url: "https://tanstack.com" }]
	 * // Renders:
	 * // <meta name="author" content="TanStack Team" />
	 * // <link rel="author" href="https://tanstack.com" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta/name#author
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Attributes/rel#author
	 */
	authors?: NextMetadata["authors"];
	/**
	 * The generator used for the document.
	 *
	 * @example
	 * ```tsx
	 * generator: "TanStack Start"
	 * // Renders: <meta name="generator" content="TanStack Start" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta/name#generator
	 */
	generator?: NextMetadata["generator"];
	/**
	 * The referrer setting for the document.
	 *
	 * @example
	 * ```tsx
	 * referrer: "origin"
	 * // Renders: <meta name="referrer" content="origin" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/referrer
	 */
	referrer?: NextMetadata["referrer"];
	/**
	 * The viewport configuration for the document.
	 *
	 * @remarks
	 * This configuration allows defining properties such as width, initial scale, theme colors,
	 * and color scheme.
	 *
	 * @example
	 * ```tsx
	 * viewport: {
	 *   width: "device-width",
	 *   initialScale: 1,
	 *   themeColor: [
	 *     { media: "(prefers-color-scheme: dark)", color: "#000000" },
	 *     { media: "(prefers-color-scheme: light)", color: "#ffffff" }
	 *   ],
	 *   colorScheme: "dark"
	 * }
	 * // Renders:
	 * // <meta name="viewport" content="width=device-width, initial-scale=1" />
	 * // <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
	 * // <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
	 * // <meta name="color-scheme" content="dark" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme
	 */
	viewport?: Viewport;
	/**
	 * Arbitrary name/value pairs for additional metadata.
	 *
	 * @remarks
	 * Use this field to define custom meta tags that are not directly supported.
	 *
	 * @example
	 * ```tsx
	 * other: { custom: ["meta1", "meta2"] }
	 * // Renders:
	 * // <meta name="custom" content="meta1" />
	 * // <meta name="custom" content="meta2" />
	 * ```
	 */
	other?: NextMetadata["other"];

	// Search Engine Optimization
	/**
	 * The robots setting for the document.
	 *
	 * @remarks
	 * Can be a string (e.g., "index, follow") or an object with more granular rules.
	 *
	 * @example
	 * ```tsx
	 * robots: "index, follow"
	 * // Renders: <meta name="robots" content="index, follow">
	 * // or
	 * robots: { index: true, follow: true }
	 * // Renders: <meta name="robots" content="index, follow">
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Glossary/Robots.txt
	 */
	robots?: NextMetadata["robots"];
	/**
	 * The keywords for the document.
	 *
	 * @remarks
	 * When an array is provided, keywords are flattened into a comma-separated string.
	 *
	 * @example
	 * ```tsx
	 * keywords: "tanstack, react, blog"
	 * // Renders: <meta name="keywords" content="tanstack, react, blog" />
	 * // or
	 * keywords: ["react", "tanstack query"]
	 * // Renders: <meta name="keywords" content="react,tanstack query" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/meta/name#keywords
	 * @see https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag
	 */
	keywords?: NextMetadata["keywords"];
	/**
	 * The pagination link rel properties.
	 *
	 * @example
	 * ```tsx
	 * pagination: {
	 *   previous: "https://example.com/items?page=1",
	 *   next: "https://example.com/items?page=3"
	 * }
	 *
	 * // Renders
	 * <link rel="prev" href="https://example.com/items?page=1" />
	 * <link rel="next" href="https://example.com/items?page=3" />
	 * ```
	 *
	 * @see https://developers.google.com/search/blog/2011/09/pagination-with-relnext-and-relprev
	 */
	pagination?: NextMetadata["pagination"];

	// Social Media
	/**
	 * The Open Graph metadata for the document.
	 *
	 * @remarks
	 * Follows the Open Graph protocol to enrich link previews.
	 *
	 * @example
	 * ```tsx
	 * openGraph: {
	 *   type: "website",
	 *   url: "https://example.com",
	 *   title: "My Website",
	 *   description: "My Website Description",
	 *   siteName: "My Website",
	 *   images: [{ url: "https://example.com/og.png" }]
	 * }
	 * // Renders:
	 * // <meta property="og:title" content="My Website">
	 * // <meta property="og:description" content="My Website Description" />
	 * // <meta property="og:url" content="https://example.com" />
	 * // <meta property="og:site_name" content="My Website" />
	 * // <meta property="og:image" content="https://example.com/og.png" />
	 * // <meta property="og:type" content="website">
	 * ```
	 *
	 * @see https://ogp.me/
	 */
	openGraph?: NextMetadata["openGraph"];
	/**
	 * The Twitter metadata for the document.
	 *
	 * @remarks
	 * - Used for configuring Twitter Cards and can include details such as `card`, `site`, and `creator`.
	 * - Notably, more sites than just Twitter (now X) use this format.
	 *
	 * @example
	 * ```tsx
	 * twitter: {
	 *   card: "summary_large_image",
	 *   site: "@site",
	 *   creator: "@creator",
	 *   images: "https://example.com/og.png"
	 * }
	 * // Renders:
	 * // <meta name="twitter:card" content="summary_large_image" />
	 * // <meta name="twitter:site" content="@site" />
	 * // <meta name="twitter:creator" content="@creator" />
	 * // <meta name="twitter:image" content="https://example.com/og.png" />
	 * ```
	 *
	 * @see https://developer.x.com/docs/x-for-websites/cards/overview/markup
	 */
	twitter?: NextMetadata["twitter"];
	/**
	 * The Facebook metadata for the document.
	 *
	 * @remarks
	 * Specify either `appId` or `admins` (but not both) to configure Facebook integration.
	 *
	 * @example
	 * ```tsx
	 * facebook: { appId: "12345678" }
	 * // Renders <meta property="fb:app_id" content="12345678" />
	 * // or
	 * facebook: { admins: ["12345678"] }
	 * // Renders <meta property="fb:admins" content="12345678" />
	 * ```
	 *
	 * @see https://developers.facebook.com/docs/sharing/webmasters/
	 */
	facebook?: NextMetadata["facebook"];
	/**
	 * The Pinterest metadata for the document to choose whether opt out of rich pin data.
	 *
	 * @example
	 * ```tsx
	 * pinterest: { richPin: true }
	 * // Renders <meta name="pinterest-rich-pin" content="true" />
	 * ```
	 *
	 * @see https://developers.pinterest.com/docs/web-features/rich-pins-overview/
	 */
	pinterest?: NextMetadata["pinterest"];

	// Manifest, icons, and web-app-like behavior
	/**
	 * The web application manifest for the document.
	 *
	 * @example
	 * ```tsx
	 * manifest: "https://example.com/manifest.json"
	 * // Renders: <link rel="manifest" href="https://example.com/manifest.json" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/Manifest
	 */
	manifest?: NextMetadata["manifest"];
	/**
	 * The icons for the document.
	 *
	 * @remarks
	 * You can specify a simple URL or an object to differentiate between icon types (e.g., apple-touch-icon).
	 *
	 * @example
	 * ```tsx
	 * icons: "https://example.com/icon.png"
	 * // Renders: <link rel="icon" href="https://example.com/icon.png" />
	 * // or
	 * icons: {
	 *   icon: "https://example.com/icon.png",
	 *   apple: "https://example.com/apple-icon.png"
	 * }
	 * // Renders:
	 * // <link rel="icon" href="https://example.com/icon.png" />
	 * // <link rel="apple-touch-icon" href="https://example.com/apple-icon.png" />
	 * ```
	 *
	 * @see https://developer.mozilla.org/docs/Web/HTML/Attributes/rel#attr-icon
	 */
	icons?: NextMetadata["icons"];
	/**
	 * The Apple web app metadata for the document.
	 *
	 * @example
	 * ```tsx
	 * appleWebApp: { capable: true, title: "My Website", statusBarStyle: "black-translucent" }
	 * // Renders:
	 * // <meta name="mobile-web-app-capable" content="yes">
	 * // <meta name="apple-mobile-web-app-title" content="My Website" />
	 * // <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	 * ```
	 *
	 * @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
	 */
	appleWebApp?: NextMetadata["appleWebApp"];
	/**
	 * The Facebook AppLinks metadata for the document.
	 *
	 * @example
	 * ```tsx
	 * appLinks: {
	 *   ios: { appStoreId: "123456789", url: "https://example.com" },
	 *   android: { packageName: "com.example", url: "https://example.com" }
	 * }
	 *
	 * // Renders
	 * <meta property="al:ios:app_store_id" content="123456789" />
	 * <meta property="al:ios:url" content="https://example.com" />
	 * <meta property="al:android:package" content="com.example" />
	 * <meta property="al:android:url" content="https://example.com" />
	 * ```
	 *
	 * @see https://developers.facebook.com/docs/applinks/
	 */
	appLinks?: NextMetadata["appLinks"];
	/**
	 * The metadata for the iTunes App.
	 *
	 * @remarks
	 * Adds the `name="apple-itunes-app"` meta tag.
	 *
	 * @example
	 * ```tsx
	 * itunes: { app: { id: "123456789", affiliateData: "123456789", appArguments: "123456789" } }
	 * // Renders <meta name="apple-itunes-app" content="app-id=123456789, affiliate-data=123456789, app-arguments=123456789" />
	 * ```
	 */
	itunes?: NextMetadata["itunes"];

	// Other Metadata
	/**
	 * The canonical and alternate URLs for the document.
	 *
	 * @remarks
	 * This field allows defining a canonical URL as well as alternate URLs (such as for multiple languages).
	 *
	 * @example
	 * ```tsx
	 * alternates: {
	 *   canonical: "https://example.com",
	 *   languages: {
	 *     "en-US": "https://example.com/en-US"
	 *   }
	 * }
	 * // Renders:
	 * // <link rel="canonical" href="https://example.com">
	 * // <link rel="alternate" hreflang="en-US" href="https://example.com/en-US">
	 * ```
	 *
	 * @see https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
	 */
	alternates?: NextMetadata["alternates"];
	/**
	 * The common verification tokens for the document.
	 *
	 * @example
	 * ```tsx
	 * verification: { google: "1234567890", yandex: "1234567890", "me": "1234567890" }
	 * // Renders:
	 * // <meta name="google-site-verification" content="1234567890" />
	 * // <meta name="yandex-verification" content="1234567890" />
	 * // <meta name="me" content="1234567890" />
	 * ```
	 *
	 * @see https://support.google.com/webmasters/answer/9008080
	 * @see https://yandex.com/support/webmaster/service/rights
	 */
	verification?: NextMetadata["verification"];
	/**
	 * The creator of the document.
	 *
	 * @example
	 * ```tsx
	 * creator: "TanStack Team"
	 * // Renders: <meta name="creator" content="TanStack Team" />
	 * ```
	 */
	creator?: NextMetadata["creator"];
	/**
	 * The publisher of the document.
	 *
	 * @example
	 * ```tsx
	 * publisher: "TanStack"
	 * // Renders: <meta name="publisher" content="TanStack" />
	 * ```
	 */
	publisher?: NextMetadata["publisher"];
	/**
	 * The brief description of the document.
	 *
	 * @remarks
	 * Rendered as the `abstract` meta tag. This is *not recommended* as it is superseded by `description`.
	 *
	 * @example
	 * ```tsx
	 * abstract: "My Website Description"
	 * // Renders <meta name="abstract" content="My Website Description" />
	 * ```
	 */
	abstract?: NextMetadata["abstract"];
	/**
	 * The archives link rel property.
	 *
	 * @example
	 * ```tsx
	 * archives: "https://example.com/archives"
	 * // Renders <link rel="archives" href="https://example.com/archives" />
	 * ```
	 */
	archives?: NextMetadata["archives"];
	/**
	 * The assets link rel property.
	 *
	 * @example
	 * ```tsx
	 * assets: "https://example.com/assets"
	 * // Renders <link rel="assets" href="https://example.com/assets" />
	 * ```
	 */
	assets?: NextMetadata["assets"];
	/**
	 * The bookmarks link rel property.
	 *
	 * @remarks
	 * Although technically against the HTML spec, this is used in practice.
	 *
	 * @example
	 * ```tsx
	 * bookmarks: "https://example.com/bookmarks"
	 * // Renders <link rel="bookmarks" href="https://example.com/bookmarks" />
	 * ```
	 */
	bookmarks?: NextMetadata["bookmarks"];
	/**
	 * The category meta name property.
	 *
	 * @example
	 * ```tsx
	 * category: "My Category"
	 * // Renders <meta name="category" content="My Category" />
	 * ```
	 */
	category?: NextMetadata["category"];
	/**
	 * The classification meta name property.
	 *
	 * @example
	 * ```tsx
	 * classification: "My Classification"
	 * // Renders <meta name="classification" content="My Classification" />
	 * ```
	 */
	classification?: NextMetadata["classification"];
	/**
	 * Indicates whether devices should interpret certain formats (such as telephone numbers) as actionable links.
	 *
	 * @example
	 * ```tsx
	 * formatDetection: { telephone: false }
	 * // Renders: <meta name="format-detection" content="telephone=no" />
	 * ```
	 *
	 * @see https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
	 */
	formatDetection?: NextMetadata["formatDetection"];
};

export type NormalizedMetadata = {
	charSet: string | null;
	title: string | null;
	description: ResolvedMetadata["description"];
	applicationName: ResolvedMetadata["applicationName"];
	authors: ResolvedMetadata["authors"];
	manifest: ResolvedMetadata["manifest"];
	generator: ResolvedMetadata["generator"];
	keywords: ResolvedMetadata["keywords"];
	referrer: ResolvedMetadata["referrer"];
	creator: ResolvedMetadata["creator"];
	publisher: ResolvedMetadata["publisher"];
	robots: ResolvedMetadata["robots"];
	abstract: ResolvedMetadata["abstract"];
	archives: ResolvedMetadata["archives"];
	assets: ResolvedMetadata["assets"];
	bookmarks: ResolvedMetadata["bookmarks"];
	pagination: ResolvedMetadata["pagination"];
	category: ResolvedMetadata["category"];
	classification: ResolvedMetadata["classification"];
	other: ResolvedMetadata["other"];

	alternates: ResolvedMetadata["alternates"];
	itunes: ResolvedMetadata["itunes"];
	facebook: ResolvedMetadata["facebook"];
	pinterest: ResolvedMetadata["pinterest"];
	formatDetection: ResolvedMetadata["formatDetection"];
	verification: ResolvedMetadata["verification"];
	appleWebApp: ResolvedMetadata["appleWebApp"];
	openGraph: ResolvedMetadata["openGraph"];
	twitter: ResolvedMetadata["twitter"];
	appLinks: ResolvedMetadataWithURLs["appLinks"];
	icons: ResolvedMetadata["icons"];
	viewport: ResolvedViewport | null;
};

export type OutputMeta = NonNullable<AnyRouteMatch["meta"]>;
export type OutputLinks = NonNullable<AnyRouteMatch["links"]>;

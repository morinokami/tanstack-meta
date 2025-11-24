import type { NormalizedMetadata, OutputLinks, OutputMeta } from "../types/io";
import { _meta, _multiMeta, nonNullable } from "./utils";

// https://github.com/vercel/next.js/blob/5b97f1f7b51dddfc1df42e0bd03730f90ebc9337/packages/next/src/lib/metadata/generate/basic.tsx#L54
export function generateBasicMeta(metadata: NormalizedMetadata): OutputMeta {
	return [
		metadata.charSet ? { charSet: metadata.charSet } : undefined,
		metadata.title ? { title: metadata.title } : undefined,
		_meta({ name: "description", content: metadata.description }),
		_meta({
			name: "application-name",
			content: metadata.applicationName,
		}),
		...(metadata.authors
			? metadata.authors.map((author) =>
					_meta({ name: "author", content: author.name }),
				)
			: []),
		_meta({ name: "generator", content: metadata.generator }),
		_meta({
			name: "keywords",
			content: Array.isArray(metadata.keywords)
				? metadata.keywords.join(",")
				: metadata.keywords,
		}),
		_meta({ name: "referrer", content: metadata.referrer }),
		_meta({ name: "creator", content: metadata.creator }),
		_meta({ name: "publisher", content: metadata.publisher }),
		_meta({ name: "robots", content: metadata.robots?.basic }),
		_meta({ name: "googlebot", content: metadata.robots?.googleBot }),
		_meta({ name: "abstract", content: metadata.abstract }),
		...(metadata.other
			? Object.entries(metadata.other).flatMap(([name, content]) => {
					if (Array.isArray(content)) {
						return content.map((contentItem) =>
							_meta({ name, content: contentItem }),
						);
					}
					return _meta({ name, content });
				})
			: []),
	].filter(nonNullable);
}

export function generateBasicLinks(metadata: NormalizedMetadata): OutputLinks {
	return [
		...(metadata.authors
			? metadata.authors.map((author) => ({
					rel: "author",
					href: author.url,
				}))
			: []),
		metadata.manifest
			? { rel: "manifest", href: metadata.manifest }
			: undefined,
		...(metadata.archives
			? metadata.archives.map((archive) => ({
					rel: "archives",
					href: archive,
				}))
			: []),
		...(metadata.assets
			? metadata.assets.map((asset) => ({
					rel: "assets",
					href: asset,
				}))
			: []),
		...(metadata.bookmarks
			? metadata.bookmarks.map((bookmark) => ({
					rel: "bookmarks",
					href: bookmark,
				}))
			: []),
	].filter(nonNullable);
}

export function generateFacebook(metadata: NormalizedMetadata): OutputMeta {
	const { facebook } = metadata;

	if (!facebook) return [];

	const { appId, admins } = facebook;

	return [
		_meta({ property: "fb:app_id", content: appId }),
		_multiMeta({ propertyPrefix: "fb:admins", contents: admins }),
	]
		.flat()
		.filter(nonNullable);
}

export function generatePinterest(metadata: NormalizedMetadata): OutputMeta {
	const { pinterest } = metadata;

	if (!pinterest) return [];

	const { richPin } = pinterest;

	return [
		_meta({ property: "pinterest-rich-pin", content: richPin?.toString() }),
	];
}

const formatDetectionKeys = [
	"telephone",
	"date",
	"address",
	"email",
	"url",
] as const;
export function generateFormatDetection(
	metadata: NormalizedMetadata,
): OutputMeta {
	const { formatDetection } = metadata;

	if (!formatDetection) return [];

	let content = "";
	for (const key of formatDetectionKeys) {
		if (formatDetection[key] === false) {
			if (content) content += ", ";
			content += `${key}=no`;
		}
	}

	return content ? [_meta({ name: "format-detection", content })] : [];
}

export function generateVerification(metadata: NormalizedMetadata): OutputMeta {
	const { verification } = metadata;

	if (!verification) return [];

	return [
		_multiMeta({
			namePrefix: "google-site-verification",
			contents: verification.google,
		}),
		_multiMeta({ namePrefix: "y_key", contents: verification.yahoo }),
		_multiMeta({
			namePrefix: "yandex-verification",
			contents: verification.yandex,
		}),
		_multiMeta({ namePrefix: "me", contents: verification.me }),
		...(verification.other
			? Object.entries(verification.other).map(([key, value]) =>
					_multiMeta({ namePrefix: key, contents: value }),
				)
			: []),
	]
		.flat()
		.filter(nonNullable);
}

export function generateAppleWebAppMeta(
	metadata: NormalizedMetadata,
): OutputMeta {
	const { appleWebApp } = metadata;

	if (!appleWebApp) return [];

	const { capable, title, statusBarStyle } = appleWebApp;

	return [
		capable
			? _meta({ name: "mobile-web-app-capable", content: "yes" })
			: undefined,
		_meta({ name: "apple-mobile-web-app-title", content: title }),
		statusBarStyle
			? _meta({
					name: "apple-mobile-web-app-status-bar-style",
					content: statusBarStyle,
				})
			: undefined,
	].filter(nonNullable);
}

export function generateAppleWebAppLinks(
	metadata: NormalizedMetadata,
): OutputLinks {
	const { appleWebApp } = metadata;

	if (!appleWebApp || !appleWebApp.startupImage) return [];

	const { startupImage } = appleWebApp;

	return startupImage.map((image) => ({
		rel: "apple-touch-startup-image",
		href: image.url.toString(),
		media: image.media,
	}));
}

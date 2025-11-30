import type { NormalizedMetadata, OutputLinks, OutputMeta } from "../types/io";
import { createMetaList, createMetaTag, flattenMetaList } from "./utils";

export function generateBasicMeta(metadata: NormalizedMetadata): OutputMeta {
	return flattenMetaList([
		metadata.charSet ? { charSet: metadata.charSet } : undefined,
		metadata.title ? { title: metadata.title } : undefined,
		createMetaTag({ name: "description", content: metadata.description }),
		createMetaTag({
			name: "application-name",
			content: metadata.applicationName,
		}),
		...(metadata.authors
			? metadata.authors.map((author) =>
					createMetaTag({ name: "author", content: author.name }),
				)
			: []),
		createMetaTag({ name: "generator", content: metadata.generator }),
		createMetaTag({
			name: "keywords",
			content: Array.isArray(metadata.keywords)
				? metadata.keywords.join(",")
				: metadata.keywords,
		}),
		createMetaTag({ name: "referrer", content: metadata.referrer }),
		createMetaTag({ name: "creator", content: metadata.creator }),
		createMetaTag({ name: "publisher", content: metadata.publisher }),
		createMetaTag({ name: "robots", content: metadata.robots?.basic }),
		createMetaTag({ name: "googlebot", content: metadata.robots?.googleBot }),
		createMetaTag({ name: "abstract", content: metadata.abstract }),
		...(metadata.other
			? Object.entries(metadata.other).flatMap(([name, content]) => {
					if (Array.isArray(content)) {
						return content.map((contentItem) =>
							createMetaTag({ name, content: contentItem }),
						);
					}
					return createMetaTag({ name, content });
				})
			: []),
	]);
}

export function generateBasicLinks(metadata: NormalizedMetadata): OutputLinks {
	return flattenMetaList([
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
		...(metadata.pagination
			? [
					metadata.pagination.previous
						? { rel: "previous", href: metadata.pagination.previous }
						: null,
					metadata.pagination.next
						? { rel: "next", href: metadata.pagination.next }
						: null,
				]
			: []),
	]);
}

export function generateItunes(metadata: NormalizedMetadata): OutputMeta {
	const { itunes } = metadata;

	if (!itunes) return [];

	const { appId, appArgument } = itunes;
	let content = `app-id=${appId}`;
	if (appArgument) {
		content += `, app-argument=${appArgument}`;
	}

	return flattenMetaList([
		createMetaTag({ name: "apple-itunes-app", content }),
	]);
}

export function generateFacebook(metadata: NormalizedMetadata): OutputMeta {
	const { facebook } = metadata;

	if (!facebook) return [];

	const { appId, admins } = facebook;

	return flattenMetaList([
		createMetaTag({ property: "fb:app_id", content: appId }),
		createMetaList({ propertyPrefix: "fb:admins", contents: admins }),
	]);
}

export function generatePinterest(metadata: NormalizedMetadata): OutputMeta {
	const { pinterest } = metadata;

	if (!pinterest) return [];

	const { richPin } = pinterest;

	return [
		createMetaTag({
			property: "pinterest-rich-pin",
			content: richPin?.toString(),
		}),
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

	return content ? [createMetaTag({ name: "format-detection", content })] : [];
}

export function generateVerification(metadata: NormalizedMetadata): OutputMeta {
	const { verification } = metadata;

	if (!verification) return [];

	return flattenMetaList([
		createMetaList({
			namePrefix: "google-site-verification",
			contents: verification.google,
		}),
		createMetaList({ namePrefix: "y_key", contents: verification.yahoo }),
		createMetaList({
			namePrefix: "yandex-verification",
			contents: verification.yandex,
		}),
		createMetaList({ namePrefix: "me", contents: verification.me }),
		...(verification.other
			? Object.entries(verification.other).flatMap(
					([key, value]) =>
						createMetaList({ namePrefix: key, contents: value }) ?? [],
				)
			: []),
	]);
}

export function generateAppleWebAppMeta(
	metadata: NormalizedMetadata,
): OutputMeta {
	const { appleWebApp } = metadata;

	if (!appleWebApp) return [];

	const { capable, title, statusBarStyle } = appleWebApp;

	return flattenMetaList([
		capable
			? createMetaTag({ name: "mobile-web-app-capable", content: "yes" })
			: undefined,
		createMetaTag({ name: "apple-mobile-web-app-title", content: title }),
		statusBarStyle
			? createMetaTag({
					name: "apple-mobile-web-app-status-bar-style",
					content: statusBarStyle,
				})
			: undefined,
	]);
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

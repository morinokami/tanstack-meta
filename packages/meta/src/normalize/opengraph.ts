import type { InputMetadata, SimplifyTitleInUnion } from "../types/io";
import type {
	ResolvedMetadata,
	ResolvedMetadataWithURLs,
} from "../types/metadata-interface";
import type { OpenGraph, OpenGraphType } from "../types/opengraph-types";
import type { Twitter } from "../types/twitter-types";
import { isStringOrURL, resolveAsArrayOrUndefined } from "./utils";

type FlattenArray<T> = T extends (infer U)[] ? U : T;

const OgTypeFields = {
	article: ["authors", "tags"],
	song: ["albums", "musicians"],
	playlist: ["albums", "musicians"],
	radio: ["creators"],
	video: ["actors", "directors", "writers", "tags"],
	basic: [
		"emails",
		"phoneNumbers",
		"faxNumbers",
		"alternateLocale",
		"audio",
		"videos",
	],
} as const;

function resolveUrl(url: string | URL): URL | null {
	if (url instanceof URL) return url;
	if (!url) return null;

	try {
		// If we can construct a URL instance from url, ignore metadataBase
		const parsedUrl = new URL(url);
		return parsedUrl;
	} catch {}

	return null;
}

function resolveAndValidateImage(
	item: FlattenArray<OpenGraph["images"] | Twitter["images"]>,
) {
	if (!item) return undefined;
	const isItemUrl = isStringOrURL(item);
	const inputUrl = isItemUrl ? item : item.url;

	// Try to resolve the main URL
	const resolvedUrl = inputUrl ? resolveUrl(inputUrl) : null;

	// If the main URL doesn't exist or is invalid, try secureUrl
	if (!resolvedUrl) {
		if (!isItemUrl && item.secureUrl) {
			const resolvedSecureUrl = resolveUrl(item.secureUrl);
			if (resolvedSecureUrl) {
				// When url is empty but secureUrl exists, only output secureUrl
				// Set url to empty string to satisfy type requirements but _multiMeta will skip it
				return {
					...item,
					url: "",
					secureUrl: resolvedSecureUrl.toString(),
				};
			}
		}
		return undefined;
	}

	const baseResult = {
		url: resolvedUrl.toString(),
		...(isItemUrl ? {} : item),
	};

	// Convert secureUrl to string if it exists
	if (!isItemUrl && item.secureUrl) {
		const resolvedSecureUrl = resolveUrl(item.secureUrl);
		if (resolvedSecureUrl) {
			baseResult.secureUrl = resolvedSecureUrl.toString();
		}
	}

	return baseResult;
}

function resolveImages(
	images: Twitter["images"],
): NonNullable<ResolvedMetadataWithURLs["twitter"]>["images"];
function resolveImages(
	images: OpenGraph["images"],
): NonNullable<ResolvedMetadataWithURLs["openGraph"]>["images"];
function resolveImages(
	images: OpenGraph["images"] | Twitter["images"],
):
	| NonNullable<ResolvedMetadataWithURLs["twitter"]>["images"]
	| NonNullable<ResolvedMetadataWithURLs["openGraph"]>["images"] {
	const resolvedImages = resolveAsArrayOrUndefined(images);
	if (!resolvedImages) return resolvedImages;

	const nonNullableImages = [];
	for (const item of resolvedImages) {
		const resolvedItem = resolveAndValidateImage(item);
		if (!resolvedItem) continue;

		nonNullableImages.push(resolvedItem);
	}

	return nonNullableImages;
}

const ogTypeToFields: Record<string, readonly string[]> = {
	article: OgTypeFields.article,
	book: OgTypeFields.article,
	"music.song": OgTypeFields.song,
	"music.album": OgTypeFields.song,
	"music.playlist": OgTypeFields.playlist,
	"music.radio_station": OgTypeFields.radio,
	"video.movie": OgTypeFields.video,
	"video.episode": OgTypeFields.video,
};

function getFieldsByOgType(ogType: OpenGraphType | undefined) {
	if (!ogType || !(ogType in ogTypeToFields)) return OgTypeFields.basic;
	return ogTypeToFields[ogType].concat(OgTypeFields.basic);
}

export function normalizeOpenGraph(openGraph: InputMetadata["openGraph"]) {
	if (!openGraph) return null;

	type OpenGraphResolved = NonNullable<
		SimplifyTitleInUnion<ResolvedMetadata["openGraph"]>
	>;
	type OpenGraphArrayKeys =
		(typeof OgTypeFields)[keyof typeof OgTypeFields][number];

	function setArrayField<
		K extends OpenGraphArrayKeys & keyof OpenGraphResolved,
	>(
		target: OpenGraphResolved,
		og: NonNullable<InputMetadata["openGraph"]>,
		key: K,
	) {
		const value = og[key];
		if (typeof value === "undefined") return;

		const normalized =
			value === null ? null : (resolveAsArrayOrUndefined(value) ?? null);
		target[key] = normalized as OpenGraphResolved[K];
	}

	function resolveProps(
		target: OpenGraphResolved,
		og: NonNullable<typeof openGraph>,
	) {
		const ogType = "type" in og ? og.type : undefined;
		const keys = getFieldsByOgType(ogType);
		for (const key of keys) {
			setArrayField(
				target,
				og,
				key as OpenGraphArrayKeys & keyof OpenGraphResolved,
			);
		}
		if (og.images) {
			const resolvedImages = resolveImages(og.images);
			if (resolvedImages && resolvedImages.length > 0) {
				target.images = resolvedImages;
			}
		}
	}

	const resolved = {
		...openGraph,
	} as OpenGraphResolved;
	resolveProps(resolved, openGraph);

	return resolved;
}

const TwitterBasicInfoKeys = [
	"site",
	"siteId",
	"creator",
	"creatorId",
	"description",
] as const;

export function normalizeTwitter(twitter: InputMetadata["twitter"]) {
	if (!twitter) return null;
	let card = "card" in twitter ? twitter.card : undefined;
	const resolved = {
		...twitter,
		title: twitter.title,
	} as NonNullable<SimplifyTitleInUnion<ResolvedMetadata["twitter"]>>;
	for (const infoKey of TwitterBasicInfoKeys) {
		resolved[infoKey] = twitter[infoKey] || null;
	}

	resolved.images = resolveImages(twitter.images);

	card = card || (resolved.images?.length ? "summary_large_image" : "summary");
	resolved.card = card;

	if ("card" in resolved) {
		switch (resolved.card) {
			case "player": {
				resolved.players = resolveAsArrayOrUndefined(resolved.players) || [];
				break;
			}
			case "app": {
				resolved.app = resolved.app || {};
				break;
			}
			case "summary":
			case "summary_large_image":
				break;
			default:
				resolved satisfies never;
		}
	}

	return resolved;
}

export function normalizeAppLink(appLinks: InputMetadata["appLinks"]) {
	if (!appLinks) return null;

	const resolved: ResolvedMetadataWithURLs["appLinks"] = {};
	for (const key of Object.keys(appLinks) as Array<
		keyof ResolvedMetadataWithURLs["appLinks"]
	>) {
		const value = appLinks[key];
		if (typeof value === "undefined" || value === null) continue;

		const normalized = resolveAsArrayOrUndefined(value);
		if (normalized) {
			resolved[key] = normalized as NonNullable<
				ResolvedMetadataWithURLs["appLinks"]
			>[typeof key];
		}
	}

	return resolved;
}

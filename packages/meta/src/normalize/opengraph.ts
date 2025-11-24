import type { ResolvedMetadata } from "next";

import type { InputMetadata, SimplifyTitleInUnion } from "../types/io";
import type { ResolvedMetadataWithURLs } from "../types/metadata-interface";
import type { OpenGraph, OpenGraphType } from "../types/opengraph-types";
import type { Twitter } from "../types/twitter-types";
import { resolveArray, resolveAsArrayOrUndefined } from "./utils";

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

function isStringOrURL(icon: any): icon is string | URL {
	return typeof icon === "string" || icon instanceof URL;
}

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

export function resolveImages(
	images: Twitter["images"],
): NonNullable<ResolvedMetadataWithURLs["twitter"]>["images"];
export function resolveImages(
	images: OpenGraph["images"],
): NonNullable<ResolvedMetadataWithURLs["openGraph"]>["images"];
export function resolveImages(
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

	function resolveProps(
		target: NonNullable<SimplifyTitleInUnion<ResolvedMetadata["openGraph"]>>,
		og: InputMetadata["openGraph"],
	) {
		const ogType = og && "type" in og ? og.type : undefined;
		const keys = getFieldsByOgType(ogType);
		for (const k of keys) {
			const key = k as keyof ResolvedMetadata["openGraph"];
			if (og && key in og) {
				const value = og[key];
				// TODO: improve typing inferring
				(target as any)[key] = value ? resolveArray(value) : null;
			}
		}
		if (og?.images) {
			const resolvedImages = resolveImages(og.images);
			if (resolvedImages && resolvedImages.length > 0) {
				target.images = resolvedImages;
			}
		}
	}

	const resolved = {
		...openGraph,
	} as NonNullable<SimplifyTitleInUnion<ResolvedMetadata["openGraph"]>>;
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
	for (const key in appLinks) {
		// @ts-expect-error // TODO: type infer
		appLinks[key] = resolveAsArrayOrUndefined(appLinks[key]);
	}
	return appLinks as ResolvedMetadataWithURLs["appLinks"];
}

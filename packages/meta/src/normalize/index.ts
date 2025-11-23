import type { WithStringifiedURLs } from "next/dist/lib/metadata/types/metadata-interface";

import type { InputMetadata, NormalizedMetadata } from "../types/io";
import {
	normalizeFacebook,
	normalizeRobotsValue,
	normalizeVerification,
} from "./basic";
import { normalizeIcons } from "./icons";
import {
	normalizeAppLink,
	normalizeOpenGraph,
	normalizeTwitter,
} from "./opengraph";
import { resolveAsArrayOrUndefined } from "./utils";

// https://github.com/vercel/next.js/blob/d673568300ab9336ebe610516c5a3439ab7cb8f5/packages/next/src/lib/metadata/resolve-metadata.ts#L213
export function normalizeMetadata(metadata: InputMetadata): NormalizedMetadata {
	return {
		charSet: metadata.charSet ?? null,
		title: metadata.title ?? null,
		description: metadata.description ?? null,
		applicationName: metadata.applicationName ?? null,
		manifest: convertUrlsToStrings(metadata.manifest) ?? null,
		generator: metadata.generator ?? null,
		keywords: resolveAsArrayOrUndefined(metadata.keywords) ?? null,
		referrer: metadata.referrer ?? null,
		creator: metadata.creator ?? null,
		publisher: metadata.publisher ?? null,
		robots: metadata.robots
			? {
					basic: normalizeRobotsValue(metadata.robots),
					googleBot:
						typeof metadata.robots !== "string"
							? normalizeRobotsValue(metadata.robots.googleBot)
							: null,
				}
			: null,
		abstract: metadata.abstract ?? null,
		archives: resolveAsArrayOrUndefined(metadata.archives) ?? null,
		assets: resolveAsArrayOrUndefined(metadata.assets) ?? null,
		bookmarks: resolveAsArrayOrUndefined(metadata.bookmarks) ?? null,
		category: metadata.category ?? null,
		classification: metadata.classification ?? null,
		other: metadata.other ?? null,

		facebook: normalizeFacebook(metadata.facebook),
		pinterest: convertUrlsToStrings(metadata.pinterest) ?? null,
		formatDetection: metadata.formatDetection ?? null,
		verification: normalizeVerification(metadata.verification),
		openGraph: normalizeOpenGraph(metadata.openGraph),
		twitter: normalizeTwitter(metadata.twitter),
		appLinks: normalizeAppLink(metadata.appLinks),
		icons: convertUrlsToStrings(normalizeIcons(metadata.icons)),
	};
}

function convertUrlsToStrings<T>(input: T): WithStringifiedURLs<T> {
	if (input instanceof URL) {
		return input.toString() as unknown as WithStringifiedURLs<T>;
	} else if (Array.isArray(input)) {
		return input.map((item) =>
			convertUrlsToStrings(item),
		) as WithStringifiedURLs<T>;
	} else if (input && typeof input === "object") {
		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(input)) {
			result[key] = convertUrlsToStrings(value);
		}
		return result as WithStringifiedURLs<T>;
	}
	return input as WithStringifiedURLs<T>;
}

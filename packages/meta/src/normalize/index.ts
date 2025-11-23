import type { InputMetadata, NormalizedMetadata } from "../types/io";
import {
	normalizeFacebook,
	normalizeRobotsValue,
	normalizeVerification,
} from "./basic";
import {
	normalizeAppLink,
	normalizeOpenGraph,
	normalizeTwitter,
} from "./opengraph";

// https://github.com/vercel/next.js/blob/d673568300ab9336ebe610516c5a3439ab7cb8f5/packages/next/src/lib/metadata/resolve-metadata.ts#L213
export function normalizeMetadata(metadata: InputMetadata): NormalizedMetadata {
	return {
		charSet: metadata.charSet ?? null,
		title: metadata.title ?? null,
		description: metadata.description ?? null,
		applicationName: metadata.applicationName ?? null,
		generator: metadata.generator ?? null,
		keywords: Array.isArray(metadata.keywords)
			? metadata.keywords
			: metadata.keywords
				? [metadata.keywords]
				: null,
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
		category: metadata.category ?? null,
		classification: metadata.classification ?? null,
		other: metadata.other ?? null,

		facebook: normalizeFacebook(metadata.facebook),
		formatDetection: metadata.formatDetection ?? null,
		verification: normalizeVerification(metadata.verification),
		openGraph: normalizeOpenGraph(metadata.openGraph),
		twitter: normalizeTwitter(metadata.twitter),
		appLinks: normalizeAppLink(metadata.appLinks),
	};
}

import type { InputMetadata, NormalizedMetadata } from "../types";

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
	};
}

const robotsKeys = [
	"noarchive",
	"nosnippet",
	"noimageindex",
	"nocache",
	"notranslate",
	"indexifembedded",
	"nositelinkssearchbox",
	"unavailable_after",
	"max-video-preview",
	"max-image-preview",
	"max-snippet",
] as const;
const normalizeRobotsValue: (robots: InputMetadata["robots"]) => string | null =
	(robots) => {
		if (!robots) return null;
		if (typeof robots === "string") return robots;

		const values: string[] = [];

		if (robots.index) values.push("index");
		else if (typeof robots.index === "boolean") values.push("noindex");

		if (robots.follow) values.push("follow");
		else if (typeof robots.follow === "boolean") values.push("nofollow");

		for (const key of robotsKeys) {
			const value = robots[key];
			if (typeof value !== "undefined" && value !== false) {
				values.push(typeof value === "boolean" ? key : `${key}:${value}`);
			}
		}

		return values.join(", ");
	};

import type { InputMetadata } from "../types/io";

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
export const normalizeRobotsValue: (
	robots: InputMetadata["robots"],
) => string | null = (robots) => {
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

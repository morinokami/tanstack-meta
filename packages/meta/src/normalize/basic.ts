import type { AlternateLinkDescriptor } from "../types/alternative-urls-types";
import type { InputMetadata } from "../types/io";
import type { ResolvedVerification } from "../types/metadata-types";
import { resolveAsArrayOrUndefined } from "./utils";

function resolveUrlValuesOfObject(
	obj:
		| Record<
				string,
				string | URL | AlternateLinkDescriptor[] | null | undefined
		  >
		| null
		| undefined,
): null | Record<string, AlternateLinkDescriptor[]> {
	if (!obj) return null;

	const result: Record<string, AlternateLinkDescriptor[]> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "string" || value instanceof URL) {
			result[key] = [
				{
					url: value,
				},
			];
		} else if (value?.length) {
			result[key] = [];
			value.forEach((item, index) => {
				result[key][index] = {
					url: item.url,
					title: item.title,
				};
			});
		}
	}
	return result;
}
function resolveCanonicalUrl(
	urlOrDescriptor: string | URL | null | AlternateLinkDescriptor | undefined,
): null | AlternateLinkDescriptor {
	if (!urlOrDescriptor) return null;

	const url =
		typeof urlOrDescriptor === "string" || urlOrDescriptor instanceof URL
			? urlOrDescriptor
			: urlOrDescriptor.url;

	// Return string url because structureClone can't handle URL instance
	return {
		url,
	};
}
export const normalizeAlternates = (
	alternates: InputMetadata["alternates"],
) => {
	if (!alternates) return null;

	const canonical = resolveCanonicalUrl(alternates.canonical);
	const languages = resolveUrlValuesOfObject(alternates.languages);
	const media = resolveUrlValuesOfObject(alternates.media);
	const types = resolveUrlValuesOfObject(alternates.types);

	return {
		canonical,
		languages,
		media,
		types,
	};
};

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

const VerificationKeys = ["google", "yahoo", "yandex", "me", "other"] as const;
export const normalizeVerification = (
	verification: InputMetadata["verification"],
) => {
	if (!verification) return null;
	const res: ResolvedVerification = {};

	for (const key of VerificationKeys) {
		const value = verification[key];
		if (value) {
			if (key === "other") {
				res.other = {};
				for (const otherKey in verification.other) {
					const otherValue = resolveAsArrayOrUndefined(
						verification.other[otherKey],
					);
					if (otherValue) res.other[otherKey] = otherValue;
				}
			} else res[key] = resolveAsArrayOrUndefined(value) as (string | number)[];
		}
	}
	return res;
};

export const normalizeFacebook = (facebook: InputMetadata["facebook"]) => {
	if (!facebook) return null;

	return {
		appId: facebook.appId,
		admins: resolveAsArrayOrUndefined(facebook.admins),
	};
};

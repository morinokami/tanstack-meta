import type {
	AppLinks,
	AppLinksAndroid,
	AppLinksApple,
	AppLinksWeb,
	AppLinksWindows,
} from "../types/extra-types";
import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import { resolveUrl } from "./utils";

type AppLinkEntry =
	| AppLinksApple
	| AppLinksAndroid
	| AppLinksWindows
	| AppLinksWeb;

function resolveAppLinkEntry<T extends AppLinkEntry>(
	entry: T,
	baseUrl: string | URL,
): T {
	if (!entry.url) return entry;

	return { ...entry, url: resolveUrl(entry.url, baseUrl) };
}

function resolveAppLinkEntries<T extends AppLinkEntry>(
	entries: T | T[] | undefined,
	baseUrl: string | URL,
): T | T[] | undefined {
	if (!entries) return entries;

	if (Array.isArray(entries)) {
		return entries.map((entry) => resolveAppLinkEntry(entry, baseUrl));
	}

	return resolveAppLinkEntry(entries, baseUrl);
}

export function resolveAppLinks(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["appLinks"] {
	const { appLinks } = metadata;

	if (!appLinks || !baseUrl) return appLinks;

	const resolved: AppLinks = {};

	if (appLinks.ios) {
		resolved.ios = resolveAppLinkEntries(appLinks.ios, baseUrl);
	}
	if (appLinks.iphone) {
		resolved.iphone = resolveAppLinkEntries(appLinks.iphone, baseUrl);
	}
	if (appLinks.ipad) {
		resolved.ipad = resolveAppLinkEntries(appLinks.ipad, baseUrl);
	}
	if (appLinks.android) {
		resolved.android = resolveAppLinkEntries(appLinks.android, baseUrl);
	}
	if (appLinks.windows_phone) {
		resolved.windows_phone = resolveAppLinkEntries(
			appLinks.windows_phone,
			baseUrl,
		);
	}
	if (appLinks.windows) {
		resolved.windows = resolveAppLinkEntries(appLinks.windows, baseUrl);
	}
	if (appLinks.windows_universal) {
		resolved.windows_universal = resolveAppLinkEntries(
			appLinks.windows_universal,
			baseUrl,
		);
	}
	if (appLinks.web) {
		resolved.web = resolveAppLinkEntries(appLinks.web, baseUrl);
	}

	return resolved;
}

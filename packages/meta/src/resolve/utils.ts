import type { GeneratorInputMetadata, InputMetadata } from "../types/io";

export function resolveUrl(url: string | URL, baseUrl: string | URL): string {
	const urlString = url.toString();

	if (urlString.startsWith("http://") || urlString.startsWith("https://")) {
		return urlString;
	}

	return new URL(urlString, baseUrl).toString();
}

/**
 * Creates a resolver for single URL fields (e.g., manifest)
 */
export function createSingleUrlResolver<K extends "manifest">(key: K) {
	return (
		metadata: GeneratorInputMetadata,
		baseUrl?: string | URL | null,
	): InputMetadata[K] => {
		const value = metadata[key] as string | URL | null | undefined;

		if (!value || !baseUrl) return value as InputMetadata[K];

		return resolveUrl(value, baseUrl) as InputMetadata[K];
	};
}

/**
 * Creates a resolver for single-or-array URL fields (e.g., archives, assets, bookmarks)
 */
export function createArrayUrlResolver<
	K extends "archives" | "assets" | "bookmarks",
>(key: K) {
	return (
		metadata: GeneratorInputMetadata,
		baseUrl?: string | URL | null,
	): InputMetadata[K] => {
		const value = metadata[key] as string | string[] | null | undefined;

		if (!value || !baseUrl) return value as InputMetadata[K];

		if (Array.isArray(value)) {
			return value.map((v) => resolveUrl(v, baseUrl)) as InputMetadata[K];
		}

		return resolveUrl(value, baseUrl) as InputMetadata[K];
	};
}

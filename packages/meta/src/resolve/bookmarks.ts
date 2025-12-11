import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import { resolveUrl } from "./utils";

export function resolveBookmarks(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["bookmarks"] {
	const { bookmarks } = metadata;

	if (!bookmarks || !baseUrl) return bookmarks;

	if (Array.isArray(bookmarks)) {
		return bookmarks.map((bookmark) => resolveUrl(bookmark, baseUrl));
	}

	return resolveUrl(bookmarks, baseUrl);
}

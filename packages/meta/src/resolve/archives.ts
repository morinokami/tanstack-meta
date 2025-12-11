import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import { resolveUrl } from "./utils";

export function resolveArchives(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["archives"] {
	const { archives } = metadata;

	if (!archives || !baseUrl) return archives;

	if (Array.isArray(archives)) {
		return archives.map((archive) => resolveUrl(archive, baseUrl));
	}

	return resolveUrl(archives, baseUrl);
}

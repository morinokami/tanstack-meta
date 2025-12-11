import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import { resolveUrl } from "./utils";

export function resolveManifest(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["manifest"] {
	const { manifest } = metadata;

	if (!manifest || !baseUrl) return manifest;

	return resolveUrl(manifest, baseUrl);
}

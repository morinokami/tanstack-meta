import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import { resolveUrl } from "./utils";

export function resolveAssets(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["assets"] {
	const { assets } = metadata;

	if (!assets || !baseUrl) return assets;

	if (Array.isArray(assets)) {
		return assets.map((asset) => resolveUrl(asset, baseUrl));
	}

	return resolveUrl(assets, baseUrl);
}

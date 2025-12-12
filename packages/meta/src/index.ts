import { links } from "./links";
import { meta } from "./meta";
import { normalizeMetadata } from "./normalize";
import { resolveAlternates } from "./resolve/alternates";
import { resolveAppLinks } from "./resolve/app-links";
import { resolveArchives } from "./resolve/archives";
import { resolveAssets } from "./resolve/assets";
import { resolveBookmarks } from "./resolve/bookmarks";
import { resolveIcons } from "./resolve/icons";
import { resolveManifest } from "./resolve/manifest";
import { resolveTitle } from "./resolve/title";
import type {
	GeneratorInputMetadata,
	InputMetadata,
	OutputLinks,
	OutputMeta,
} from "./types/io";

type OutputMetadata = {
	meta: OutputMeta;
	links: OutputLinks;
};

export function generateMetadata(metadata: InputMetadata): OutputMetadata {
	const normalizedMetadata = normalizeMetadata(metadata);

	return {
		meta: meta(normalizedMetadata),
		links: links(normalizedMetadata),
	};
}

export function createMetadataGenerator(
	options: {
		titleTemplate?: { default: string; template: string };
		baseUrl?: string | URL | null;
	} = {},
): (metadata: GeneratorInputMetadata) => OutputMetadata {
	return (metadata: GeneratorInputMetadata) => {
		const title = resolveTitle(metadata, options.titleTemplate);

		const icons = resolveIcons(metadata, options.baseUrl);
		const manifest = resolveManifest(metadata, options.baseUrl);
		const assets = resolveAssets(metadata, options.baseUrl);
		const archives = resolveArchives(metadata, options.baseUrl);
		const bookmarks = resolveBookmarks(metadata, options.baseUrl);
		const alternates = resolveAlternates(metadata, options.baseUrl);
		const appLinks = resolveAppLinks(metadata, options.baseUrl);

		return generateMetadata({
			...metadata,
			title,
			icons,
			manifest,
			assets,
			archives,
			bookmarks,
			alternates,
			appLinks,
		});
	};
}

export type { InputMetadata, OutputMetadata, GeneratorInputMetadata };

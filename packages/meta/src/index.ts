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
import { resolveOpenGraph } from "./resolve/opengraph";
import { resolveTitle } from "./resolve/title";
import { resolveTwitter } from "./resolve/twitter";
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

		const openGraph = resolveOpenGraph(metadata, options.baseUrl);
		const twitter = resolveTwitter(metadata, options.baseUrl);
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
			openGraph,
			twitter,
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

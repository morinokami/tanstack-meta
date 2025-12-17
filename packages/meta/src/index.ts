import { links } from "./links";
import { meta } from "./meta";
import { normalizeMetadata } from "./normalize";
import { resolveAlternates } from "./resolve/alternates";
import { resolveOpenGraph } from "./resolve/opengraph";
import { resolveTitle, type TitleTemplate } from "./resolve/title";
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
		titleTemplate?: TitleTemplate;
		baseUrl?: string | URL | null;
	} = {},
): (metadata: GeneratorInputMetadata) => OutputMetadata {
	return (metadata: GeneratorInputMetadata) => {
		const title = resolveTitle(metadata, options.titleTemplate);

		const openGraph = resolveOpenGraph(metadata, options.baseUrl);
		const twitter = resolveTwitter(metadata, options.baseUrl);
		const alternates = resolveAlternates(metadata, options.baseUrl);

		return generateMetadata({
			...metadata,
			title,
			openGraph,
			twitter,
			alternates,
		});
	};
}

export type {
	InputMetadata,
	OutputMetadata,
	GeneratorInputMetadata,
	TitleTemplate,
};

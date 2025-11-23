import { links } from "./links";
import { meta } from "./meta";
import { normalizeMetadata } from "./normalize";
import type { InputMetadata, OutputLinks, OutputMeta } from "./types/io";

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

export type { InputMetadata, OutputMetadata };

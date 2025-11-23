import { meta } from "./meta";
import type { InputMetadata, OutputLinks, OutputMeta } from "./types/io";

type OutputMetadata = {
	meta: OutputMeta;
	links: OutputLinks;
};

export function generateMetadata(metadata: InputMetadata): OutputMetadata {
	return {
		meta: meta(metadata),
		links: [], // TODO: generate links
	};
}

export type { InputMetadata, OutputMetadata };

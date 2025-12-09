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

type GeneratorInputMetadata = Omit<InputMetadata, "title"> & {
	title?: string | { absolute: string } | null;
};

function resolveTitle(
	metadata: GeneratorInputMetadata,
	options: { titleTemplate?: { default: string; template: string } },
) {
	let title: string | null | undefined;

	if (
		metadata.title &&
		typeof metadata.title === "object" &&
		"absolute" in metadata.title
	) {
		title = metadata.title.absolute;
	} else {
		title = options.titleTemplate
			? options.titleTemplate.template.replace(
					"%s",
					metadata.title ?? options.titleTemplate.default,
				)
			: metadata.title;
	}

	return title;
}

export function createMetadataGenerator(
	options: { titleTemplate?: { default: string; template: string } } = {},
) {
	return (metadata: GeneratorInputMetadata) => {
		const title = resolveTitle(metadata, options);

		return generateMetadata({
			...metadata,
			title,
		});
	};
}

export type { InputMetadata, OutputMetadata, GeneratorInputMetadata };

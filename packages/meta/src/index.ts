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
		const { titleTemplate } = options;
		if (!titleTemplate) {
			title = metadata.title;
		} else {
			if (typeof metadata.title === "string") {
				title = titleTemplate.template.split("%s").join(metadata.title);
			} else {
				title = titleTemplate.default;
			}
		}
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

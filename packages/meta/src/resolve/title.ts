import type { GeneratorInputMetadata, InputMetadata } from "../types/io";

export function resolveTitle(
	metadata: GeneratorInputMetadata,
	titleTemplate?: { default: string; template: string },
): InputMetadata["title"] {
	let title: string | null | undefined;

	if (
		metadata.title &&
		typeof metadata.title === "object" &&
		"absolute" in metadata.title
	) {
		title = metadata.title.absolute;
	} else {
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

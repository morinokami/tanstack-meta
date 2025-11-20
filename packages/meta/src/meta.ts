import { resolveDescription } from "./resolvers/description";
import { resolveTitle } from "./resolvers/title";
import type { InputMetadata, OutputMetadata } from "./types";

export function meta(metadata: InputMetadata): OutputMetadata {
	const entries: OutputMetadata = [];

	const resolvedTitle = resolveTitle(metadata.title);
	if (resolvedTitle) {
		entries.push({ title: resolvedTitle });
	}

	const resolvedDescription = resolveDescription(metadata.description);
	if (resolvedDescription) {
		entries.push({
			name: "description",
			content: resolvedDescription,
		});
	}

	return entries.length > 0 ? entries : undefined;
}

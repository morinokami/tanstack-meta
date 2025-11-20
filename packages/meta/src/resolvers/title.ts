import type { InputMetadata } from "../types";

export function resolveTitle(
	title: InputMetadata["title"],
): string | undefined {
	if (!title) return undefined;

	const trimmed = title.trim();

	return trimmed.length > 0 ? trimmed : undefined;
}

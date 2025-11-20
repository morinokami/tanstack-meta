import type { InputMetadata } from "../types";

export function resolveDescription(
	description: InputMetadata["description"],
): string | undefined {
	if (!description) return undefined;

	const trimmed = description.trim();

	return trimmed.length > 0 ? trimmed : undefined;
}

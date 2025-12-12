import type { AlternateLinkDescriptor } from "../types/alternative-urls-types";
import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import { resolveUrl } from "./utils";

type AlternateValue = null | string | URL | AlternateLinkDescriptor | undefined;
type AlternateArrayValue = null | string | URL | AlternateLinkDescriptor[];
type AlternateArrayValueInput = AlternateArrayValue | undefined;

function resolveAlternateValue(
	value: AlternateValue,
	baseUrl: string | URL,
): AlternateValue {
	if (!value) return value;

	if (typeof value === "string") {
		return resolveUrl(value, baseUrl);
	}

	if (value instanceof URL) {
		return resolveUrl(value, baseUrl);
	}

	return { ...value, url: resolveUrl(value.url, baseUrl) };
}

function resolveAlternateArrayValue(
	value: AlternateArrayValueInput,
	baseUrl: string | URL,
): AlternateArrayValue | undefined {
	if (!value) return value;

	if (typeof value === "string") {
		return resolveUrl(value, baseUrl);
	}

	if (value instanceof URL) {
		return resolveUrl(value, baseUrl);
	}

	return value.map((item) => ({ ...item, url: resolveUrl(item.url, baseUrl) }));
}

function resolveAlternateRecord<
	T extends Record<string, AlternateArrayValueInput> | undefined,
>(record: T, baseUrl: string | URL): T {
	if (!record) return record;

	const resolved: Record<string, AlternateArrayValue> = {};
	for (const [key, value] of Object.entries(record)) {
		const resolvedValue = resolveAlternateArrayValue(value, baseUrl);
		if (resolvedValue !== undefined) {
			resolved[key] = resolvedValue;
		}
	}

	return resolved as T;
}

export function resolveAlternates(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["alternates"] {
	const { alternates } = metadata;

	if (!alternates || !baseUrl) return alternates;

	return {
		canonical: resolveAlternateValue(alternates.canonical, baseUrl),
		languages: resolveAlternateRecord(alternates.languages, baseUrl),
		media: resolveAlternateRecord(alternates.media, baseUrl),
		types: resolveAlternateRecord(alternates.types, baseUrl),
	};
}

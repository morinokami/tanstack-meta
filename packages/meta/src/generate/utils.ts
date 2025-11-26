import type { OutputMeta } from "../types/io";

type MetaItem = OutputMeta[number];

type ExtendMetaContent = Record<
	string,
	string | URL | number | boolean | null | undefined
>;
type MultiMetaContent =
	| (ExtendMetaContent | string | URL | number)[]
	| null
	| undefined;

function isNonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

function camelToSnake(camelCaseStr: string) {
	return camelCaseStr.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

/**
 * Normalizes meta key names with a prefix, applying aliasing and snake_case for OG/Twitter.
 */
function getMetaKey(prefix: string, key: string) {
	const aliasPropPrefixes = new Set([
		"og:image",
		"twitter:image",
		"og:video",
		"og:audio",
	]);

	// Use `twitter:image` and `og:image` instead of `twitter:image:url` and `og:image:url`
	// to be more compatible as it's a more common format.
	// `og:video` & `og:audio` do not have a `:url` suffix alias
	if (aliasPropPrefixes.has(prefix) && key === "url") {
		return prefix;
	}
	if (prefix.startsWith("og:") || prefix.startsWith("twitter:")) {
		key = camelToSnake(key);
	}
	return `${prefix}:${key}`;
}

/**
 * Expands a structured meta object into individual meta tag entries.
 */
function buildMetaEntriesFromObject({
	content,
	namePrefix,
	propertyPrefix,
}: {
	content?: ExtendMetaContent;
	namePrefix?: string;
	propertyPrefix?: string;
}): MetaItem[] | null {
	if (!content) return null;
	return flattenMetaList<MetaItem>(
		Object.entries(content).map(([k, v]) => {
			return typeof v === "undefined"
				? null
				: createMetaTag({
						...(propertyPrefix && { property: getMetaKey(propertyPrefix, k) }),
						...(namePrefix && { name: getMetaKey(namePrefix, k) }),
						content: typeof v === "string" ? v : v?.toString(),
					});
		}),
	);
}

// https://github.com/vercel/next.js/blob/d673568300ab9336ebe610516c5a3439ab7cb8f5/packages/next/src/lib/metadata/generate/meta.tsx#L4
/**
 * Builds a single meta tag entry when name/property and content are provided.
 */
export function createMetaTag({
	name,
	property,
	media,
	content,
}: {
	name?: string;
	property?: string;
	media?: string;
	content?: string | number | URL | null | undefined;
}): MetaItem | undefined {
	if ((name || property) && content) {
		return {
			...(name ? { name } : { property }),
			...(media ? { media } : {}),
			content: typeof content === "string" ? content : content.toString(),
		};
	}
	return undefined;
}

/**
 * Creates a flat list of meta tag entries from mixed primitive or structured inputs with optional prefixes.
 */
export function createMetaList({
	propertyPrefix,
	namePrefix,
	contents,
}: {
	propertyPrefix?: string;
	namePrefix?: string;
	contents?: MultiMetaContent;
}): MetaItem[] | undefined {
	if (typeof contents === "undefined" || contents === null) {
		return undefined;
	}

	return flattenMetaList<MetaItem>(
		contents.flatMap((content) => {
			if (
				typeof content === "string" ||
				typeof content === "number" ||
				content instanceof URL
			) {
				return createMetaTag({
					...(propertyPrefix
						? { property: propertyPrefix }
						: { name: namePrefix }),
					content,
				});
			} else {
				return buildMetaEntriesFromObject({
					namePrefix,
					propertyPrefix,
					content,
				});
			}
		}),
	);
}

/**
 * Flattens nested meta/link collections into a single array and drops nullish entries.
 */
export function flattenMetaList<T>(
	items: ReadonlyArray<
		T | ReadonlyArray<T | null | undefined> | null | undefined
	>,
): T[] {
	const acc: T[] = [];
	const isArrayOf = (
		value: T | ReadonlyArray<T | null | undefined>,
	): value is ReadonlyArray<T | null | undefined> => Array.isArray(value);

	for (const item of items) {
		if (!item) continue;
		if (!isArrayOf(item)) {
			acc.push(item);
			continue;
		}

		acc.push(...item.filter(isNonNullable));
	}

	return acc;
}

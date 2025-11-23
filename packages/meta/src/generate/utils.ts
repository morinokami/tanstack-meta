// https://github.com/vercel/next.js/blob/d673568300ab9336ebe610516c5a3439ab7cb8f5/packages/next/src/lib/metadata/generate/meta.tsx#L4
export function _meta({
	name,
	property,
	media,
	content,
}: {
	name?: string;
	property?: string;
	media?: string;
	content?: string | number | URL | null | undefined;
}) {
	if ((name || property) && content) {
		return {
			...(name ? { name } : { property }),
			...(media ? { media } : {}),
			content: typeof content === "string" ? content : content?.toString(),
		};
	}
	return undefined;
}

export function nonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

function _metaFilter<T>(items: (T | T[] | null | undefined)[]): T[] {
	const acc: T[] = [];
	for (const item of items) {
		if (Array.isArray(item)) {
			acc.push(...item.filter(nonNullable));
		} else if (nonNullable(item)) {
			acc.push(item);
		}
	}
	return acc;
}

type ExtendMetaContent = Record<
	string,
	string | URL | number | boolean | null | undefined
>;
type MultiMetaContent =
	| (ExtendMetaContent | string | URL | number)[]
	| null
	| undefined;

function camelToSnake(camelCaseStr: string) {
	return camelCaseStr.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

const aliasPropPrefixes = new Set([
	"og:image",
	"twitter:image",
	"og:video",
	"og:audio",
]);
function getMetaKey(prefix: string, key: string) {
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

function ExtendMeta({
	content,
	namePrefix,
	propertyPrefix,
}: {
	content?: ExtendMetaContent;
	namePrefix?: string;
	propertyPrefix?: string;
}) {
	if (!content) return null;
	return _metaFilter(
		Object.entries(content).map(([k, v]) => {
			return typeof v === "undefined"
				? null
				: _meta({
						...(propertyPrefix && { property: getMetaKey(propertyPrefix, k) }),
						...(namePrefix && { name: getMetaKey(namePrefix, k) }),
						content: typeof v === "string" ? v : v?.toString(),
					});
		}),
	);
}

export function _multiMeta({
	propertyPrefix,
	namePrefix,
	contents,
}: {
	propertyPrefix?: string;
	namePrefix?: string;
	contents?: MultiMetaContent;
}) {
	if (typeof contents === "undefined" || contents === null) {
		return undefined;
	}

	return _metaFilter(
		contents.flatMap((content) => {
			if (
				typeof content === "string" ||
				typeof content === "number" ||
				content instanceof URL
			) {
				return _meta({
					...(propertyPrefix
						? { property: propertyPrefix }
						: { name: namePrefix }),
					content,
				});
			} else {
				return ExtendMeta({
					namePrefix,
					propertyPrefix,
					content,
				});
			}
		}),
	);
}

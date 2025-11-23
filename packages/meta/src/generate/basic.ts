import { normalizeMetadata } from "../normalize";
import type { InputMetadata, OutputMetadata } from "../types/io";
import { _meta } from "./utils";

// https://github.com/vercel/next.js/blob/5b97f1f7b51dddfc1df42e0bd03730f90ebc9337/packages/next/src/lib/metadata/generate/basic.tsx#L54
export function generateBasic(metadata: InputMetadata): OutputMetadata {
	const normalizedMetadata = normalizeMetadata(metadata);

	// TODO: links?
	return [
		normalizedMetadata.charSet
			? { charSet: normalizedMetadata.charSet }
			: undefined,
		metadata.title ? { title: metadata.title } : undefined,
		_meta({ name: "description", content: normalizedMetadata.description }),
		_meta({
			name: "application-name",
			content: normalizedMetadata.applicationName,
		}),
		_meta({ name: "generator", content: normalizedMetadata.generator }),
		_meta({
			name: "keywords",
			content: Array.isArray(normalizedMetadata.keywords)
				? normalizedMetadata.keywords.join(",")
				: normalizedMetadata.keywords,
		}),
		_meta({ name: "referrer", content: normalizedMetadata.referrer }),
		_meta({ name: "creator", content: normalizedMetadata.creator }),
		_meta({ name: "publisher", content: normalizedMetadata.publisher }),
		_meta({ name: "robots", content: normalizedMetadata.robots?.basic }),
		_meta({ name: "googlebot", content: normalizedMetadata.robots?.googleBot }),
		_meta({ name: "abstract", content: normalizedMetadata.abstract }),
		...(normalizedMetadata.other
			? Object.entries(normalizedMetadata.other).flatMap(([name, content]) => {
					if (Array.isArray(content)) {
						return content.map((contentItem) =>
							_meta({ name, content: contentItem }),
						);
					}
					return _meta({ name, content });
				})
			: []),
	];
}

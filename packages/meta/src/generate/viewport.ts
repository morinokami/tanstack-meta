import { normalizeViewportLayout } from "../normalize/viewport";
import type { NormalizedMetadata, OutputMeta } from "../types/io";
import { createMetaTag, flattenMetaList } from "./utils";

export function generateViewport(metadata: NormalizedMetadata): OutputMeta {
	const { viewport } = metadata;

	if (!viewport) return [];

	const viewportContent = normalizeViewportLayout(viewport);
	return flattenMetaList([
		createMetaTag({
			name: "viewport",
			content: viewportContent ?? undefined,
		}),
		...(viewport.themeColor
			? viewport.themeColor.map((themeColor) =>
					createMetaTag({
						name: "theme-color",
						content: themeColor.color,
						media: themeColor.media,
					}),
				)
			: []),
		createMetaTag({
			name: "color-scheme",
			content: viewport.colorScheme ?? undefined,
		}),
	]);
}

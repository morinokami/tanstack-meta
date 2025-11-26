import type { AlternateLinkDescriptor } from "../types/alternative-urls-types";
import type { NormalizedMetadata, OutputLinks } from "../types/io";
import { flattenMetaList } from "./utils";

type LinkObject = {
	rel?: string;
	href?: string;
	hrefLang?: string;
	media?: string;
	type?: string;
	title?: string;
	[key: string]: unknown;
};

function createAlternateLink({
	descriptor,
	...props
}: {
	descriptor: AlternateLinkDescriptor;
} & LinkObject) {
	if (!descriptor.url) return null;
	return {
		...props,
		...(descriptor.title && { title: descriptor.title }),
		href: descriptor.url.toString(),
	};
}

export function generateAlternatesLinks(
	metadata: NormalizedMetadata,
): OutputLinks {
	const { alternates } = metadata;

	if (!alternates) return [];

	const { canonical, languages, media, types } = alternates;

	return flattenMetaList([
		canonical
			? createAlternateLink({ rel: "canonical", descriptor: canonical })
			: null,
		languages
			? Object.entries(languages).flatMap(([locale, descriptors]) =>
					descriptors?.map((descriptor) =>
						createAlternateLink({
							rel: "alternate",
							hrefLang: locale,
							descriptor,
						}),
					),
				)
			: null,
		media
			? Object.entries(media).flatMap(([mediaName, descriptors]) =>
					descriptors?.map((descriptor) =>
						createAlternateLink({
							rel: "alternate",
							media: mediaName,
							descriptor,
						}),
					),
				)
			: null,
		types
			? Object.entries(types).flatMap(([type, descriptors]) =>
					descriptors?.map((descriptor) =>
						createAlternateLink({ rel: "alternate", type, descriptor }),
					),
				)
			: null,
	]);
}

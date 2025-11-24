import type { AlternateLinkDescriptor } from "../types/alternative-urls-types";
import type { NormalizedMetadata, OutputLinks } from "../types/io";
import { nonNullable } from "./utils";

function AlternateLink({
	descriptor,
	...props
}: {
	descriptor: AlternateLinkDescriptor;
} & React.LinkHTMLAttributes<HTMLLinkElement>) {
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

	return [
		canonical
			? AlternateLink({ rel: "canonical", descriptor: canonical })
			: null,
		languages
			? Object.entries(languages).flatMap(([locale, descriptors]) =>
					descriptors?.map((descriptor) =>
						AlternateLink({ rel: "alternate", hrefLang: locale, descriptor }),
					),
				)
			: null,
		media
			? Object.entries(media).flatMap(([mediaName, descriptors]) =>
					descriptors?.map((descriptor) =>
						AlternateLink({ rel: "alternate", media: mediaName, descriptor }),
					),
				)
			: null,
		types
			? Object.entries(types).flatMap(([type, descriptors]) =>
					descriptors?.map((descriptor) =>
						AlternateLink({ rel: "alternate", type, descriptor }),
					),
				)
			: null,
	]
		.flat()
		.filter(nonNullable);
}

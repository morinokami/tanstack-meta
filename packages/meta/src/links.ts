import { generateAlternatesLinks } from "./generate/alternates";
import { generateAppleWebAppLinks, generateBasicLinks } from "./generate/basic";
import { generateIcons } from "./generate/icons";
import { nonNullable } from "./generate/utils";
import type { NormalizedMetadata, OutputLinks } from "./types/io";

export function links(metadata: NormalizedMetadata): OutputLinks {
	return [
		generateBasicLinks(metadata),
		generateAlternatesLinks(metadata),
		generateAppleWebAppLinks(metadata),
		generateIcons(metadata),
	]
		.flat()
		.filter(nonNullable);
}

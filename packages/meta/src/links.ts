import { generateBasicLinks } from "./generate/basic";
import { generateIcons } from "./generate/icons";
import { nonNullable } from "./generate/utils";
import type { InputMetadata, OutputLinks } from "./types/io";

export function links(metadata: InputMetadata): OutputLinks {
	return [generateBasicLinks(metadata), generateIcons(metadata)]
		.flat()
		.filter(nonNullable);
}

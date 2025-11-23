import { generateBasicLinks } from "./generate/basic";
import { nonNullable } from "./generate/utils";
import type { InputMetadata, OutputLinks } from "./types/io";

export function links(metadata: InputMetadata): OutputLinks {
	return [generateBasicLinks(metadata)].flat().filter(nonNullable);
}

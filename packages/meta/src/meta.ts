import {
	generateBasic,
	generateFacebook,
	generateFormatDetection,
	generatePinterest,
	generateVerification,
} from "./generate/basic";
import {
	generateAppLinks,
	generateOpenGraph,
	generateTwitter,
} from "./generate/opengraph";
import { nonNullable } from "./generate/utils";
import type { InputMetadata, OutputMeta } from "./types/io";

export function meta(metadata: InputMetadata): OutputMeta {
	// https://github.com/vercel/next.js/blob/d89a7a07fd30f50ef889f0d505a95edb8a99cf69/packages/next/src/lib/metadata/metadata.tsx#L353
	return [
		generateBasic(metadata),
		generateFacebook(metadata),
		generatePinterest(metadata),
		generateFormatDetection(metadata),
		generateVerification(metadata),
		generateOpenGraph(metadata),
		generateTwitter(metadata),
		generateAppLinks(metadata),
	]
		.flat()
		.filter(nonNullable);
}

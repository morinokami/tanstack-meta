import {
	generateAppleWebAppMeta,
	generateBasicMeta,
	generateFacebook,
	generateFormatDetection,
	generateItunes,
	generatePinterest,
	generateVerification,
} from "./generate/basic";
import {
	generateAppLinks,
	generateOpenGraph,
	generateTwitter,
} from "./generate/opengraph";
import { _metaFilter } from "./generate/utils";
import type { NormalizedMetadata, OutputMeta } from "./types/io";

export function meta(metadata: NormalizedMetadata): OutputMeta {
	// https://github.com/vercel/next.js/blob/d89a7a07fd30f50ef889f0d505a95edb8a99cf69/packages/next/src/lib/metadata/metadata.tsx#L353
	return _metaFilter([
		generateBasicMeta(metadata),
		generateItunes(metadata),
		generateFacebook(metadata),
		generatePinterest(metadata),
		generateFormatDetection(metadata),
		generateVerification(metadata),
		generateAppleWebAppMeta(metadata),
		generateOpenGraph(metadata),
		generateTwitter(metadata),
		generateAppLinks(metadata),
	]);
}

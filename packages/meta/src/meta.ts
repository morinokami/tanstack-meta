import { generateBasic } from "./generate/basic";
import type { InputMetadata, OutputMetadata } from "./types";

export function meta(metadata: InputMetadata): NonNullable<OutputMetadata> {
	// https://github.com/vercel/next.js/blob/d89a7a07fd30f50ef889f0d505a95edb8a99cf69/packages/next/src/lib/metadata/metadata.tsx#L353
	return [generateBasic(metadata)].flat();
}

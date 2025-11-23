// https://github.com/vercel/next.js/blob/f0af7cd02bb14b7e1cba9eb94c005e7ef582d9cf/packages/next/src/lib/metadata/types/resolvers.ts

import type { Metadata, ResolvedMetadataWithURLs } from "./metadata-interface";

export type FieldResolver<
	Key extends keyof Data & keyof ResolvedData,
	Data = Metadata,
	ResolvedData = ResolvedMetadataWithURLs,
> = (T: Data[Key]) => ResolvedData[Key];

export type FieldResolverExtraArgs<
	Key extends keyof Data & keyof ResolvedData,
	ExtraArgs extends unknown[] = any[],
	Data = Metadata,
	ResolvedData = ResolvedMetadataWithURLs,
> = (T: Data[Key], ...args: ExtraArgs) => ResolvedData[Key];

export type AsyncFieldResolverExtraArgs<
	Key extends keyof Data & keyof ResolvedData,
	ExtraArgs extends unknown[] = any[],
	Data = Metadata,
	ResolvedData = ResolvedMetadataWithURLs,
> = (T: Data[Key], ...args: ExtraArgs) => Promise<ResolvedData[Key]>;

export type MetadataContext = {
	trailingSlash: boolean;
	isStaticMetadataRouteFile: boolean;
};

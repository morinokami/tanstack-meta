import type { AnyRouteMatch } from "@tanstack/react-router";
import type { Metadata as NextMetadata, ResolvedMetadata } from "next";
import type { ResolvedMetadataWithURLs } from "next/dist/lib/metadata/types/metadata-interface";

// Simplify the type of the title property in the opengraph type
export type SimplifyTitleInUnion<T> = T extends { title?: unknown }
	? Omit<T, "title"> & { title?: string }
	: T;

export type InputMetadata = {
	// TODO: metadataBase
	charSet?: string | null;
	title?: string | null;
	description?: NextMetadata["description"];
	applicationName?: NextMetadata["applicationName"];
	// authors: NextMetadata["authors"];
	// manifest: NextMetadata["manifest"];
	generator?: NextMetadata["generator"];
	keywords?: NextMetadata["keywords"];
	referrer?: NextMetadata["referrer"];
	creator?: NextMetadata["creator"];
	publisher?: NextMetadata["publisher"];
	robots?: NextMetadata["robots"];
	abstract?: NextMetadata["abstract"];
	category?: NextMetadata["category"];
	classification?: NextMetadata["classification"];
	other?: NextMetadata["other"];

	facebook?: NextMetadata["facebook"];
	formatDetection?: NextMetadata["formatDetection"];
	verification?: NextMetadata["verification"];
	openGraph?: SimplifyTitleInUnion<NextMetadata["openGraph"]>;
	twitter?: SimplifyTitleInUnion<NextMetadata["twitter"]>;
	appLinks?: NextMetadata["appLinks"];
};

export type NormalizedMetadata = {
	charSet: string | null;
	title: string | null;
	description: ResolvedMetadata["description"];
	applicationName: ResolvedMetadata["applicationName"];
	generator: ResolvedMetadata["generator"];
	keywords: ResolvedMetadata["keywords"];
	referrer: ResolvedMetadata["referrer"];
	creator: ResolvedMetadata["creator"];
	publisher: ResolvedMetadata["publisher"];
	robots: ResolvedMetadata["robots"];
	abstract: ResolvedMetadata["abstract"];
	category: ResolvedMetadata["category"];
	classification: ResolvedMetadata["classification"];
	other: ResolvedMetadata["other"];

	facebook: ResolvedMetadata["facebook"];
	formatDetection: ResolvedMetadata["formatDetection"];
	verification: ResolvedMetadata["verification"];
	openGraph: SimplifyTitleInUnion<ResolvedMetadata["openGraph"]>;
	twitter: SimplifyTitleInUnion<ResolvedMetadata["twitter"]>;
	appLinks: ResolvedMetadataWithURLs["appLinks"];
};

export type OutputMeta = NonNullable<AnyRouteMatch["meta"]>;
export type OutputLinks = NonNullable<AnyRouteMatch["links"]>;

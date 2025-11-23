import type { AnyRouteMatch } from "@tanstack/react-router";
import type { Metadata as NextMetadata, ResolvedMetadata } from "next";

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

	openGraph?: SimplifyTitleInUnion<NextMetadata["openGraph"]>;
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

	openGraph: SimplifyTitleInUnion<ResolvedMetadata["openGraph"]>;
};

export type OutputMetadata = AnyRouteMatch["meta"];

import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import type { OpenGraph } from "../types/opengraph-types";
import { resolveUrl } from "./utils";

type OGMediaDescriptor = {
	url: string | URL;
	secureUrl?: string | URL | undefined;
	[key: string]: unknown;
};

type OGMedia = string | URL | OGMediaDescriptor;

function resolveOGMedia<T extends OGMedia>(media: T, baseUrl: string | URL): T {
	if (typeof media === "string") {
		return resolveUrl(media, baseUrl) as T;
	}

	if (media instanceof URL) {
		return resolveUrl(media, baseUrl) as T;
	}

	const resolved: OGMediaDescriptor = {
		...media,
		url: resolveUrl(media.url, baseUrl),
	};

	if (media.secureUrl) {
		resolved.secureUrl = resolveUrl(media.secureUrl, baseUrl);
	}

	return resolved as T;
}

function resolveOGMediaArray<T extends OGMedia>(
	media: T | T[] | undefined,
	baseUrl: string | URL,
): T | T[] | undefined {
	if (!media) return media;

	if (Array.isArray(media)) {
		return media.map((m) => resolveOGMedia(m, baseUrl));
	}

	return resolveOGMedia(media, baseUrl);
}

type UrlOrDescriptor =
	| string
	| URL
	| { url: string | URL; [key: string]: unknown };

function resolveUrlOrDescriptor<T extends UrlOrDescriptor>(
	value: T,
	baseUrl: string | URL,
): T {
	if (typeof value === "string") {
		return resolveUrl(value, baseUrl) as T;
	}

	if (value instanceof URL) {
		return resolveUrl(value, baseUrl) as T;
	}

	const descriptor = value as { url: string | URL; [key: string]: unknown };
	return { ...descriptor, url: resolveUrl(descriptor.url, baseUrl) } as T;
}

function resolveUrlOrDescriptorArray<T extends UrlOrDescriptor>(
	value: T | T[] | null | undefined,
	baseUrl: string | URL,
): T | T[] | null | undefined {
	if (!value) return value;

	if (Array.isArray(value)) {
		return value.map((v) => resolveUrlOrDescriptor(v, baseUrl));
	}

	return resolveUrlOrDescriptor(value, baseUrl);
}

export function resolveOpenGraph(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["openGraph"] {
	const { openGraph } = metadata;

	if (!openGraph || !baseUrl) return openGraph;

	const resolved: OpenGraph = { ...openGraph };

	// Base URL field
	if (openGraph.url) {
		resolved.url = resolveUrl(openGraph.url, baseUrl);
	}

	// Media fields
	if (openGraph.images) {
		resolved.images = resolveOGMediaArray(openGraph.images, baseUrl);
	}
	if (openGraph.audio) {
		resolved.audio = resolveOGMediaArray(openGraph.audio, baseUrl);
	}
	if (openGraph.videos) {
		resolved.videos = resolveOGMediaArray(openGraph.videos, baseUrl);
	}

	// Type-specific URL fields
	if ("authors" in openGraph && openGraph.authors) {
		(resolved as { authors?: unknown }).authors = resolveUrlOrDescriptorArray(
			openGraph.authors,
			baseUrl,
		);
	}
	if ("musicians" in openGraph && openGraph.musicians) {
		(resolved as { musicians?: unknown }).musicians =
			resolveUrlOrDescriptorArray(openGraph.musicians, baseUrl);
	}
	if ("albums" in openGraph && openGraph.albums) {
		(resolved as { albums?: unknown }).albums = resolveUrlOrDescriptorArray(
			openGraph.albums,
			baseUrl,
		);
	}
	if ("songs" in openGraph && openGraph.songs) {
		(resolved as { songs?: unknown }).songs = resolveUrlOrDescriptorArray(
			openGraph.songs,
			baseUrl,
		);
	}
	if ("creators" in openGraph && openGraph.creators) {
		(resolved as { creators?: unknown }).creators = resolveUrlOrDescriptorArray(
			openGraph.creators,
			baseUrl,
		);
	}
	if ("actors" in openGraph && openGraph.actors) {
		(resolved as { actors?: unknown }).actors = resolveUrlOrDescriptorArray(
			openGraph.actors,
			baseUrl,
		);
	}
	if ("directors" in openGraph && openGraph.directors) {
		(resolved as { directors?: unknown }).directors =
			resolveUrlOrDescriptorArray(openGraph.directors, baseUrl);
	}
	if ("writers" in openGraph && openGraph.writers) {
		(resolved as { writers?: unknown }).writers = resolveUrlOrDescriptorArray(
			openGraph.writers,
			baseUrl,
		);
	}
	if ("series" in openGraph && openGraph.series) {
		(resolved as { series?: unknown }).series = resolveUrlOrDescriptor(
			openGraph.series,
			baseUrl,
		);
	}

	return resolved;
}

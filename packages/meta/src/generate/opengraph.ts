import { normalizeMetadata } from "../normalize";
import type { InputMetadata, OutputMetadata } from "../types/io";
import { _meta, _multiMeta } from "./utils";

// https://github.com/vercel/next.js/blob/f9f625b90e6d4a562758c6a43234e168dcc23aa1/packages/next/src/lib/metadata/generate/opengraph.tsx
export function generateOpenGraph(metadata: InputMetadata): OutputMetadata {
	const { openGraph } = normalizeMetadata(metadata);

	if (!openGraph) return [];

	let typedOpenGraph;
	if ("type" in openGraph) {
		const openGraphType = openGraph.type;
		switch (openGraphType) {
			case "website":
				typedOpenGraph = [_meta({ property: "og:type", content: "website" })];
				break;
			case "article":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "article" }),
					_meta({
						property: "article:published_time",
						content: openGraph.publishedTime?.toString(),
					}),
					_meta({
						property: "article:modified_time",
						content: openGraph.modifiedTime?.toString(),
					}),
					_meta({
						property: "article:expiration_time",
						content: openGraph.expirationTime?.toString(),
					}),
					_multiMeta({
						propertyPrefix: "article:author",
						contents: openGraph.authors,
					}),
					_meta({ property: "article:section", content: openGraph.section }),
					_multiMeta({
						propertyPrefix: "article:tag",
						contents: openGraph.tags,
					}),
				];
				break;
			case "book":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "book" }),
					_meta({ property: "book:isbn", content: openGraph.isbn }),
					_meta({
						property: "book:release_date",
						content: openGraph.releaseDate,
					}),
					_multiMeta({
						propertyPrefix: "book:author",
						contents: openGraph.authors,
					}),
					_multiMeta({ propertyPrefix: "book:tag", contents: openGraph.tags }),
				];
				break;
			case "profile":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "profile" }),
					_meta({
						property: "profile:first_name",
						content: openGraph.firstName,
					}),
					_meta({ property: "profile:last_name", content: openGraph.lastName }),
					_meta({ property: "profile:username", content: openGraph.username }),
					_meta({ property: "profile:gender", content: openGraph.gender }),
				];
				break;
			case "music.song":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "music.song" }),
					_meta({
						property: "music:duration",
						content: openGraph.duration?.toString(),
					}),
					_multiMeta({
						propertyPrefix: "music:album",
						contents: openGraph.albums,
					}),
					_multiMeta({
						propertyPrefix: "music:musician",
						contents: openGraph.musicians,
					}),
				];
				break;
			case "music.album":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "music.album" }),
					_multiMeta({
						propertyPrefix: "music:song",
						contents: openGraph.songs,
					}),
					_multiMeta({
						propertyPrefix: "music:musician",
						contents: openGraph.musicians,
					}),
					_meta({
						property: "music:release_date",
						content: openGraph.releaseDate,
					}),
				];
				break;
			case "music.playlist":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "music.playlist" }),
					_multiMeta({
						propertyPrefix: "music:song",
						contents: openGraph.songs,
					}),
					_multiMeta({
						propertyPrefix: "music:creator",
						contents: openGraph.creators,
					}),
				];
				break;
			case "music.radio_station":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "music.radio_station" }),
					_multiMeta({
						propertyPrefix: "music:creator",
						contents: openGraph.creators,
					}),
				];
				break;

			case "video.movie":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "video.movie" }),
					_multiMeta({
						propertyPrefix: "video:actor",
						contents: openGraph.actors,
					}),
					_multiMeta({
						propertyPrefix: "video:director",
						contents: openGraph.directors,
					}),
					_multiMeta({
						propertyPrefix: "video:writer",
						contents: openGraph.writers,
					}),
					_meta({ property: "video:duration", content: openGraph.duration }),
					_meta({
						property: "video:release_date",
						content: openGraph.releaseDate,
					}),
					_multiMeta({ propertyPrefix: "video:tag", contents: openGraph.tags }),
				];
				break;
			case "video.episode":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "video.episode" }),
					_multiMeta({
						propertyPrefix: "video:actor",
						contents: openGraph.actors,
					}),
					_multiMeta({
						propertyPrefix: "video:director",
						contents: openGraph.directors,
					}),
					_multiMeta({
						propertyPrefix: "video:writer",
						contents: openGraph.writers,
					}),
					_meta({ property: "video:duration", content: openGraph.duration }),
					_meta({
						property: "video:release_date",
						content: openGraph.releaseDate,
					}),
					_multiMeta({ propertyPrefix: "video:tag", contents: openGraph.tags }),
					_meta({ property: "video:series", content: openGraph.series }),
				];
				break;
			case "video.tv_show":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "video.tv_show" }),
				];
				break;
			case "video.other":
				typedOpenGraph = [
					_meta({ property: "og:type", content: "video.other" }),
				];
				break;

			default: {
				const _exhaustiveCheck: never = openGraphType;
				throw new Error(`Invalid OpenGraph type: ${_exhaustiveCheck}`);
			}
		}
	}

	return [
		_meta({ property: "og:determiner", content: openGraph.determiner }),
		_meta({ property: "og:title", content: openGraph.title }),
		_meta({ property: "og:description", content: openGraph.description }),
		_meta({ property: "og:url", content: openGraph.url?.toString() }),
		_meta({ property: "og:site_name", content: openGraph.siteName }),
		_meta({ property: "og:locale", content: openGraph.locale }),
		_meta({ property: "og:country_name", content: openGraph.countryName }),
		_meta({ property: "og:ttl", content: openGraph.ttl?.toString() }),
		_multiMeta({ propertyPrefix: "og:image", contents: openGraph.images }),
		_multiMeta({ propertyPrefix: "og:video", contents: openGraph.videos }),
		_multiMeta({ propertyPrefix: "og:audio", contents: openGraph.audio }),
		_multiMeta({ propertyPrefix: "og:email", contents: openGraph.emails }),
		_multiMeta({
			propertyPrefix: "og:phone_number",
			contents: openGraph.phoneNumbers,
		}),
		_multiMeta({
			propertyPrefix: "og:fax_number",
			contents: openGraph.faxNumbers,
		}),
		_multiMeta({
			propertyPrefix: "og:locale:alternate",
			contents: openGraph.alternateLocale,
		}),
		...(typedOpenGraph ? typedOpenGraph.flat() : []),
	].flat();
}

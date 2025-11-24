import type { NormalizedMetadata, OutputMeta } from "../types/io";
import type { TwitterAppDescriptor } from "../types/twitter-types";
import { _meta, _multiMeta, nonNullable } from "./utils";

export function generateOpenGraph(metadata: NormalizedMetadata): OutputMeta {
	const { openGraph } = metadata;

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
	]
		.flat()
		.filter(nonNullable);
}

function TwitterAppItem({
	app,
	type,
}: {
	app: TwitterAppDescriptor;
	type: "iphone" | "ipad" | "googleplay";
}) {
	return [
		_meta({ name: `twitter:app:name:${type}`, content: app.name }),
		_meta({ name: `twitter:app:id:${type}`, content: app.id[type] }),
		_meta({
			name: `twitter:app:url:${type}`,
			content: app.url?.[type]?.toString(),
		}),
	];
}

export function generateTwitter(metadata: NormalizedMetadata): OutputMeta {
	const { twitter } = metadata;

	if (!twitter) return [];

	const { card } = twitter;
	return [
		_meta({ name: "twitter:card", content: card }),
		_meta({ name: "twitter:site", content: twitter.site }),
		_meta({ name: "twitter:site:id", content: twitter.siteId }),
		_meta({ name: "twitter:creator", content: twitter.creator }),
		_meta({ name: "twitter:creator:id", content: twitter.creatorId }),
		_meta({ name: "twitter:title", content: twitter.title }),
		_meta({ name: "twitter:description", content: twitter.description }),
		_multiMeta({ namePrefix: "twitter:image", contents: twitter.images }),
		...(card === "player"
			? twitter.players.flatMap((player) => [
					_meta({
						name: "twitter:player",
						content: player.playerUrl.toString(),
					}),
					_meta({
						name: "twitter:player:stream",
						content: player.streamUrl.toString(),
					}),
					_meta({ name: "twitter:player:width", content: player.width }),
					_meta({ name: "twitter:player:height", content: player.height }),
				])
			: []),
		...(card === "app"
			? [
					TwitterAppItem({ app: twitter.app, type: "iphone" }),
					TwitterAppItem({ app: twitter.app, type: "ipad" }),
					TwitterAppItem({ app: twitter.app, type: "googleplay" }),
				]
			: []),
	]
		.flat()
		.filter(nonNullable);
}

export function generateAppLinks(metadata: NormalizedMetadata): OutputMeta {
	const { appLinks } = metadata;

	if (!appLinks) return [];

	return [
		_multiMeta({ propertyPrefix: "al:ios", contents: appLinks.ios }),
		_multiMeta({ propertyPrefix: "al:iphone", contents: appLinks.iphone }),
		_multiMeta({ propertyPrefix: "al:ipad", contents: appLinks.ipad }),
		_multiMeta({ propertyPrefix: "al:android", contents: appLinks.android }),
		_multiMeta({
			propertyPrefix: "al:windows_phone",
			contents: appLinks.windows_phone,
		}),
		_multiMeta({ propertyPrefix: "al:windows", contents: appLinks.windows }),
		_multiMeta({
			propertyPrefix: "al:windows_universal",
			contents: appLinks.windows_universal,
		}),
		_multiMeta({ propertyPrefix: "al:web", contents: appLinks.web }),
	]
		.flat()
		.filter(nonNullable);
}

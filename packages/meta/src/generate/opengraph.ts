import type { NormalizedMetadata, OutputMeta } from "../types/io";
import type { TwitterAppDescriptor } from "../types/twitter-types";
import { createMetaList, createMetaTag, flattenMetaList } from "./utils";

export function generateOpenGraph(metadata: NormalizedMetadata): OutputMeta {
	const { openGraph } = metadata;

	if (!openGraph) return [];

	let typedOpenGraph: OutputMeta[number][] | undefined;
	if ("type" in openGraph) {
		const openGraphType = openGraph.type;
		switch (openGraphType) {
			case "website":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "website" }),
				]);
				break;
			case "article":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "article" }),
					createMetaTag({
						property: "article:published_time",
						content: openGraph.publishedTime?.toString(),
					}),
					createMetaTag({
						property: "article:modified_time",
						content: openGraph.modifiedTime?.toString(),
					}),
					createMetaTag({
						property: "article:expiration_time",
						content: openGraph.expirationTime?.toString(),
					}),
					createMetaList({
						propertyPrefix: "article:author",
						contents: openGraph.authors,
					}),
					createMetaTag({
						property: "article:section",
						content: openGraph.section,
					}),
					createMetaList({
						propertyPrefix: "article:tag",
						contents: openGraph.tags,
					}),
				]);
				break;
			case "book":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "book" }),
					createMetaTag({ property: "book:isbn", content: openGraph.isbn }),
					createMetaTag({
						property: "book:release_date",
						content: openGraph.releaseDate,
					}),
					createMetaList({
						propertyPrefix: "book:author",
						contents: openGraph.authors,
					}),
					createMetaList({
						propertyPrefix: "book:tag",
						contents: openGraph.tags,
					}),
				]);
				break;
			case "profile":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "profile" }),
					createMetaTag({
						property: "profile:first_name",
						content: openGraph.firstName,
					}),
					createMetaTag({
						property: "profile:last_name",
						content: openGraph.lastName,
					}),
					createMetaTag({
						property: "profile:username",
						content: openGraph.username,
					}),
					createMetaTag({
						property: "profile:gender",
						content: openGraph.gender,
					}),
				]);
				break;
			case "music.song":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "music.song" }),
					createMetaTag({
						property: "music:duration",
						content: openGraph.duration?.toString(),
					}),
					createMetaList({
						propertyPrefix: "music:album",
						contents: openGraph.albums,
					}),
					createMetaList({
						propertyPrefix: "music:musician",
						contents: openGraph.musicians,
					}),
				]);
				break;
			case "music.album":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "music.album" }),
					createMetaList({
						propertyPrefix: "music:song",
						contents: openGraph.songs,
					}),
					createMetaList({
						propertyPrefix: "music:musician",
						contents: openGraph.musicians,
					}),
					createMetaTag({
						property: "music:release_date",
						content: openGraph.releaseDate,
					}),
				]);
				break;
			case "music.playlist":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "music.playlist" }),
					createMetaList({
						propertyPrefix: "music:song",
						contents: openGraph.songs,
					}),
					createMetaList({
						propertyPrefix: "music:creator",
						contents: openGraph.creators,
					}),
				]);
				break;
			case "music.radio_station":
				typedOpenGraph = flattenMetaList([
					createMetaTag({
						property: "og:type",
						content: "music.radio_station",
					}),
					createMetaList({
						propertyPrefix: "music:creator",
						contents: openGraph.creators,
					}),
				]);
				break;

			case "video.movie":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "video.movie" }),
					createMetaList({
						propertyPrefix: "video:actor",
						contents: openGraph.actors,
					}),
					createMetaList({
						propertyPrefix: "video:director",
						contents: openGraph.directors,
					}),
					createMetaList({
						propertyPrefix: "video:writer",
						contents: openGraph.writers,
					}),
					createMetaTag({
						property: "video:duration",
						content: openGraph.duration,
					}),
					createMetaTag({
						property: "video:release_date",
						content: openGraph.releaseDate,
					}),
					createMetaList({
						propertyPrefix: "video:tag",
						contents: openGraph.tags,
					}),
				]);
				break;
			case "video.episode":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "video.episode" }),
					createMetaList({
						propertyPrefix: "video:actor",
						contents: openGraph.actors,
					}),
					createMetaList({
						propertyPrefix: "video:director",
						contents: openGraph.directors,
					}),
					createMetaList({
						propertyPrefix: "video:writer",
						contents: openGraph.writers,
					}),
					createMetaTag({
						property: "video:duration",
						content: openGraph.duration,
					}),
					createMetaTag({
						property: "video:release_date",
						content: openGraph.releaseDate,
					}),
					createMetaList({
						propertyPrefix: "video:tag",
						contents: openGraph.tags,
					}),
					createMetaTag({
						property: "video:series",
						content: openGraph.series,
					}),
				]);
				break;
			case "video.tv_show":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "video.tv_show" }),
				]);
				break;
			case "video.other":
				typedOpenGraph = flattenMetaList([
					createMetaTag({ property: "og:type", content: "video.other" }),
				]);
				break;

			default: {
				const _exhaustiveCheck: never = openGraphType;
				throw new Error(`Invalid OpenGraph type: ${_exhaustiveCheck}`);
			}
		}
	}

	return flattenMetaList([
		createMetaTag({ property: "og:determiner", content: openGraph.determiner }),
		createMetaTag({ property: "og:title", content: openGraph.title }),
		createMetaTag({
			property: "og:description",
			content: openGraph.description,
		}),
		createMetaTag({ property: "og:url", content: openGraph.url?.toString() }),
		createMetaTag({ property: "og:site_name", content: openGraph.siteName }),
		createMetaTag({ property: "og:locale", content: openGraph.locale }),
		createMetaTag({
			property: "og:country_name",
			content: openGraph.countryName,
		}),
		createMetaTag({ property: "og:ttl", content: openGraph.ttl?.toString() }),
		createMetaList({ propertyPrefix: "og:image", contents: openGraph.images }),
		createMetaList({ propertyPrefix: "og:video", contents: openGraph.videos }),
		createMetaList({ propertyPrefix: "og:audio", contents: openGraph.audio }),
		createMetaList({ propertyPrefix: "og:email", contents: openGraph.emails }),
		createMetaList({
			propertyPrefix: "og:phone_number",
			contents: openGraph.phoneNumbers,
		}),
		createMetaList({
			propertyPrefix: "og:fax_number",
			contents: openGraph.faxNumbers,
		}),
		createMetaList({
			propertyPrefix: "og:locale:alternate",
			contents: openGraph.alternateLocale,
		}),
		...(typedOpenGraph ?? []),
	]);
}

function createTwitterAppItem({
	app,
	type,
}: {
	app: TwitterAppDescriptor;
	type: "iphone" | "ipad" | "googleplay";
}) {
	return [
		createMetaTag({ name: `twitter:app:name:${type}`, content: app.name }),
		createMetaTag({ name: `twitter:app:id:${type}`, content: app.id[type] }),
		createMetaTag({
			name: `twitter:app:url:${type}`,
			content: app.url?.[type]?.toString(),
		}),
	];
}

export function generateTwitter(metadata: NormalizedMetadata): OutputMeta {
	const { twitter } = metadata;

	if (!twitter) return [];

	const { card } = twitter;
	return flattenMetaList([
		createMetaTag({ name: "twitter:card", content: card }),
		createMetaTag({ name: "twitter:site", content: twitter.site }),
		createMetaTag({ name: "twitter:site:id", content: twitter.siteId }),
		createMetaTag({ name: "twitter:creator", content: twitter.creator }),
		createMetaTag({ name: "twitter:creator:id", content: twitter.creatorId }),
		createMetaTag({ name: "twitter:title", content: twitter.title }),
		createMetaTag({
			name: "twitter:description",
			content: twitter.description,
		}),
		createMetaList({ namePrefix: "twitter:image", contents: twitter.images }),
		card === "player"
			? twitter.players.flatMap((player) => [
					createMetaTag({
						name: "twitter:player",
						content: player.playerUrl.toString(),
					}),
					createMetaTag({
						name: "twitter:player:stream",
						content: player.streamUrl.toString(),
					}),
					createMetaTag({
						name: "twitter:player:width",
						content: player.width,
					}),
					createMetaTag({
						name: "twitter:player:height",
						content: player.height,
					}),
				])
			: [],
		card === "app"
			? (["iphone", "ipad", "googleplay"] as const).flatMap((type) =>
					createTwitterAppItem({ app: twitter.app, type }),
				)
			: [],
	]);
}

export function generateAppLinks(metadata: NormalizedMetadata): OutputMeta {
	const { appLinks } = metadata;

	if (!appLinks) return [];

	return flattenMetaList([
		createMetaList({ propertyPrefix: "al:ios", contents: appLinks.ios }),
		createMetaList({ propertyPrefix: "al:iphone", contents: appLinks.iphone }),
		createMetaList({ propertyPrefix: "al:ipad", contents: appLinks.ipad }),
		createMetaList({
			propertyPrefix: "al:android",
			contents: appLinks.android,
		}),
		createMetaList({
			propertyPrefix: "al:windows_phone",
			contents: appLinks.windows_phone,
		}),
		createMetaList({
			propertyPrefix: "al:windows",
			contents: appLinks.windows,
		}),
		createMetaList({
			propertyPrefix: "al:windows_universal",
			contents: appLinks.windows_universal,
		}),
		createMetaList({ propertyPrefix: "al:web", contents: appLinks.web }),
	]);
}

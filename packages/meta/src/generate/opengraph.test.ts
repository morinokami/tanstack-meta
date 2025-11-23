import { describe, expect, test } from "bun:test";

import type { InputMetadata } from "../types/io";
import { generateOpenGraph } from "./opengraph";

describe("generateOpenGraph", () => {
	test("returns an empty array when openGraph is not provided", () => {
		expect(generateOpenGraph({})).toEqual([]);
	});

	test("generates base Open Graph tags and media descriptors", () => {
		const metadata: InputMetadata = {
			openGraph: {
				determiner: "the",
				title: "OG Title",
				description: "OG Description",
				url: "https://example.com/page",
				siteName: "Example Site",
				locale: "en_US",
				countryName: "USA",
				ttl: 9000,
				images: [
					{
						url: "https://img.com/a.png",
						secureUrl: "https://img.com/a-sec.png",
						width: 800,
						height: 600,
						alt: "Alt A",
					},
					"https://img.com/b.png",
				],
				videos: [
					{
						url: "https://cdn.com/video.mp4",
						secureUrl: "https://cdn.com/video-sec.mp4",
						width: 640,
						height: 480,
					},
				],
				audio: ["https://cdn.com/audio.mp3"],
				emails: ["info@example.com", "team@example.com"],
				phoneNumbers: ["12345", "67890"],
				faxNumbers: ["999"],
				alternateLocale: ["fr_FR", "ja_JP"],
			},
		};

		expect(generateOpenGraph(metadata)?.filter(Boolean) ?? []).toEqual([
			{ property: "og:determiner", content: "the" },
			{ property: "og:title", content: "OG Title" },
			{ property: "og:description", content: "OG Description" },
			{ property: "og:url", content: "https://example.com/page" },
			{ property: "og:site_name", content: "Example Site" },
			{ property: "og:locale", content: "en_US" },
			{ property: "og:country_name", content: "USA" },
			{ property: "og:ttl", content: "9000" },
			{ property: "og:image", content: "https://img.com/a.png" },
			{ property: "og:image:secure_url", content: "https://img.com/a-sec.png" },
			{ property: "og:image:width", content: "800" },
			{ property: "og:image:height", content: "600" },
			{ property: "og:image:alt", content: "Alt A" },
			{ property: "og:image", content: "https://img.com/b.png" },
			{ property: "og:video", content: "https://cdn.com/video.mp4" },
			{
				property: "og:video:secure_url",
				content: "https://cdn.com/video-sec.mp4",
			},
			{ property: "og:video:width", content: "640" },
			{ property: "og:video:height", content: "480" },
			{ property: "og:audio", content: "https://cdn.com/audio.mp3" },
			{ property: "og:email", content: "info@example.com" },
			{ property: "og:email", content: "team@example.com" },
			{ property: "og:phone_number", content: "12345" },
			{ property: "og:phone_number", content: "67890" },
			{ property: "og:fax_number", content: "999" },
			{ property: "og:locale:alternate", content: "fr_FR" },
			{ property: "og:locale:alternate", content: "ja_JP" },
		]);
	});

	test("handles multiple media entries and secureUrl-only descriptors", () => {
		const metadata: InputMetadata = {
			openGraph: {
				images: [
					{ url: "https://img.com/1.png" },
					{ url: "", secureUrl: "https://img.com/2-sec.png" },
					"https://img.com/3.png",
				],
				videos: [
					{ url: "https://vid.com/1.mp4" },
					{ url: "", secureUrl: "https://vid.com/2-sec.mp4" },
					"https://vid.com/3.mp4",
				],
				audio: [{ url: "https://aud.com/1.mp3" }, "https://aud.com/2.mp3"],
			},
		};

		expect(generateOpenGraph(metadata)?.filter(Boolean) ?? []).toEqual([
			{ property: "og:image", content: "https://img.com/1.png" },
			{ property: "og:image:secure_url", content: "https://img.com/2-sec.png" },
			{ property: "og:image", content: "https://img.com/3.png" },
			{ property: "og:video", content: "https://vid.com/1.mp4" },
			{ property: "og:video:secure_url", content: "https://vid.com/2-sec.mp4" },
			{ property: "og:video", content: "https://vid.com/3.mp4" },
			{ property: "og:audio", content: "https://aud.com/1.mp3" },
			{ property: "og:audio", content: "https://aud.com/2.mp3" },
		]);
	});

	describe("typed Open Graph variants", () => {
		const cases: {
			name: string;
			openGraph: NonNullable<InputMetadata["openGraph"]>;
			expected: Record<string, string>[];
		}[] = [
			{
				name: "article",
				openGraph: {
					type: "article",
					title: "Article Title",
					publishedTime: "2023-01-01",
					modifiedTime: "2023-01-02",
					expirationTime: "2024-01-01",
					authors: "https://example.com/author",
					section: "Tech",
					tags: ["tag-one", "tag-two"],
				},
				expected: [
					{ property: "og:title", content: "Article Title" },
					{ property: "og:type", content: "article" },
					{ property: "article:published_time", content: "2023-01-01" },
					{ property: "article:modified_time", content: "2023-01-02" },
					{ property: "article:expiration_time", content: "2024-01-01" },
					{
						property: "article:author",
						content: "https://example.com/author",
					},
					{ property: "article:section", content: "Tech" },
					{ property: "article:tag", content: "tag-one" },
					{ property: "article:tag", content: "tag-two" },
				],
			},
			{
				name: "book",
				openGraph: {
					type: "book",
					title: "Book Title",
					isbn: "9780000000",
					releaseDate: "2023-01-01",
					authors: ["Author A", "Author B"],
					tags: "fiction",
				},
				expected: [
					{ property: "og:title", content: "Book Title" },
					{ property: "og:type", content: "book" },
					{ property: "book:isbn", content: "9780000000" },
					{ property: "book:release_date", content: "2023-01-01" },
					{ property: "book:author", content: "Author A" },
					{ property: "book:author", content: "Author B" },
					{ property: "book:tag", content: "fiction" },
				],
			},
			{
				name: "profile",
				openGraph: {
					type: "profile",
					title: "Profile Title",
					firstName: "Jane",
					lastName: "Doe",
					username: "janedoe",
					gender: "female",
				},
				expected: [
					{ property: "og:title", content: "Profile Title" },
					{ property: "og:type", content: "profile" },
					{ property: "profile:first_name", content: "Jane" },
					{ property: "profile:last_name", content: "Doe" },
					{ property: "profile:username", content: "janedoe" },
					{ property: "profile:gender", content: "female" },
				],
			},
			{
				name: "music song",
				openGraph: {
					type: "music.song",
					title: "Song Title",
					duration: 180,
					albums: ["https://example.com/album"],
					musicians: ["Artist A", "Artist B"],
				},
				expected: [
					{ property: "og:title", content: "Song Title" },
					{ property: "og:type", content: "music.song" },
					{ property: "music:duration", content: "180" },
					{ property: "music:album", content: "https://example.com/album" },
					{ property: "music:musician", content: "Artist A" },
					{ property: "music:musician", content: "Artist B" },
				],
			},
			{
				name: "music album",
				openGraph: {
					type: "music.album",
					title: "Album Title",
					songs: ["https://example.com/song1", "https://example.com/song2"],
					musicians: ["Artist"],
					releaseDate: "2023-02-02",
				},
				expected: [
					{ property: "og:title", content: "Album Title" },
					{ property: "og:type", content: "music.album" },
					{ property: "music:song", content: "https://example.com/song1" },
					{ property: "music:song", content: "https://example.com/song2" },
					{ property: "music:musician", content: "Artist" },
					{ property: "music:release_date", content: "2023-02-02" },
				],
			},
			{
				name: "music playlist",
				openGraph: {
					type: "music.playlist",
					title: "Playlist Title",
					songs: ["https://example.com/song-pl"],
					creators: ["DJ Mike"],
				},
				expected: [
					{ property: "og:title", content: "Playlist Title" },
					{ property: "og:type", content: "music.playlist" },
					{ property: "music:song", content: "https://example.com/song-pl" },
					{ property: "music:creator", content: "DJ Mike" },
				],
			},
			{
				name: "music radio station",
				openGraph: {
					type: "music.radio_station",
					title: "Station Title",
					creators: ["Station Host"],
				},
				expected: [
					{ property: "og:title", content: "Station Title" },
					{ property: "og:type", content: "music.radio_station" },
					{ property: "music:creator", content: "Station Host" },
				],
			},
			{
				name: "video movie",
				openGraph: {
					type: "video.movie",
					title: "Movie Title",
					actors: ["https://example.com/actor"],
					directors: ["Director Name"],
					writers: ["Writer Name"],
					duration: 5400,
					releaseDate: "2023-05-05",
					tags: ["drama", "thriller"],
				},
				expected: [
					{ property: "og:title", content: "Movie Title" },
					{ property: "og:type", content: "video.movie" },
					{ property: "video:actor", content: "https://example.com/actor" },
					{ property: "video:director", content: "Director Name" },
					{ property: "video:writer", content: "Writer Name" },
					{ property: "video:duration", content: "5400" },
					{ property: "video:release_date", content: "2023-05-05" },
					{ property: "video:tag", content: "drama" },
					{ property: "video:tag", content: "thriller" },
				],
			},
			{
				name: "video episode",
				openGraph: {
					type: "video.episode",
					title: "Episode Title",
					actors: ["Actor One"],
					directors: ["Episode Director"],
					writers: ["Episode Writer"],
					duration: 3600,
					releaseDate: "2023-06-06",
					tags: "tv",
					series: "Series Name",
				},
				expected: [
					{ property: "og:title", content: "Episode Title" },
					{ property: "og:type", content: "video.episode" },
					{ property: "video:actor", content: "Actor One" },
					{ property: "video:director", content: "Episode Director" },
					{ property: "video:writer", content: "Episode Writer" },
					{ property: "video:duration", content: "3600" },
					{ property: "video:release_date", content: "2023-06-06" },
					{ property: "video:tag", content: "tv" },
					{ property: "video:series", content: "Series Name" },
				],
			},
			{
				name: "video tv show",
				openGraph: {
					type: "video.tv_show",
					title: "Show Title",
				},
				expected: [
					{ property: "og:title", content: "Show Title" },
					{ property: "og:type", content: "video.tv_show" },
				],
			},
			{
				name: "video other",
				openGraph: {
					type: "video.other",
					title: "Other Title",
				},
				expected: [
					{ property: "og:title", content: "Other Title" },
					{ property: "og:type", content: "video.other" },
				],
			},
			{
				name: "website",
				openGraph: {
					type: "website",
					title: "Website Title",
				},
				expected: [
					{ property: "og:title", content: "Website Title" },
					{ property: "og:type", content: "website" },
				],
			},
		];

		for (const { name, openGraph, expected } of cases) {
			test(name, () => {
				expect(generateOpenGraph({ openGraph })?.filter(Boolean) ?? []).toEqual(
					expected,
				);
			});
		}
	});
});

import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import type { Twitter, TwitterAppDescriptor } from "../types/twitter-types";
import { resolveUrl } from "./utils";

type TwitterImage =
	| string
	| URL
	| { url: string | URL; secureUrl?: string | URL };

function resolveTwitterImage<T extends TwitterImage>(
	image: T,
	baseUrl: string | URL,
): T {
	if (typeof image === "string") {
		return resolveUrl(image, baseUrl) as T;
	}

	if (image instanceof URL) {
		return resolveUrl(image, baseUrl) as T;
	}

	const descriptor = image as {
		url: string | URL;
		secureUrl?: string | URL;
		[key: string]: unknown;
	};
	const { url, secureUrl, ...rest } = descriptor;
	const resolved: { url: string; secureUrl?: string; [key: string]: unknown } =
		{
			...rest,
			url: resolveUrl(url, baseUrl),
		};

	if (secureUrl) {
		resolved.secureUrl = resolveUrl(secureUrl, baseUrl);
	}

	return resolved as T;
}

function resolveTwitterImages<T extends TwitterImage>(
	images: T | T[] | undefined,
	baseUrl: string | URL,
): T | T[] | undefined {
	if (!images) return images;

	if (Array.isArray(images)) {
		return images.map((image) => resolveTwitterImage(image, baseUrl));
	}

	return resolveTwitterImage(images, baseUrl);
}

type TwitterPlayer = {
	playerUrl: string | URL;
	streamUrl: string | URL;
	width: number;
	height: number;
};

function resolveTwitterPlayer(
	player: TwitterPlayer,
	baseUrl: string | URL,
): TwitterPlayer {
	return {
		...player,
		playerUrl: resolveUrl(player.playerUrl, baseUrl),
		streamUrl: resolveUrl(player.streamUrl, baseUrl),
	};
}

function resolveTwitterPlayers(
	players: TwitterPlayer | TwitterPlayer[] | undefined,
	baseUrl: string | URL,
): TwitterPlayer | TwitterPlayer[] | undefined {
	if (!players) return players;

	if (Array.isArray(players)) {
		return players.map((player) => resolveTwitterPlayer(player, baseUrl));
	}

	return resolveTwitterPlayer(players, baseUrl);
}

function resolveTwitterAppUrl(
	url: TwitterAppDescriptor["url"],
	baseUrl: string | URL,
): TwitterAppDescriptor["url"] {
	if (!url) return url;

	const resolved: NonNullable<TwitterAppDescriptor["url"]> = {};

	if (url.iphone) {
		resolved.iphone = resolveUrl(url.iphone, baseUrl);
	}
	if (url.ipad) {
		resolved.ipad = resolveUrl(url.ipad, baseUrl);
	}
	if (url.googleplay) {
		resolved.googleplay = resolveUrl(url.googleplay, baseUrl);
	}

	return resolved;
}

export function resolveTwitter(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["twitter"] {
	const { twitter } = metadata;

	if (!twitter || !baseUrl) return twitter;

	const resolved: Twitter = { ...twitter };

	// Resolve images
	if (twitter.images) {
		resolved.images = resolveTwitterImages(twitter.images, baseUrl);
	}

	// Resolve players (player card)
	if ("players" in twitter && twitter.players) {
		(resolved as { players: TwitterPlayer | TwitterPlayer[] }).players =
			resolveTwitterPlayers(twitter.players, baseUrl) as
				| TwitterPlayer
				| TwitterPlayer[];
	}

	// Resolve app URLs (app card)
	if ("app" in twitter && twitter.app?.url) {
		(resolved as { app: TwitterAppDescriptor }).app = {
			...twitter.app,
			url: resolveTwitterAppUrl(twitter.app.url, baseUrl),
		};
	}

	return resolved;
}

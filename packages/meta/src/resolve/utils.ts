export function resolveUrl(url: string | URL, baseUrl: string | URL): string {
	const urlString = url.toString();

	if (urlString.startsWith("http://") || urlString.startsWith("https://")) {
		return urlString;
	}

	return new URL(urlString, baseUrl).toString();
}

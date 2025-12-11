import type { GeneratorInputMetadata, InputMetadata } from "../types/io";
import type { Icon, Icons } from "../types/metadata-types";
import { resolveUrl } from "./utils";

function resolveIcon(icon: Icon, baseUrl: string | URL): Icon {
	if (typeof icon === "string" || icon instanceof URL) {
		return resolveUrl(icon, baseUrl);
	}

	return { ...icon, url: resolveUrl(icon.url, baseUrl) };
}

export function resolveIcons(
	metadata: GeneratorInputMetadata,
	baseUrl?: string | URL | null,
): InputMetadata["icons"] {
	const { icons } = metadata;
	if (!icons || !baseUrl) return icons;

	if (typeof icons === "string" || icons instanceof URL) {
		return resolveUrl(icons, baseUrl);
	}

	if (Array.isArray(icons)) {
		return icons.map((icon) => resolveIcon(icon, baseUrl));
	}

	const resolved: Icons = { ...icons };
	for (const key of ["icon", "shortcut", "apple"] as const) {
		const value = icons[key];
		if (value) {
			resolved[key] = Array.isArray(value)
				? value.map((i) => resolveIcon(i, baseUrl))
				: resolveIcon(value, baseUrl);
		}
	}
	if (icons.other) {
		resolved.other = Array.isArray(icons.other)
			? icons.other.map((i) => ({ ...i, url: resolveUrl(i.url, baseUrl) }))
			: { ...icons.other, url: resolveUrl(icons.other.url, baseUrl) };
	}

	return resolved;
}

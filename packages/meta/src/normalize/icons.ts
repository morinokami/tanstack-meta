import { IconKeys } from "../constants";
import type { ResolvedMetadataWithURLs } from "../types/metadata-interface";
import type { Icon, IconDescriptor } from "../types/metadata-types";
import type { FieldResolver } from "../types/resolvers";
import { resolveAsArrayOrUndefined } from "./utils";

function isStringOrURL(icon: any): icon is string | URL {
	return typeof icon === "string" || icon instanceof URL;
}

export function normalizeIcon(icon: Icon): IconDescriptor {
	if (isStringOrURL(icon)) return { url: icon };
	else if (Array.isArray(icon)) return icon;
	return icon;
}

export const normalizeIcons: FieldResolver<"icons"> = (icons) => {
	if (!icons) {
		return null;
	}

	const resolved: ResolvedMetadataWithURLs["icons"] = {
		icon: [],
		apple: [],
	};
	if (Array.isArray(icons)) {
		resolved.icon = icons.map(normalizeIcon).filter(Boolean);
	} else if (isStringOrURL(icons)) {
		resolved.icon = [normalizeIcon(icons)];
	} else {
		for (const key of IconKeys) {
			const values = resolveAsArrayOrUndefined(icons[key]);
			if (values) resolved[key] = values.map(normalizeIcon);
		}
	}
	return resolved;
};

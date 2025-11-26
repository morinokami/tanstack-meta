import { IconKeys } from "../constants";
import type { ResolvedMetadataWithURLs } from "../types/metadata-interface";
import type { Icon, IconDescriptor } from "../types/metadata-types";
import type { FieldResolver } from "../types/resolvers";
import { isStringOrURL, resolveAsArrayOrUndefined } from "./utils";

const isNonNullableIcon = (
	icon: IconDescriptor | null | undefined,
): icon is IconDescriptor => Boolean(icon);

export function normalizeIcon(
	icon: Icon | null | undefined,
): IconDescriptor | null | undefined {
	if (isStringOrURL(icon)) return { url: icon };
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
		resolved.icon = icons.map(normalizeIcon).filter(isNonNullableIcon);
	} else if (isStringOrURL(icons)) {
		const normalized = normalizeIcon(icons);
		resolved.icon = normalized ? [normalized] : [];
	} else {
		for (const key of IconKeys) {
			const values = resolveAsArrayOrUndefined(icons[key]);
			if (values) {
				const normalized = values.map(normalizeIcon).filter(isNonNullableIcon);
				if (normalized.length) {
					resolved[key] = normalized;
				}
			}
		}
	}
	return resolved;
};

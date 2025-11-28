import { ViewportMetaKeys } from "../constants";
import type { ViewportLayout } from "../types/extra-types";
import type { ResolvedViewport, Viewport } from "../types/metadata-interface";
import { resolveAsArrayOrUndefined } from "./utils";

export function normalizeViewportLayout(viewport: Viewport) {
	let resolved: string | null = null;

	if (viewport && typeof viewport === "object") {
		resolved = "";
		for (const viewportKey_ in ViewportMetaKeys) {
			const viewportKey = viewportKey_ as keyof ViewportLayout;
			if (viewportKey in viewport) {
				let value = viewport[viewportKey];
				if (typeof value === "boolean") {
					value = value ? "yes" : "no";
				} else if (!value && viewportKey === "initialScale") {
					value = undefined;
				}
				if (value) {
					if (resolved) resolved += ", ";
					resolved += `${ViewportMetaKeys[viewportKey]}=${value}`;
				}
			}
		}
	}

	return resolved;
}

function normalizeThemeColor(themeColor: Viewport["themeColor"]) {
	if (!themeColor) return null;

	const themeColorDescriptors: Viewport["themeColor"] = [];

	resolveAsArrayOrUndefined(themeColor)?.forEach((descriptor) => {
		if (typeof descriptor === "string")
			themeColorDescriptors.push({ color: descriptor });
		else if (typeof descriptor === "object")
			themeColorDescriptors.push({
				color: descriptor.color,
				media: descriptor.media,
			});
	});

	return themeColorDescriptors;
}

export function normalizeViewport(
	viewport: Viewport | null,
): ResolvedViewport | null {
	if (!viewport) return null;

	const newResolvedViewport: ResolvedViewport = {
		themeColor: null,
		colorScheme: null,
	};

	if (viewport) {
		for (const key_ in viewport) {
			const key = key_ as keyof Viewport;

			switch (key) {
				case "themeColor": {
					newResolvedViewport.themeColor = normalizeThemeColor(
						viewport.themeColor,
					);
					break;
				}
				case "colorScheme":
					newResolvedViewport.colorScheme = viewport.colorScheme || null;
					break;
				case "width":
				case "height":
				case "initialScale":
				case "minimumScale":
				case "maximumScale":
				case "userScalable":
				case "viewportFit":
				case "interactiveWidget":
					// always override the target with the source
					// @ts-expect-error: viewport properties
					newResolvedViewport[key] = viewport[key];
					break;
				default:
					key satisfies never;
			}
		}
	}

	return newResolvedViewport;
}

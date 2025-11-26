import type { NormalizedMetadata, OutputLinks } from "../types/io";
import type { Icon, IconDescriptor } from "../types/metadata-types";
import { flattenMetaList } from "./utils";

function createIconDescriptorLink({ icon }: { icon: IconDescriptor }) {
	const { url, rel = "icon", ...props } = icon;

	return { rel, href: url.toString(), ...props };
}

function createIconLink({ rel, icon }: { rel?: string; icon: Icon }) {
	if (typeof icon === "object" && !(icon instanceof URL)) {
		const iconWithRel = icon.rel || !rel ? icon : { ...icon, rel };
		return createIconDescriptorLink({ icon: iconWithRel });
	} else {
		const href = icon.toString();
		return { rel, href };
	}
}

export function generateIcons(metadata: NormalizedMetadata): OutputLinks {
	const { icons } = metadata;

	if (!icons) return [];

	const shortcutList = icons.shortcut;
	const iconList = icons.icon;
	const appleList = icons.apple;
	const otherList = icons.other;

	const hasIcon = Boolean(
		shortcutList?.length ||
			iconList?.length ||
			appleList?.length ||
			otherList?.length,
	);
	if (!hasIcon) return [];

	return flattenMetaList([
		shortcutList
			? shortcutList.map((icon) =>
					createIconLink({ rel: "shortcut icon", icon }),
				)
			: [],
		iconList
			? iconList.map((icon) => createIconLink({ rel: "icon", icon }))
			: [],
		appleList
			? appleList.map((icon) =>
					createIconLink({ rel: "apple-touch-icon", icon }),
				)
			: [],
		otherList
			? otherList.map((icon) => createIconDescriptorLink({ icon }))
			: [],
		// hasIcon ? <IconMark /> : null,
	]);
}

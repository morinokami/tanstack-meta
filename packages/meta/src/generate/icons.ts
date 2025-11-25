import type { NormalizedMetadata, OutputLinks } from "../types/io";
import type { Icon, IconDescriptor } from "../types/metadata-types";
import { _metaFilter } from "./utils";

function IconDescriptorLink({ icon }: { icon: IconDescriptor }) {
	const { url, rel = "icon", ...props } = icon;

	return { rel, href: url.toString(), ...props };
}

function IconLink({ rel, icon }: { rel?: string; icon: Icon }) {
	if (typeof icon === "object" && !(icon instanceof URL)) {
		const iconWithRel = icon.rel || !rel ? icon : { ...icon, rel };
		return IconDescriptorLink({ icon: iconWithRel });
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

	return _metaFilter([
		shortcutList
			? shortcutList.map((icon) => IconLink({ rel: "shortcut icon", icon }))
			: [],
		iconList ? iconList.map((icon) => IconLink({ rel: "icon", icon })) : [],
		appleList
			? appleList.map((icon) => IconLink({ rel: "apple-touch-icon", icon }))
			: [],
		otherList ? otherList.map((icon) => IconDescriptorLink({ icon })) : [],
		// hasIcon ? <IconMark /> : null,
	]);
}

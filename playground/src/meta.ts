import { createMetadataGenerator } from "tanstack-meta";

export const generateMetadata = createMetadataGenerator({
	titleTemplate: {
		default: "TanStack | High Quality Open-Source Software for Web Developers",
		template: "%s | High Quality Open-Source Software for Web Developers",
	},
});

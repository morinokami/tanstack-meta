import { createMetadataGenerator } from "tanstack-meta";

export const generateMetadata = createMetadataGenerator({
	titleTemplate: {
		default: "TanStack",
		template: "%s | High Quality Open-Source Software for Web Developers",
	},
});

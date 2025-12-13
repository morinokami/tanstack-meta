import { createArrayUrlResolver, createSingleUrlResolver } from "./utils";

export const resolveArchives = createArrayUrlResolver("archives");
export const resolveAssets = createArrayUrlResolver("assets");
export const resolveBookmarks = createArrayUrlResolver("bookmarks");
export const resolveManifest = createSingleUrlResolver("manifest");

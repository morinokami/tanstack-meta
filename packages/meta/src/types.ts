import type { AnyRouteMatch } from "@tanstack/react-router";
import type { Metadata as NextMetadata } from "next";

export type InputMetadata = {
	title?: string | null;
	description?: string | null;
};

export type OutputMetadata = AnyRouteMatch["meta"];

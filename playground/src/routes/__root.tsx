import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { generateMetadata } from "tanstack-meta";

import Header from "../components/Header";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => {
		const { meta, links } = generateMetadata({
			charSet: "utf-8",
			title: "TanStack Start Starter",
			alternates: {
				canonical: "https://nextjs.org",
				languages: {
					"en-US": "https://nextjs.org/en-US",
					"de-DE": "https://nextjs.org/de-DE",
				},
				media: {
					"only screen and (max-width: 600px)": "https://nextjs.org/mobile",
				},
				types: {
					"application/rss+xml": "https://nextjs.org/rss",
				},
			},
		});

		return {
			meta: [
				{
					name: "viewport",
					content: "width=device-width, initial-scale=1",
				},
				...meta,
			],
			links: [
				{
					rel: "stylesheet",
					href: appCss,
				},
				...links,
			],
		};
	},

	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header />
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

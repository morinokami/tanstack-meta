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
			icons: {
				icon: [
					{ url: "/icon.png" },
					new URL("/icon.png", "https://example.com"),
					{ url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
				],
				shortcut: ["/shortcut-icon.png"],
				apple: [
					{ url: "/apple-icon.png" },
					{ url: "/apple-icon-x3.png", sizes: "180x180", type: "image/png" },
				],
				other: [
					{
						rel: "apple-touch-icon-precomposed",
						url: "/apple-touch-icon-precomposed.png",
					},
				],
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

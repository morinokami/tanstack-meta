import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { generateMetadata } from "../meta";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => {
		const title =
			"TanStack | High Quality Open-Source Software for Web Developers";
		const description =
			"Headless, type-safe, powerful utilities for complex workflows like Data Management, Data Visualization, Charts, Tables, and UI Components.";
		const ogImage = "https://tanstack.com/assets/og-C0HGjoLl.png";

		const { meta, links } = generateMetadata({
			charSet: "utf-8",
			viewport: {
				width: "device-width",
				initialScale: 1,
			},
			description,
			openGraph: {
				title,
				description,
				type: "website",
				images: [ogImage],
			},
			twitter: {
				card: "summary_large_image",
				title,
				description,
				creator: "@tannerlinsley",
				site: "@tannerlinsley",
				images: [ogImage],
			},
			icons: {
				icon: [
					{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
					{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
					{ url: "/favicon.ico" },
				],
				apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
			},
			manifest: "/site.webmanifest",
		});

		return {
			meta,
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

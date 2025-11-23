import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { meta } from "tanstack-meta";

import Header from "../components/Header";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...meta({
				charSet: "utf-8",
				title: "TanStack Start Starter",
				openGraph: {
					title: "Next.js",
					description: "The React Framework for the Web",
					url: "https://nextjs.org",
					siteName: "Next.js",
					images: [
						{
							url: "https://nextjs.org/og.png", // Must be an absolute URL
							width: 800,
							height: 600,
						},
						{
							url: "https://nextjs.org/og-alt.png", // Must be an absolute URL
							width: 1800,
							height: 1600,
							alt: "My custom alt",
						},
					],
					videos: [
						{
							url: "https://nextjs.org/video.mp4", // Must be an absolute URL
							width: 800,
							height: 600,
						},
					],
					audio: [
						{
							url: "https://nextjs.org/audio.mp3", // Must be an absolute URL
						},
					],
					locale: "en_US",
					type: "website",
				},
			}),
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

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

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
			itunes: {
				appId: "myAppStoreID",
				appArgument: "myAppArgument",
			},
			appleWebApp: {
				title: "Apple Web App",
				statusBarStyle: "black-translucent",
				startupImage: [
					"/assets/startup/apple-touch-startup-image-768x1004.png",
					{
						url: "/assets/startup/apple-touch-startup-image-1536x2008.png",
						media: "(device-width: 768px) and (device-height: 1024px)",
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

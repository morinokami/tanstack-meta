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
			pinterest: {
				richPin: true,
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

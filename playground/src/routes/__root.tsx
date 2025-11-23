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
				appLinks: {
					ios: {
						url: "https://nextjs.org/ios",
						app_store_id: "app_store_id",
					},
					android: {
						package: "com.example.android/package",
						app_name: "app_name_android",
					},
					web: {
						url: "https://nextjs.org/web",
						should_fallback: true,
					},
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

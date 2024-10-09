import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";

export const links: LinksFunction = () => [];

export const meta: MetaFunction = () => [
  { charset: "utf-8" },
  { title: "Pet Food Calorie Calculator" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
];

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-900 text-white h-full">
        <main className="flex-grow">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        {/* LiveReload component removed */}
      </body>
    </html>
  );
}
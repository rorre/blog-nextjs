import "tailwindcss/tailwind.css";
import "nprogress/nprogress.css";
import Nav from "../components/Nav";

import { AppProps } from "next/app";
import Router from "next/router";

import NProgress from "nprogress";
import { useEffect } from "react";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      <div className="container max-w-2xl mx-auto px-6 md:px-0 pb-4">
        <Nav />
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;

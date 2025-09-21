import "tailwindcss/tailwind.css";
import "nprogress/nprogress.css";

import { AppProps } from "next/app";
import Router from "next/router";

import NProgress from "nprogress";
import { useEffect } from "react";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { DefaultSeo } from "next-seo";
import Navbar from "../components/base/Navbar";
import {
  fas,
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

const { config, library } = require("@fortawesome/fontawesome-svg-core");
config.autoAddCss = false;
library.add(fas, faInfoCircle, faExclamationTriangle);

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Router.events.on("routeChangeStart", () => NProgress.start());
    Router.events.on("routeChangeComplete", () => NProgress.done());
    Router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return (
    <>
      <DefaultSeo
        defaultTitle="Ren's Space"
        titleTemplate="%s | Ren's Space"
        description="Tech meow rambling about random stuffs."
        openGraph={{
          type: "website",
          url: "https://rorre.me/",
          title: "Ren's Space",
          description: "Tech meow rambling about random stuffs.",
        }}
        twitter={{
          cardType: "summary",
          site: "https://rorre.me/",
        }}
      />

      <div className="bg-gray-900 text-white min-h-screen">
        <div className="container max-w-2xl mx-auto px-6 md:px-0 py-8 flex flex-col gap-4">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}

export default MyApp;

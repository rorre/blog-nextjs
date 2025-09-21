import React from "react";
import { Post } from "../utils/types/Post";
import { NextSeo } from "next-seo";
import Link from "next/link";

function About({ posts }: { posts: Post[] }) {
  return (
    <div className="space-y-4 text-lg">
      <NextSeo
        title="About"
        description="Tech meow rambling about random stuffs."
        openGraph={{
          type: "website",
          url: "https://rorre.me/about",
          title: "About | Ren's Space",
          description: "Tech meow rambling about random stuffs.",
        }}
        twitter={{
          cardType: "summary",
          site: "https://rorre.me/about",
        }}
      />

      <div className="flex flex-col gap-2">
        <h1 className="py-4 text-3xl font-bold">Hello!</h1>
        <p>
          <strong>The name&apos;s Ren.</strong> I go by a lot of alias, one of
          them being <strong>rorre</strong>. I&apos;m a Computer Science fresh
          graduate from Universitas Indonesia, based around Jakarta, working as
          a cybersecurity consultant. Though I do software engineering a lot of
          times, too!
        </p>

        <p>
          Outside of work, I love rhythm games! If you&apos;re around Jakarta,
          maybe you have seen me around the arcades, primarily playing CHUNITHM
          or maimai~
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="py-2 text-2xl font-bold">Work</h1>
        <ul className="list-disc list-inside">
          <li>
            I work as a cybersecurity consultant, primarily as a red teamer!
          </li>
          <li>
            I do software engineering as well on the sides, doing web
            development mostly.
          </li>
          <li>
            I own several cybersecurity certifications:
            <ul className="list-disc list-inside pl-4">
              <li>Certified Red Team Professional (CRTP)</li>
              <li>Certified Red Team Analyst (CRTA)</li>
              <li>Certified AppSec Pentester (CAPen)</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="py-2 text-2xl font-bold">Listen</h1>
        <p>
          I am obsessed with{" "}
          <Link className="underline" href="https://www.youtube.com/@a_hi_cha">
            ああああ&apos;s (AAAA) and their group (ああ…翡翠茶漬け…)
          </Link>{" "}
          songs!
        </p>
        <iframe
          className="rounded-xl"
          src="https://open.spotify.com/embed/track/6oF2pYwYHhJKw4ZtAi3LPA?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
        <iframe
          className="rounded-xl w-full"
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/JBhexo46Bw0?si=EzmHda87JfznlBbm"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        <p className="mt-2">
          ...and{" "}
          <Link
            href="https://www.youtube.com/@YonKaGor/videos"
            className="underline"
          >
            YonKaGor
          </Link>
          &apos;s!{" "}
          <span className="text-[rgba(0,0,0,0)] text-xs">
            Indonesia mentioned RAAAAAAAAAGGGGGGHHHHHH
            🇮🇩🇮🇩🇮🇩🇮🇩🇮🇩🇮🇩🦅🦅🦅🦅🦅🦅🦅🦅
          </span>
        </p>
        <iframe
          className="rounded-xl w-full"
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/lgzCxqQUU5g?si=uBtYeHiGqyZUWnhX"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <iframe
          className="rounded-xl w-full"
          width="560"
          height="315"
          src="https://www.youtube-nocookie.com/embed/IZyz9Nsaio0?si=LDKEz-SHP5OWjXoQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>

        <p className="mt-2">Please take a listen to them~</p>
      </div>
    </div>
  );
}

export default About;

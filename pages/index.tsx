import Head from "next/head";
import { getPosts } from "../utils/postHelper";
import React from "react";
import { Post } from "../utils/types/Post";
import Index from "../components/Index";
import { NextSeo } from "next-seo";
import Paginator from "../components/Paginator";

function Blog({ posts, totalPages }: { posts: Post[]; totalPages: number }) {
  return (
    <div>
      <NextSeo
        title="Blog | Index"
        description="Tech meow rambling about random stuffs."
        openGraph={{
          type: "website",
          url: "https://blog.rorre.me/",
          title: "Blog | Index",
          description: "Tech meow rambling about random stuffs.",
        }}
        twitter={{
          cardType: "summary",
          site: "https://blog.rorre.me/",
        }}
      />
      <Index posts={posts} />
      <Paginator currentPage={1} hasNext={1 < totalPages} />
    </div>
  );
}

export async function getStaticProps() {
  const posts = getPosts().slice(0, 10);
  posts.forEach((post) => (post.content = null));

  return {
    props: {
      posts,
      totalPages: Math.floor(posts.length / 10),
    },
    revalidate: 60,
  };
}

export default Blog;

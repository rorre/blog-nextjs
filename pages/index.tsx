import { getPosts } from "../utils/postHelper";
import React from "react";
import { Post } from "../utils/types/Post";
import Index from "../components/Index";
import { NextSeo } from "next-seo";

function Blog({ posts }: { posts: Post[] }) {
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
    </div>
  );
}

export async function getStaticProps() {
  const posts = getPosts();
  posts.forEach((post) => (post.content = null));

  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
}

export default Blog;

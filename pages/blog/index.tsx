import { getPosts } from "../../utils/postHelper";
import React from "react";
import { Post } from "../../utils/types/Post";
import Index from "../../components/blog/Index";
import { NextSeo } from "next-seo";

function Blog({ posts }: { posts: Post[] }) {
  return (
    <div>
      <NextSeo
        title="Blog"
        description="Tech meow rambling about random stuffs."
        openGraph={{
          type: "website",
          url: "https://rorre.me/blog",
          title: "Blog | Ren's Space",
          description: "Tech meow rambling about random stuffs.",
        }}
        twitter={{
          cardType: "summary",
          site: "https://rorre.me/blog",
        }}
      />

      <h1 className="py-4 text-3xl font-bold">All Posts</h1>
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

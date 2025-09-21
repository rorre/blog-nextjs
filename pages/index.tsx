import { getPosts } from "../utils/postHelper";
import React from "react";
import { Post } from "../utils/types/Post";
import { NextSeo } from "next-seo";
import Greeting from "../components/home/Greeting";
import RecentPosts from "../components/home/RecentPosts";

function IndexPage({ posts }: { posts: Post[] }) {
  return (
    <div>
      <Greeting />
      <RecentPosts posts={posts} />
    </div>
  );
}

export async function getStaticProps() {
  const posts = getPosts().slice(0, 5);
  posts.forEach((post) => (post.content = null));

  return {
    props: {
      posts,
    },
    revalidate: 60,
  };
}

export default IndexPage;

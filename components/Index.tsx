import { Post } from "../utils/types/Post";

import Card from "../components/Card";
import React from "react";

function Index({ posts }: { posts: Post[] }) {
  return (
    <>
      <h2 className="text-4xl font-bold pb-2 pt-4">Ren&apos;s blog</h2>
      <p>Tech meow rambling about random stuffs.</p>
      <hr className="pb-2" />

      <div className="flex flex-col gap-2">
        {posts.map((post, idx) => (
          <Card
            key={"post-" + idx}
            id={post.Slug}
            title={post.Title}
            preview={post.Preview}
            datetime={post.Date}
          />
        ))}
      </div>
    </>
  );
}

export default Index;

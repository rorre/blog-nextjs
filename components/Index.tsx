import { Post } from "../utils/types/Post";

import Card from "../components/Card";
import React from "react";

function Index({ posts }: { posts: Post[] }) {
  return (
    <>
      <h2 className="text-4xl font-bold pb-2 pt-4">Ren&apos;s blog</h2>
      <p>Tech meow rambling about random stuffs.</p>
      <hr className="pb-2" />

      {posts.map((post, idx) => {
        return (
          <React.Fragment key={"post-" + idx}>
            <Card
              id={post.Slug}
              title={post.Title}
              preview={post.previewParagraph}
              datetime={post.Date}
            />
            <hr className="border-dashed" />
          </React.Fragment>
        );
      })}
    </>
  );
}

export default Index;

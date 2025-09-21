import { Post } from "../../utils/types/Post";

import Card from "./Card";
import React from "react";

function Index({ posts }: { posts: Post[] }) {
  return (
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
  );
}

export default Index;

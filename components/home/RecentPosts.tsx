import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import Index from "../blog/Index";
import { Post } from "../../utils/types/Post";

function RecentPosts({ posts }: { posts: Post[] }) {
  return (
    <>
      <h1 className="py-4 text-3xl font-bold">Recent Posts</h1>
      <Index posts={posts} />
      <Link href="/blog">
        <button className="mt-2 py-3 pl-4 w-full flex flex-row justify-between border border-gray-500 rounded-xl opacity-80 hover:opacity-100 cursor-pointer transition duration-300 ease-in-out">
          <p>More posts</p>

          <div className="flex items-center justify-center basis-1/5">
            <FontAwesomeIcon icon={faChevronRight} size="1x" />
          </div>
        </button>
      </Link>
    </>
  );
}

export default RecentPosts;

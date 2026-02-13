import { GetStaticProps, GetStaticPaths } from "next";
import { getPostData, getPostIds } from "../../../utils/postHelper";
import styles from "../../../components/post/post.module.css";
import Markdown from "markdown-to-jsx";
import { NextSeo } from "next-seo";
import { Post as PostType } from "../../../utils/types/Post";
import { mdOverrides } from "../../../components/post/Overrides";
import { formatDate } from "../../../utils/date";
import Giscus from '@giscus/react';

export default function Post({ postData }: { postData: PostType }) {
  return (
    <div>
      <NextSeo
        title={postData.Title}
        description={postData.Preview}
        openGraph={{
          type: "website",
          url: `https://rorre.me/blog/post/${postData.Slug}`,
          title: `${postData.Title} | Ren's Space`,
          description: postData.Preview,
        }}
        twitter={{
          cardType: "summary",
          site: `https://rorre.me/blog/post/${postData.Slug}`,
        }}
      />

      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">{postData.Title}</h2>
        <p>{formatDate(new Date(postData.Date))}</p>
      </div>

      <hr className="my-4" />

      <Markdown
        // className="prose prose-invert max-w-none"
        className={styles.postContent}
        options={{
          overrides: mdOverrides,
        }}
      >
        {postData.content}
      </Markdown>

      <hr className="my-4" />

      <Giscus
        repo="rorre/blog-nextjs"
        repoId="MDEwOlJlcG9zaXRvcnkzODE5MjQwMjM="
        category="Announcements"
        categoryId="DIC_kwDOFsOyt84C2VAw"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async function ({ params }) {
  const postData = getPostData(params.id + ".md");
  return {
    props: { postData },
    revalidate: 300,
  };
};

export const getStaticPaths: GetStaticPaths = async function () {
  const paths = getPostIds();
  return {
    paths,
    fallback: false,
  };
};

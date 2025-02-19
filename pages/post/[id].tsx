import { GetStaticProps, GetStaticPaths } from "next";
import { getPostData, getPostIds } from "../../utils/postHelper";
import styles from "../../components/post/post.module.css";
import Markdown from "markdown-to-jsx";
import { NextSeo } from "next-seo";
import { Post as PostType } from "../../utils/types/Post";
import { mdOverrides } from "../../components/post/Overrides";

export default function Post({ postData }: { postData: PostType }) {
  return (
    <div>
      <NextSeo
        title={`Blog | ${postData.Title}`}
        description={postData.Preview}
        openGraph={{
          type: "website",
          url: `https://blog.rorre.me/post/${postData.Slug}`,
          title: `Blog | ${postData.Title} `,
          description: postData.Preview,
        }}
        twitter={{
          cardType: "summary",
          site: `https://blog.rorre.me/post/${postData.Slug}`,
        }}
      />
      <h2 className="text-4xl font-bold pb-2">{postData.Title}</h2>
      <p>Posted on {postData.Date}</p>
      <hr className="pb-2" />

      <Markdown
        // className="prose prose-invert max-w-none"
        className={styles.postContent}
        options={{
          overrides: mdOverrides,
        }}
      >
        {postData.content}
      </Markdown>
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

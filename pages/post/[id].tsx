import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { getPostData, getPostIds } from '../../utils/postHelper'
import styles from '../../components/post/post.module.css'
import Markdown from 'markdown-to-jsx'
import { NextSeo } from 'next-seo'
import { Post as PostType } from '../../utils/types/Post'
import { mdOverrides } from '../../components/post/Overrides'

export default function Post({ postData }: { postData: PostType }) {
    return (
        <div>
            <NextSeo
                title={`Blog | ${postData.Title}`}
                description={postData.previewParagraph}
                openGraph={{
                    type: 'website',
                    url: `https://rorre.xyz/post/${postData.Slug}`,
                    title: `Blog | ${postData.Title} `,
                    description: postData.previewParagraph,
                }}
                twitter={{
                    cardType: 'summary',
                    site: `https://rorre.xyz/post/${postData.Slug}`,
                }}
            />

            <Head>
                <title>Blog | {postData.Title}</title>
            </Head>
            <h2 className="text-4xl font-bold">{postData.Title}</h2>
            <p>Posted on {postData.Date}</p>
            <hr className="pb-2" />

            <Markdown
                className={styles.postContent}
                // eslint-disable-next-line react/no-children-prop
                children={postData.content}
                options={{
                    overrides: mdOverrides,
                }}
            />
        </div>
    )
}

export const getStaticProps: GetStaticProps = async function ({ params }) {
    const postData = getPostData(params.id + '.md')
    return {
        props: { postData },
        revalidate: 300,
    }
}

export const getStaticPaths: GetStaticPaths = async function () {
    const paths = getPostIds()
    return {
        paths,
        fallback: false,
    }
}

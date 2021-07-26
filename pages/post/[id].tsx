import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head'
import { getPostData, getPostIds } from '../../utils/postHelper'
import styles from '../../components/post/post.module.css'
import Markdown from 'markdown-to-jsx';
import Notice from '../../components/post/Notice'
export default function Post({ postData }) {
    const mdOverrides = {
        Notice: {
            component: Notice
        },
    }

    return (
        <div>
            <Head>
                <title>Blog | {postData.Title} </title>
            </Head>
            <h2 className="text-4xl font-bold">{postData.Title}</h2>
            <p>Posted on {postData.Date}</p>
            <hr className="pb-2" />

            <Markdown
                className={styles.postContent}
                // eslint-disable-next-line react/no-children-prop
                children={postData.content}
                options={{
                    overrides: mdOverrides
                }}
            />
        </div>
    )
}

export const getStaticProps: GetStaticProps = async function ({ params }) {
    const postData = getPostData(params.id + ".md")
    return {
        props: { postData }
    }
}

export const getStaticPaths: GetStaticPaths = async function () {
    const paths = getPostIds()
    return {
        paths,
        fallback: false
    }
}
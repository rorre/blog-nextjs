import { GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import { getPosts } from '../utils/postHelper'
import { Post } from '../utils/types/Post'
import { NextSeo } from 'next-seo'
import _ from 'lodash'
import Index from '../components/Index'

function BlogPagedIndex({ posts }: { posts: Post[] }) {
    return (
        <div>
            <NextSeo
                title="Blog | Index"
                description="Everything related to osu!, code, or just Ren's life in general."
                openGraph={{
                    type: 'website',
                    url: 'https://blog.rorre.xyz/',
                    title: 'Blog | Index',
                    description: "Everything related to osu!, code, or just Ren's life in general.",
                }}
                twitter={{
                    cardType: 'summary',
                    site: 'https://blog.rorre.xyz/',
                }}
            />

            <Head>
                <title>Blog | Index</title>
            </Head>
            <Index posts={posts} />
        </div>
    )
}

export const getStaticProps: GetStaticProps = async function ({ params }) {
    const posts = getPosts()
    const selectedPage = Number(params.page)

    const currentPosts = posts.slice((selectedPage - 1) * 10, selectedPage * 10)
    return {
        props: { posts: currentPosts },
    }
}

export const getStaticPaths: GetStaticPaths = async function () {
    const posts = getPosts()
    const numberRange = _.range(1, Math.floor(posts.length / 10))

    const paths = numberRange.map((v) => {
        return { params: { page: v.toString() } }
    })
    return {
        paths,
        fallback: false,
    }
}

export default BlogPagedIndex

import { GetStaticProps, GetStaticPaths } from 'next'
import { getPosts } from '../utils/postHelper'
import { Post } from '../utils/types/Post'
import { NextSeo } from 'next-seo'
import _ from 'lodash'
import Index from '../components/Index'
import Paginator from '../components/Paginator'

function BlogPagedIndex({
    currentPage,
    posts,
    totalPages,
}: {
    currentPage: number
    posts: Post[]
    totalPages: Number
}) {
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
            <Index posts={posts} />
            <Paginator currentPage={currentPage} hasNext={1 < totalPages} />
        </div>
    )
}

export const getStaticProps: GetStaticProps = async function ({ params }) {
    const posts = getPosts()
    const selectedPage = Number(params.page)

    const currentPosts = posts.slice((selectedPage - 1) * 10, selectedPage * 10)
    return {
        props: {
            currentPage: selectedPage,
            posts: currentPosts,
            totalPages: Math.ceil(posts.length / 10),
        },
        revalidate: 60,
    }
}

export const getStaticPaths: GetStaticPaths = async function () {
    const posts = getPosts()
    const numberRange = _.range(1, Math.ceil(posts.length / 10) + 1)

    const paths = numberRange.map((v) => {
        return { params: { page: v.toString() } }
    })
    return {
        paths,
        fallback: false,
    }
}

export default BlogPagedIndex

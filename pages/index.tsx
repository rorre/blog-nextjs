import Head from 'next/head'
import { getPosts } from '../utils/postHelper'
import React from 'react'
import { Post } from '../utils/types/Post'
import Index from '../components/Index'
import { NextSeo } from 'next-seo'
import Paginator from '../components/Paginator'

function Blog({ posts, totalPages }: { posts: Post[]; totalPages: Number }) {
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
            <Paginator currentPage={1} hasNext={1 < totalPages} />
        </div>
    )
}

export async function getStaticProps() {
    const posts = getPosts().slice(0, 10)
    posts.forEach((post) => (post.content = null))

    return {
        props: {
            posts,
            totalPages: Math.floor(posts.length / 10),
        },
        revalidate: 60,
    }
}

export default Blog

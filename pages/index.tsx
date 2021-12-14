import Head from 'next/head'
import { getPosts } from '../utils/postHelper'
import React from 'react'
import { Post } from '../utils/types/Post'
import Index from '../components/Index'
import { NextSeo } from 'next-seo'

function Blog({ posts }: { posts: Post[] }) {
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

export async function getStaticProps() {
    const posts = getPosts().slice(0, 10)

    return {
        props: {
            posts,
        },
    }
}

export default Blog

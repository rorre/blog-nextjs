import Head from 'next/head'
import Card from '../components/Card'
import { getPosts } from '../utils/postHelper'
import _ from 'lodash'
import React from 'react'
import { Post } from '../utils/types/Post'

interface PostRowProps {
    rowKey: number;
    posts: Post[];
}

function PostRow({ rowKey, posts }: PostRowProps) {
    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 py-2">
            {posts.map((post, idx) => {
                return (
                    <div key={`${rowKey}-${idx}`} className="flex-1">
                        <Card
                            id={post.Slug}
                            title={post.Title}
                            preview={post.previewParagraph}
                            datetime={post.Date}
                        />
                    </div>
                )
            })
            }
        </div>
    )
}

function Blog({ posts }: { posts: Post[] }) {
    const chunkedPosts = _.chunk(posts, 2)
    return (
        <div>
            <Head>
                <title>Blog | Index</title>
            </Head>
            <h2 className="text-4xl font-bold">Ren&apos;s blog</h2>
            <p>Everything related to osu!, code, or just life in general.</p>
            <hr className="pb-2" />

            {chunkedPosts.map((postArray, idx) => {
                return <PostRow key={`postrow-${idx}`} rowKey={idx} posts={postArray} />
            })
            }
        </div>
    )
}

export async function getStaticProps() {
    const posts = getPosts()

    return {
        props: {
            posts,
        },
    }
}

export default Blog
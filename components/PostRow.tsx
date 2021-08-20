import Card from '../components/Card'
import { Post } from '../utils/types/Post'
import React from 'react'

interface PostRowProps extends React.HTMLProps<HTMLElement> {
    rowKey: number
    posts: Post[]
}

export default function PostRow({ rowKey, posts }: PostRowProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:space-x-4 py-2">
            {posts.map((post, idx) => {
                return <Card id={post.Slug} title={post.Title} preview={post.previewParagraph} datetime={post.Date} />
            })}
        </div>
    )
}

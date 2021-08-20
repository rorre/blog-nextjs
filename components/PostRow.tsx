import Card from '../components/Card'
import { Post } from '../utils/types/Post'
import React from 'react'

interface PostRowProps extends React.HTMLProps<HTMLElement> {
    rowKey: number
    posts: Post[]
}

export default function PostRow({ rowKey, posts }: PostRowProps) {
    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 py-2">
            {posts.map((post, idx) => {
                return (
                    <div key={`${rowKey}-${idx}`} className="flex-1">
                        <Card id={post.Slug} title={post.Title} preview={post.previewParagraph} datetime={post.Date} />
                    </div>
                )
            })}
        </div>
    )
}

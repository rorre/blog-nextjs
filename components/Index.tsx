import { Post } from '../utils/types/Post'

import Card from '../components/Card'

function Index({ posts }: { posts: Post[] }) {
    return (
        <>
            <h2 className="text-4xl font-bold">Ren&apos;s blog</h2>
            <p>Everything related to osu!, code, or just life in general.</p>
            <hr className="pb-2" />

            {posts.map((post, idx) => {
                return (
                    <>
                        <Card
                            id={post.Slug}
                            title={post.Title}
                            key={'post-' + idx}
                            preview={post.previewParagraph}
                            datetime={post.Date}
                        />
                        <hr key={'postBar-' + idx} className="border-dashed" />
                    </>
                )
            })}
        </>
    )
}

export default Index

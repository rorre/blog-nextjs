import Image from 'next/image'
import Link from 'next/link'

interface CardProps {
    id: string
    title: string
    preview: string
    datetime: Date
    cover?: string
}

export default function Card({ id, title, preview, datetime, cover }: CardProps) {
    return (
        <div className="flex flex-col rounded-lg shadow-md py-2">
            {cover && (
                <Image className="mx-auto md:h-auto" src={cover} width={400} height={200} alt="Post cover image" />
            )}

            <div className="py-2 text-left">
                <Link href={`/post/${id}`}>
                    <a className="text-lg font-semibold text-blue-400 hover:text-blue-500">{title}</a>
                </Link>
                <div className="pt-2">{preview}</div>
            </div>
            <div className="text-gray-400 mt-auto">Posted on {datetime}</div>
        </div>
    )
}

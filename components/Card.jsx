import Image from 'next/image'
import Link from 'next/link';

export default function Card({ id, title, preview, datetime, cover }) {
    return (
        <div className="flex items-center p-4 rounded-lg shadow-md py-2 bg-white border border-blue-500">
            {cover && <Image
                className="mx-auto md:h-auto"
                src={cover} width={400} height={200} alt="Post cover image"
            />}

            <div className="py-2 text-left">
                <Link href={`/post/${id}`}>
                    <a className="text-lg font-semibold text-blue-500 hover:text-blue-700">
                        {title}
                    </a>
                </Link>
                <div className="pt-2">{preview}</div>
                <div className="text-gray-500">Posted on {datetime}</div>
            </div>
        </div>
    )
}
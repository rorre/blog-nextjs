import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faLock } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Nav() {
    const router = useRouter()
    const currentPath = router.pathname
    const useDark = router.pathname.startsWith('/personal')

    return (
        <div
            className="flex flex-row px-4 pt-4 content-between items-center
                        dark:bg-gray-800"
        >
            {currentPath !== '/' ? (
                <div>
                    <FontAwesomeIcon icon={faChevronLeft} color={useDark ? 'white' : 'black'} />
                    <Link href="/">
                        <a className="pl-2 text-blue-500 hover:text-blue-700">Back to Index</a>
                    </Link>
                </div>
            ) : (
                <div></div>
            )}

            <Link href="/personal">
                <div className="ml-auto">
                    <FontAwesomeIcon icon={faLock} color={useDark ? 'white' : 'black'} />
                </div>
            </Link>
        </div>
    )
}

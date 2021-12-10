import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function BackButton() {
    const router = useRouter()
    const currentPath = router.pathname

    return currentPath !== '/' ? (
        <div className="flex flex-row pl-4 pt-4 space-x-2 items-center">
            <FontAwesomeIcon icon={faChevronLeft} color="white" />
            <Link href="/">
                <a className="text-blue-400 hover:text-blue-500">Back to Index</a>
            </Link>
        </div>
    ) : (
        <div></div>
    )
}

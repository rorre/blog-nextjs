import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faLock } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Nav() {
    const router = useRouter()
    const currentPath = router.pathname

    return (
        <div className="flex flex-row px-4 pt-4 content-between items-center">
            {currentPath !== "/" ? (
                <div>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <Link href="/">
                        <a className="pl-2 text-blue-500 hover:text-blue-700">Back to Index</a>
                    </Link>
                </div>
            ) : <div></div>}

            <Link href="/personal">
                <div className="ml-auto">
                    <FontAwesomeIcon icon={faLock} />
                </div>
            </Link>
        </div>
    )
}
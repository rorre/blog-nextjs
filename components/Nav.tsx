import { useRouter } from 'next/router'
import BackButton from './BackButton'

export default function Nav() {
    const router = useRouter()
    const currentPath = router.pathname

    return currentPath !== '/' ? <BackButton /> : <div></div>
}

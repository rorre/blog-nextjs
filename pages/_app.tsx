import 'tailwindcss/tailwind.css'
import 'nprogress/nprogress.css'
import Nav from '../components/Nav'

import { AppProps } from 'next/app'
import Router, { useRouter } from 'next/router'

import NProgress from 'nprogress'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    useEffect(() => {
        Router.events.on('routeChangeStart', () => NProgress.start())
        Router.events.on('routeChangeComplete', () => NProgress.done())
        Router.events.on('routeChangeError', () => NProgress.done())
    }, [])

    return (
        <div className="bg-gray-900 text-white">
            <Nav />
            <div className="container mx-auto py-8 px-8 sm:px-16 md:px-32 lg:px-64">
                <Component {...pageProps} />
            </div>
        </div>
    )
}

export default MyApp

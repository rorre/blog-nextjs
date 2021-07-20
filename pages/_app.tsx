import 'tailwindcss/tailwind.css'
import 'nprogress/nprogress.css'
import BackButton from '../components/BackButton'

import { AppProps } from 'next/app'
import Router from 'next/router'

import NProgress from 'nprogress'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Router.events.on('routeChangeStart', () => NProgress.start());
    Router.events.on('routeChangeComplete', () => NProgress.done());
    Router.events.on('routeChangeError', () => NProgress.done());
  }, [])

  return (
    <div>
      <BackButton />
      <div className="container py-8 px-8 sm:px-16 md:px-32 ">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

export default MyApp

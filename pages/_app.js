import 'tailwindcss/tailwind.css'
import BackButton from '../components/BackButton'
function MyApp({ Component, pageProps }) {
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

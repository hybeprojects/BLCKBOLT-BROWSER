import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BLCKBOLT BROWSER</title>
      </Head>
      <div className="bg-bgDark text-white min-h-screen">
        <Component {...pageProps} />
      </div>
    </>
  )
}

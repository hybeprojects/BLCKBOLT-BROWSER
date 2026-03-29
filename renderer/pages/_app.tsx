import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import ThemeProvider from '../components/ThemeProvider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>BLCKBOLT BROWSER</title>
      </Head>
      <ThemeProvider>
        <div className="min-h-screen">
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  )
}

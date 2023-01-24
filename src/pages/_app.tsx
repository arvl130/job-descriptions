import "@/styles/globals.css"
import Head from "next/head"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Find Job Descriptions</title>
        <meta
          name="description"
          content="Stop thinking about job descriptions and get them here."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <footer className="bg-gray-800 text-white text-center font-medium px-4 py-3">
        Angelo Geulin &copy; 2023
      </footer>
    </>
  )
}

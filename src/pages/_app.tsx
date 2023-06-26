import "@/styles/globals.css"
import Head from "next/head"
import type { AppProps } from "next/app"
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"

function Navbar() {
  const { status } = useSession()

  return (
    <nav className="h-16 border-b border-gray-300 flex items-center px-6">
      <div className="max-w-6xl mx-auto w-full flex justify-between">
        <h1 className="flex items-center text-lg text-gray-700 font-semibold">
          Job Descriptions
        </h1>
        <div>
          <button
            type="button"
            className={`transition duration-200 text-white font-medium w-20 py-2 rounded-md ${
              status === "loading" ? "bg-blue-200" : ""
            } ${
              status === "authenticated" || status === "unauthenticated"
                ? "bg-blue-500 hover:bg-blue-400"
                : ""
            }`}
            onClick={() => {
              if (status === "authenticated") signOut()
              if (status === "unauthenticated") signIn()
            }}
          >
            {status === "loading" && <br />}
            {status === "authenticated" && <>Logout</>}
            {status === "unauthenticated" && <>Login</>}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
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
      <SessionProvider session={session}>
        <Navbar />
        <Component {...pageProps} />
        <footer className="bg-gray-800 text-white text-center font-medium px-4 py-3">
          Angelo Geulin &copy; 2023
        </footer>
      </SessionProvider>
    </>
  )
}

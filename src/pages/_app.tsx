import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"

function Navbar() {
  const { status } = useSession()

  return (
    <nav className="h-20 border-b border-zinc-300 flex items-center px-6 bg-gradient-to-b from-white via-white/60 via-70%">
      <div className="max-w-6xl mx-auto w-full flex justify-between">
        <h1 className="flex items-center text-lg text-zinc-700 font-semibold">
          <Link href="/">Job Descriptions</Link>
        </h1>
        <div>
          <button
            type="button"
            className={`transition duration-200 font-medium w-20 py-2 rounded-md ${
              status === "loading" ? "bg-purple-300 text-white" : ""
            } ${
              status === "unauthenticated"
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : ""
            }
            ${
              status === "authenticated"
                ? "border border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white"
                : ""
            }
            `}
            onClick={() => {
              if (status === "authenticated")
                signOut({
                  callbackUrl: "/",
                })
              if (status === "unauthenticated")
                signIn("google", {
                  callbackUrl: "/search",
                })
            }}
          >
            {status === "loading" && <br />}
            {status === "authenticated" && <>Logout</>}
            {status === "unauthenticated" && <>Sign in</>}
          </button>
        </div>
      </div>
    </nav>
  )
}

const queryClient = new QueryClient()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
          <Navbar />
          <Component {...pageProps} />
          <footer className="bg-zinc-800 text-white text-center font-medium px-4 py-3">
            Angelo Geulin &copy; 2023
          </footer>
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
}

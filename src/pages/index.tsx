import Head from "next/head"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Home &#x2013; Find Job Descriptions</title>
        <meta
          name="description"
          content="Stop thinking about job descriptions and get them here."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-prose mx-auto text-zinc-700 py-12 px-6">
        <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-400 to-indigo-800 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></div>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-300 to-purple-800 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            ></div>
          </div>
        </div>
        <header className="pt-24 pb-6">
          <h1 className="text-5xl font-bold text-center">Job Descriptions</h1>
          <p className="text-center mt-4 text-zinc-500">
            Find all the job descriptions you need in just a few clicks.
          </p>
          <div className="flex justify-center gap-3 mt-12">
            <button
              type="button"
              className={`
            w-32 py-2 text-center text-white rounded-md transition duration-200 font-semibold
            ${status === "loading" ? "bg-purple-300" : ""}
            ${
              status === "unauthenticated" || status === "authenticated"
                ? "bg-purple-600 hover:bg-purple-500"
                : ""
            }
            `}
              onClick={() => {
                if (status === "authenticated") router.push("/search")
                if (status === "unauthenticated")
                  signIn("google", {
                    callbackUrl: "/search",
                  })
              }}
            >
              {status === "loading" ? <br /> : <>Get Started</>}
            </button>

            <Link
              href="/getting-started"
              className="w-32 py-2 text-center font-semibold"
            >
              Learn more →
            </Link>
          </div>
        </header>
      </main>
    </>
  )
}

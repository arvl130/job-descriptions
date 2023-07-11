import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"

export default function Home() {
  const { status } = useSession()
  const router = useRouter()

  return (
    <main className="max-w-prose mx-auto text-zinc-700 py-12 px-6">
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
            {status === "loading" && <br />}
            {status === "unauthenticated" && <>Get started</>}
            {status === "authenticated" && <>Search</>}
          </button>

          <a href="#" className="w-32 py-2 text-center font-semibold">
            Learn more →
          </a>
        </div>
      </header>
    </main>
  )
}

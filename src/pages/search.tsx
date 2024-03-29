import { LandingPageForm } from "@/components/landing-page-form"
import { SideNav } from "@/components/sidenav"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Search() {
  const { status, data: session } = useSession({
    required: true,
  })

  useEffect(() => {
    if (status === "loading") return
  }, [status])

  if (status === "loading")
    return <div className="text-center px-6 py-12">Loading ...</div>

  return (
    <>
      <Head>
        <title>Online Search &#x2013; Find Job Descriptions</title>
        <meta
          name="description"
          content="Stop thinking about job descriptions and get them here."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-6xl mx-auto w-full grid grid-cols-[16rem_1fr]">
        <SideNav />
        <main className="px-6 py-12 text-zinc-700 max-w-3xl mx-auto w-full">
          <h2 className="text-2xl font-semibold mb-4">Online Search</h2>
          <div className="max-w-xl mx-auto">
            <LandingPageForm userId={session.user?.id as string} />
          </div>
        </main>
      </div>
    </>
  )
}

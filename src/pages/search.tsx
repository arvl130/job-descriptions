import { LandingPageForm } from "@/components/landing-page-form"
import { SideNav } from "@/components/sidenav"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Search() {
  const router = useRouter()
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/")
    },
  })

  useEffect(() => {
    if (status === "loading") return
  }, [status])

  if (status === "loading")
    return <div className="text-center px-6 py-12">Loading ...</div>

  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-[16rem_1fr]">
      <SideNav />
      <main className="px-6 py-12">
        <div className="max-w-xl mx-auto">
          <LandingPageForm userId={session.user?.id as string} />
        </div>
      </main>
    </div>
  )
}

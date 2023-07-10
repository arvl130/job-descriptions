import { LandingPageForm } from "@/components/landing-page-form"
import { SideNav } from "@/components/sidenav"

export default function Search() {
  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-[16rem_1fr]">
      <SideNav />
      <main className="px-6 py-12">
        <div className="max-w-xl mx-auto">
          <LandingPageForm />
        </div>
      </main>
    </div>
  )
}

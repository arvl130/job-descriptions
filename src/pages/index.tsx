import { LandingPageForm } from "@/components/landing-page-form"

export default function Home() {
  return (
    <main className="max-w-lg mx-auto text-gray-700 py-12 px-6">
      <header className="pt-24 pb-6">
        <h1 className="text-4xl font-bold text-center">
          Job Description Search API
        </h1>
      </header>
      <LandingPageForm />
    </main>
  )
}

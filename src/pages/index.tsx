import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { SearchResult } from "./api/search/[term]"

const FormSchema = z.object({
  term: z.string(),
})

type FormType = z.infer<typeof FormSchema>

export default function Home() {
  const [result, setResult] = useState<Array<{
    category: string
    title: string
    short_title: string | null
    description: string
  }> | null>(null)
  const { handleSubmit, register, setValue } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
  })
  const [limit, setLimit] = useState(10)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  return (
    <main className="max-w-lg mx-auto text-gray-700 py-12 px-6 min-h-screen">
      <header className="pt-24 pb-6">
        <h1 className="text-4xl font-bold text-center">
          Job Description Search API
        </h1>
      </header>
      <form
        className="mb-3"
        onSubmit={handleSubmit(async (formData) => {
          try {
            setIsLoading(true)
            const generatedUrl = `/api/search/${formData.term}?limit=${limit}`
            const response = await fetch(generatedUrl)

            const data = await response.json()
            const { result } = data as SearchResult

            if (result?.jobs) {
              setResult(result.jobs)
              setUrl(generatedUrl)
            } else {
              setResult([])
              setUrl("")
            }
          } catch (e) {
          } finally {
            setIsLoading(false)
          }
        })}
      >
        <div className="grid grid-cols-[1fr_6rem]">
          <input
            type="text"
            placeholder=" Type a job title ..."
            className="w-full px-4 py-2 rounded-l-md border border-gray-300 transition duration-200 focus:outline-none focus:ring focus:ring-blue-300/40 focus:border-blue-500"
            {...register("term")}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 transition duration-200 text-white font-medium px-4 py-2 rounded-r-md focus:outline-none focus:ring focus:ring-blue-300/40"
          >
            Search
          </button>
        </div>
      </form>
      {isLoading ? (
        <div className="pt-2">
          <p className="text-center mb-3">Working on it ...</p>
        </div>
      ) : (
        <div>
          {result && result.length === 0 && (
            <section className="pt-2">
              <p className="text-center mb-3">No results found.</p>
            </section>
          )}
          {(result === null ||
            (Array.isArray(result) && result.length === 0)) && (
            <section className="pt-2">
              <p className="text-center">
                Try searching for:{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    setValue("term", "electrician")
                  }}
                  className="font-medium hover:underline underline-offset-4"
                >
                  electrician
                </button>
              </p>
            </section>
          )}
          {result && result.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-1">
                <p>Results:</p>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200  focus:outline-none focus:ring focus:ring-blue-300/40 focus:border focus:border-blue-500 focus:bg-gray-50"
                  >
                    open
                  </a>
                )}
              </div>
              <pre className="overflow-hidden text-ellipsis bg-gray-100 px-3 py-2 rounded-md border border-gray-200">
                {JSON.stringify(result, null, 2)}
              </pre>
            </section>
          )}
        </div>
      )}
    </main>
  )
}

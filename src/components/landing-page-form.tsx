import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "./hero-icons"
import { SearchResultItem } from "./search-result-item"

export const SEARCH_RESULT_PAGE_SIZE = 5

const FormSchema = z.object({
  term: z.string(),
})

type FormType = z.infer<typeof FormSchema>

const JobItemSchema = z.object({
  category: z.string(),
  title: z.string(),
  short_title: z.string().nullable(),
  description: z.string(),
})

export type JobItemType = z.infer<typeof JobItemSchema>

const ApiSearchResultSchema = z.object({
  jobs: JobItemSchema.array(),
  total: z.number(),
  limit: z.number(),
})

export function LandingPageForm() {
  const { handleSubmit, register, setValue } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      term: "",
    },
  })

  const [limit, setLimit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: jobDescriptions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchJobDescriptions", searchTerm, limit],
    queryFn: async () => {
      const generatedUrl = `/api/search/${searchTerm}?limit=${limit}`
      const response = await fetch(generatedUrl)

      const data = await response.json()
      const { result } = data
      const { jobs } = ApiSearchResultSchema.parse(result)

      return jobs
    },
    enabled: searchTerm !== "",
  })

  const [currentPage, setCurrentPage] = useState(0)

  function getVisibleJobDescriptions(jobDescriptions: JobItemType[]) {
    return jobDescriptions.slice(
      currentPage * SEARCH_RESULT_PAGE_SIZE,
      currentPage * SEARCH_RESULT_PAGE_SIZE + SEARCH_RESULT_PAGE_SIZE
    )
  }

  function getPageCount(jobDescriptions: JobItemType[]) {
    return Math.ceil(jobDescriptions.length / SEARCH_RESULT_PAGE_SIZE)
  }

  return (
    <>
      <form
        className="mb-3"
        onSubmit={handleSubmit((formData) => setSearchTerm(formData.term))}
      >
        <div className="grid grid-cols-[1fr_6rem]">
          <input
            type="text"
            placeholder="Type a job title ..."
            className="w-full px-4 py-2 rounded-l-md border border-gray-300 transition duration-100 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-500 focus:border-purple-600"
            {...register("term")}
          />
          <button
            type="submit"
            className="bg-zinc-600 hover:bg-zinc-500 transition duration-100 text-white font-medium px-4 py-2 rounded-r-md focus:outline-none focus:ring focus:ring-purple-300/40"
          >
            Search
          </button>
        </div>
      </form>

      {searchTerm === "" ? (
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
      ) : (
        <>
          {isLoading ? (
            <div className="pt-2">
              <p className="text-center mb-3">Working on it ...</p>
            </div>
          ) : (
            <>
              {isError ? (
                <div className="pt-2">
                  <p className="text-center mb-3">
                    An error occured while searching :{"("}
                  </p>
                </div>
              ) : (
                <>
                  {jobDescriptions.length === 0 ? (
                    <>
                      <section className="pt-2">
                        <p className="text-center mb-3">No results found.</p>
                      </section>
                      <section className="pt-2">
                        <p className="text-center">
                          Try searching for:{" "}
                          <button
                            type="button"
                            onClick={() => setValue("term", "electrician")}
                            className="font-medium hover:underline underline-offset-4"
                          >
                            electrician
                          </button>
                        </p>
                      </section>
                    </>
                  ) : (
                    <section className="border border-zinc-300 rounded-t-md">
                      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-300">
                        <p className="font-medium">Results:</p>
                        <div className="flex gap-2">
                          <a
                            href={`/api/search/${searchTerm}?limit=${limit}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-sm inline-block px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-100  focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-500 focus:border focus:border-purple-600 focus:bg-gray-50"
                          >
                            json
                          </a>
                          <button
                            type="button"
                            className="inline-block disabled:bg-zinc-200 disabled:text-zinc-500 disabled:cursor-not-allowed font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition duration-100"
                            disabled={currentPage === 0}
                            onClick={() =>
                              setCurrentPage(
                                (currCurrentPage) => currCurrentPage - 1
                              )
                            }
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            className="inline-block disabled:bg-zinc-200 disabled:text-zinc-500 disabled:cursor-not-allowed font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition duration-100"
                            disabled={
                              currentPage === getPageCount(jobDescriptions) - 1
                            }
                            onClick={() =>
                              setCurrentPage(
                                (currCurrentPage) => currCurrentPage + 1
                              )
                            }
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      {getVisibleJobDescriptions(jobDescriptions).map(
                        (jobDescription, index) => (
                          <SearchResultItem
                            key={`${jobDescription.category}-${jobDescription.title}-${jobDescription.short_title}`}
                            jobDescription={jobDescription}
                            index={index}
                          />
                        )
                      )}
                    </section>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

import { GenerateKeyForm } from "@/components/generate-key-form"
import { GeneratedKeySection } from "@/components/generated-key-section"
import { useRef, useState } from "react"
import { z } from "zod"
import { useQuery, useMutation } from "@tanstack/react-query"
import { TrashIcon } from "@/components/hero-icons"

const ApiResultSchema = z
  .object({
    keyId: z.string().length(20),
    createdAt: z.string().min(1),
    displayName: z.string().max(50),
  })
  .array()

export default function Dashboard() {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [generatedKey, setGeneratedKey] = useState({
    id: "",
    secret: "",
    displayName: "",
  })

  async function fetchApiKeys() {
    const response = await fetch("/api/key")

    if (!response.ok) {
      console.log("Fetch error")
      throw new Error("Fetch error")
    }

    const { results } = await response.json()
    const validApiKeys = ApiResultSchema.parse(results)
    validApiKeys.sort((first, second) => {
      const firstDate = new Date(first.createdAt).getTime()
      const secondDate = new Date(second.createdAt).getTime()

      if (firstDate === secondDate) return 0
      if (firstDate < secondDate) return 1

      return -1
    })

    return validApiKeys
  }

  const {
    data: apiKeys,
    isLoading,
    isError,
    refetch: refetchApiKeys,
  } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: fetchApiKeys,
  })

  const { mutate: deleteApiKey } = useMutation({
    mutationFn: (keyId: string) => {
      return fetch(`/api/key/${keyId}`, {
        method: "DELETE",
      })
    },
    onSuccess: () => refetchApiKeys(),
  })

  return (
    <main className="max-w-xl w-full mx-auto text-zinc-700 py-12 px-6">
      <header>
        <input
          type="text"
          placeholder="Search keys ..."
          className="bg-zinc-50 placeholder-zinc-400 w-full px-4 py-2 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-500 border border-zinc-300 rounded-t-md focus:border focus:border-purple-600 transition duration-100"
        />
      </header>
      {isLoading ? (
        <section className="min-h-[20rem] border-x border-b border-zinc-300 flex flex-col justify-center items-center">
          Loading ...
        </section>
      ) : (
        <>
          {isError ? (
            <section className="min-h-[20rem] border-x border-b border-zinc-300 flex flex-col justify-center items-center">
              An error occured while loading your API keys. :{"("}
            </section>
          ) : (
            <>
              {apiKeys.length === 0 ? (
                <section className="min-h-[20rem] border-x border-b border-zinc-300 flex flex-col justify-center items-center">
                  <p className="mb-4 text-zinc-400">No keys found.</p>
                  <button
                    type="button"
                    className="w-44 py-2 bg-zinc-700 hover:bg-zinc-600 transition duration-200 text-white font-medium rounded-md"
                    onClick={() => {
                      if (!dialogRef.current) return

                      dialogRef.current.showModal()
                    }}
                  >
                    Generate new key
                  </button>
                </section>
              ) : (
                <section className="min-h-[20rem] border-x border-b border-zinc-300">
                  {apiKeys.map((apiKey) => (
                    <article
                      key={apiKey.keyId}
                      className="px-4 py-2 border-b border-zinc-300 flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{apiKey.displayName}</p>
                        <p className="text-zinc-500 text-xs">
                          Access Key ID: {apiKey.keyId}
                        </p>
                        <p className="text-zinc-500 text-xs">
                          Created date:{" "}
                          {new Date(apiKey.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="hover:bg-zinc-100 px-2 py-2 rounded-md transition duration-200"
                          onClick={() => deleteApiKey(apiKey.keyId)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </article>
                  ))}
                  {apiKeys.length < 5 && (
                    <article className="flex justify-center px-4 py-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm hover:bg-zinc-700 hover:text-white border border-zinc-700 transition duration-200 font-semibold rounded-md"
                        onClick={() => {
                          if (!dialogRef.current) return

                          dialogRef.current.showModal()
                        }}
                      >
                        New &#xFF0B;
                      </button>
                    </article>
                  )}
                </section>
              )}
            </>
          )}
        </>
      )}

      <dialog ref={dialogRef} className="w-[28rem] rounded-lg text-zinc-700">
        <h3 className="text-lg font-semibold mb-2">Generate key</h3>
        {generatedKey.id === "" && (
          <GenerateKeyForm
            closeModal={() => {
              if (!dialogRef.current) return

              dialogRef.current.close()
              setGeneratedKey({
                id: "",
                secret: "",
                displayName: "",
              })
            }}
            setGeneratedKey={setGeneratedKey}
          />
        )}
        {generatedKey.id !== "" && (
          <GeneratedKeySection
            closeModal={() => {
              if (!dialogRef.current) return

              dialogRef.current.close()
              setGeneratedKey({
                id: "",
                secret: "",
                displayName: "",
              })
            }}
            generatedKey={generatedKey}
          />
        )}
      </dialog>
    </main>
  )
}

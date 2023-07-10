import { useState } from "react"
import { z } from "zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { PencilSquareIcon, TrashIcon } from "@/components/hero-icons"
import { GenerateKeyDialog } from "@/components/generate-key-dialog"
import { EditKeyDialog } from "@/components/edit-key-dialog"
import { SideNav } from "@/components/sidenav"

function ApiKeyItem({
  apiKey,
  index,
}: {
  apiKey: { keyId: string; createdAt: string; displayName: string }
  index: number
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: deleteApiKey } = useMutation({
    mutationFn: async (keyId: string) => {
      const response = await fetch(`/api/key/${keyId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Fetch error")
      const { result } = await response.json()

      return ApiDeleteResultSchema.parse(result)
    },
    onSuccess: (deletedKey) => {
      queryClient.setQueryData<ApiGetResultType>(["apiKeys"], (oldData) =>
        oldData
          ? oldData.filter((data) => data.keyId !== deletedKey.keyId)
          : oldData
      )
    },
  })

  return (
    <article
      className={`px-4 py-2 flex justify-between ${
        index === MAX_APIKEY_COUNT - 1 ? "" : "border-b border-zinc-300"
      }`}
    >
      <div>
        <p className="font-medium">{apiKey.displayName}</p>
        <p className="text-zinc-500 text-xs">Access Key ID: {apiKey.keyId}</p>
        <p className="text-zinc-500 text-xs">
          Created date: {new Date(apiKey.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex gap-2 items-start">
        <button
          type="button"
          className="hover:bg-zinc-100 px-2 py-2 rounded-md transition duration-200"
          onClick={() => deleteApiKey(apiKey.keyId)}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          className="hover:bg-zinc-100 px-2 py-2 rounded-md transition duration-200"
          onClick={() => setIsDialogOpen(true)}
        >
          <PencilSquareIcon className="w-5 h-5" />
        </button>
      </div>
      <EditKeyDialog
        apiKey={apiKey}
        isOpen={isDialogOpen}
        close={() => setIsDialogOpen(false)}
      />
    </article>
  )
}

const ApiGetResultSchema = z
  .object({
    keyId: z.string().length(20),
    createdAt: z.string().min(1),
    displayName: z.string().max(50),
  })
  .array()

type ApiGetResultType = z.infer<typeof ApiGetResultSchema>

const ApiDeleteResultSchema = z.object({
  keyId: z.string().length(20),
  createdAt: z.string().min(1),
  displayName: z.string().max(50),
})

const MAX_APIKEY_COUNT = 5

export default function ApiKeys() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    data: apiKeys,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      const response = await fetch("/api/key")

      if (!response.ok) {
        throw new Error("Fetch error")
      }

      const { results } = await response.json()
      const validApiKeys = ApiGetResultSchema.parse(results)

      validApiKeys.sort((first, second) => {
        const firstDate = new Date(first.createdAt).getTime()
        const secondDate = new Date(second.createdAt).getTime()

        if (firstDate === secondDate) return 0
        if (firstDate < secondDate) return 1

        return -1
      })

      return validApiKeys
    },
  })

  return (
    <div className="max-w-6xl mx-auto w-full grid grid-cols-[16rem_auto]">
      <SideNav />
      <main className="text-zinc-700 py-12 px-6">
        <div className="max-w-xl mx-auto">
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
                        onClick={() => setIsDialogOpen(true)}
                      >
                        Generate new key
                      </button>
                    </section>
                  ) : (
                    <section className="min-h-[20rem] border-x border-b border-zinc-300">
                      {apiKeys.map((apiKey, index) => (
                        <ApiKeyItem
                          key={apiKey.keyId}
                          apiKey={apiKey}
                          index={index}
                        />
                      ))}
                      {apiKeys.length < MAX_APIKEY_COUNT && (
                        <article className="flex justify-center px-4 py-4">
                          <button
                            type="button"
                            className="px-4 py-2 text-sm hover:bg-zinc-700 hover:text-white border border-zinc-700 transition duration-200 font-semibold rounded-md"
                            onClick={() => setIsDialogOpen(true)}
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

          <GenerateKeyDialog
            isOpen={isDialogOpen}
            close={() => setIsDialogOpen(false)}
          />
        </div>
      </main>
    </div>
  )
}

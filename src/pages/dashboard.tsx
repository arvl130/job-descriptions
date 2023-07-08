import { GenerateKeyForm } from "@/components/generate-key-form"
import { GeneratedKeySection } from "@/components/generated-key-section"
import { useRef, useState } from "react"

export default function Dashboard() {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [generatedKey, setGeneratedKey] = useState({
    id: "",
    secret: "",
    displayName: "",
  })

  return (
    <main className="max-w-xl w-full mx-auto text-zinc-700 py-12 px-6">
      <section>
        <header>
          <input
            type="text"
            placeholder="Search keys ..."
            className="bg-zinc-50 placeholder-zinc-400 w-full px-4 py-2 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-500 border border-zinc-300 rounded-t-md focus:border focus:border-purple-600 transition duration-100"
          />
        </header>
        <article className="min-h-[20rem] border-x border-b border-zinc-300 flex flex-col justify-center items-center">
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
        </article>
      </section>

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

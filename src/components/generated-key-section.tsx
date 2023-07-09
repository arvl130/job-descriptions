import {
  CheckIcon,
  ClipboardIcon,
  EyeIcon,
  SlashedEyeIcon,
} from "@/components/hero-icons"
import { useEffect, useState, useRef } from "react"

function CensoredCodeBlock({ content }: { content: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const timeoutHandle = useRef<NodeJS.Timeout | null>(null)

  useEffect(
    () => () => {
      if (timeoutHandle.current) {
        clearTimeout(timeoutHandle.current)
      }
    },
    []
  )

  return (
    <code className="flex items-center justify-between bg-zinc-100 px-4 py-2 rounded-md">
      {isVisible ? (
        <>{content}</>
      ) : (
        <>{Array(content.length).fill("*").join("")}</>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsVisible((currIsVisible) => !currIsVisible)}
          className="hover:bg-zinc-200 active:bg-zinc-300 transition duration-200 px-1 py-1 rounded-md"
        >
          {isVisible ? (
            <EyeIcon className="w-5 h-5" />
          ) : (
            <SlashedEyeIcon className="w-5 h-5" />
          )}
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(content)

              setHasCopied(true)
              if (!timeoutHandle.current) {
                timeoutHandle.current = setTimeout(() => {
                  setHasCopied(false)
                  timeoutHandle.current = null
                }, 5000)
              }
            } catch {
              console.log("copy to clipboard error")
            }
          }}
          className={`hover:bg-zinc-200 active:bg-zinc-300 transition duration-200 px-1 py-1 rounded-md border ${
            hasCopied
              ? "border-green-600 text-green-600"
              : "border-zinc-100 hover:border-zinc-200 active:border-zinc-300"
          }`}
        >
          {hasCopied ? (
            <CheckIcon className="w-5 h-5" />
          ) : (
            <ClipboardIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </code>
  )
}

export function GeneratedKeySection({
  closeModal,
  generatedKey,
}: {
  closeModal: () => void
  generatedKey: { id: string; secret: string; displayName: string }
}) {
  return (
    <section>
      <p className="font-medium mb-1">ID</p>
      <code className="block bg-zinc-100 px-4 py-2 rounded-md mb-3">
        {generatedKey.id}
      </code>
      <p className="font-medium mb-1">Secret</p>
      <CensoredCodeBlock content={generatedKey.secret} />
      <p className="text-xs mt-2">
        This will only be shown once. Copy this key secret and store it in a
        secure location.
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => closeModal()}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 transition duration-200 text-white font-medium rounded-md"
        >
          Close
        </button>
      </div>
    </section>
  )
}

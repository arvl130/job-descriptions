import { useEffect, useRef, useState } from "react"
import { CheckIcon, ClipboardIcon, EyeIcon, SlashedEyeIcon } from "./hero-icons"
import { JobItemType, SEARCH_RESULT_PAGE_SIZE } from "./landing-page-form"

function CopyButton({ content }: { content: string }) {
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
          : "border-zinc-300 hover:border-zinc-200 active:border-zinc-300"
      }`}
    >
      {hasCopied ? (
        <CheckIcon className="w-5 h-5" />
      ) : (
        <ClipboardIcon className="w-5 h-5" />
      )}
    </button>
  )
}

function SearchResultItemActionButtons({
  content,
  isHidden,
  toggleIsHidden,
}: {
  content: string
  isHidden: boolean
  toggleIsHidden: () => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        className="border border-zinc-300 hover:bg-zinc-200 transition duration-200 px-1 py-1 rounded-md"
        onClick={toggleIsHidden}
      >
        {isHidden ? <SlashedEyeIcon /> : <EyeIcon />}
      </button>
      <CopyButton content={content} />
    </div>
  )
}

export function SearchResultItem({
  jobDescription,
  index,
}: {
  jobDescription: JobItemType
  index: number
}) {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <article
      className={`px-4 py-2 grid grid-cols-[1fr_auto] gap-3 ${
        index < SEARCH_RESULT_PAGE_SIZE - 1 ? "border-b border-zinc-300" : ""
      }`}
    >
      <div>
        <p className="font-medium">{jobDescription.title}</p>
        <p className="text-xs mb-2">{jobDescription.category}</p>
        {isHidden ? (
          <p className="text-sm text-zinc-500">
            {jobDescription.description.slice(0, 70)} ...
          </p>
        ) : (
          <p className="text-sm text-zinc-500 text-justify">
            {jobDescription.description}
          </p>
        )}
        {jobDescription.short_title && (
          <p className="text-xs">Also known as: {jobDescription.short_title}</p>
        )}
      </div>
      <SearchResultItemActionButtons
        content={jobDescription.description}
        isHidden={isHidden}
        toggleIsHidden={() => setIsHidden((currIsHidden) => !currIsHidden)}
      />
    </article>
  )
}

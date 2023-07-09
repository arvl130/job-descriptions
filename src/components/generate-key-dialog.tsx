import { GenerateKeyForm } from "@/components/generate-key-form"
import { GeneratedKeySection } from "@/components/generated-key-section"
import { useEffect, useRef, useState } from "react"

export function GenerateKeyDialog({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const [generatedKey, setGeneratedKey] = useState({
    id: "",
    secret: "",
    displayName: "",
  })

  useEffect(() => {
    if (dialogRef.current) {
      if (isOpen) {
        dialogRef.current.showModal()
      } else {
        dialogRef.current.close()
      }
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className="w-[28rem] rounded-lg text-zinc-700"
      onClose={() => {
        close()
        setGeneratedKey({
          id: "",
          secret: "",
          displayName: "",
        })
      }}
    >
      <h3 className="text-lg font-semibold mb-2">Generate key</h3>
      {generatedKey.id === "" && (
        <GenerateKeyForm
          closeModal={() => {
            if (!dialogRef.current) return

            dialogRef.current.close()
          }}
          setGeneratedKey={setGeneratedKey}
          isModalOpen={isOpen}
        />
      )}
      {generatedKey.id !== "" && (
        <GeneratedKeySection
          closeModal={() => {
            if (!dialogRef.current) return

            dialogRef.current.close()
          }}
          generatedKey={generatedKey}
        />
      )}
    </dialog>
  )
}

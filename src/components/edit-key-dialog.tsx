import { useEffect, useRef } from "react"
import { EditKeyForm } from "@/components/edit-key-form"

export function EditKeyDialog({
  isOpen,
  close,
  apiKey,
}: {
  isOpen: boolean
  close: () => void
  apiKey: {
    keyId: string
    createdAt: string
    displayName: string
  }
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

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
      }}
    >
      <h3 className="text-lg font-semibold mb-2">
        Edit key: {apiKey.displayName}
      </h3>
      <EditKeyForm apiKey={apiKey} closeModal={close} isModalOpen={isOpen} />
    </dialog>
  )
}

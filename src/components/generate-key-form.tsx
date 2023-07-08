import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const FormSchema = z.object({
  displayName: z.string().min(1).max(50),
})

type FormType = z.infer<typeof FormSchema>

const ApiResultSchema = z.object({
  keyId: z.string().length(20),
  keySecret: z.string().length(32),
  displayName: z.string().max(50),
})

export function GenerateKeyForm({
  setGeneratedKey,
  closeModal,
}: {
  closeModal: () => void
  setGeneratedKey: (key: {
    id: string
    secret: string
    displayName: string
  }) => void
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
  })

  return (
    <form
      onSubmit={handleSubmit(async (formData) => {
        const response = await fetch("/api/key/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: formData.displayName,
          }),
        })

        if (!response.ok) {
          console.log("Fetch error")
          return
        }

        const { result } = await response.json()
        const { keyId, keySecret, displayName } = ApiResultSchema.parse(result)

        setGeneratedKey({
          id: keyId,
          secret: keySecret,
          displayName,
        })
      })}
    >
      <div className="grid mb-4">
        <label className="mb-1">Name</label>
        <input
          type="text"
          className={`w-full bg-zinc-50 px-4 py-2 rounded-md border focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-purple-500 transition duration-100 ${
            errors.displayName
              ? "border-red-500"
              : "border-zinc-300 focus:border-purple-600"
          }`}
          placeholder="A descriptive name ..."
          maxLength={50}
          {...register("displayName")}
        />
        {errors.displayName && (
          <div className="mt-2 text-red-600">Please enter a name.</div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => closeModal()}
          className="px-4 py-2 hover:bg-zinc-100 transition duration-200 font-medium rounded-md"
        >
          Close
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 transition duration-200 text-white font-medium rounded-md"
        >
          Generate
        </button>
      </div>
    </form>
  )
}

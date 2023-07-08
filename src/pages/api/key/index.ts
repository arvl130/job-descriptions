import { getApiKeys } from "@/server/db"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "@/server/auth"
import { ZodError, z } from "zod"

const InputSchema = z.object({
  userId: z.string().uuid(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        message: string
        error?: unknown
      }
    | {
        message: string
        results: {
          keyId: string
          displayName: string
        }[]
      }
  >
) {
  if (req.method !== "GET") {
    res.status(405).json({
      message: "Only GET requests are supported",
    })
    return
  }

  try {
    const session = await getServerSession(req, res, nextAuthOptions)
    const user = session?.user

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      })
      return
    }

    const { userId } = InputSchema.parse({
      userId: user.id,
    })

    const apiKeys = await getApiKeys(userId)

    res.json({
      message: "Access keys retrieved",
      results: apiKeys.map((apiKey) => ({
        keyId: apiKey.keyId,
        displayName: apiKey.displayName,
      })),
    })
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({
        message: "Validation error occured",
        error: e.flatten(),
      })
      return
    }

    if (e instanceof Error) {
      res.status(500).json({
        message: "Generic error occured",
        error: e,
      })
      return
    }

    res.status(500).json({
      message: "Unknown error occured",
      error: e,
    })
  }
}

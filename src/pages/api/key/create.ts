import { createApiKey } from "@/server/db"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "@/server/auth"
import { ZodError, z } from "zod"

const InputSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().min(1).max(50),
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
        result: {
          keyId: string
          keySecret: string
          displayName: string
          createdAt: string
        }
      }
  >
) {
  if (req.method !== "POST") {
    res.status(405).json({
      message: "Only POST requests are supported",
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

    const { userId, displayName } = InputSchema.parse({
      userId: user.id,
      displayName: req.body.displayName,
    })

    const { keyId, keySecret, createdAt } = await createApiKey({
      userId,
      displayName,
    })

    res.json({
      message: "Access key created",
      result: {
        keyId,
        keySecret,
        createdAt,
        displayName,
      },
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

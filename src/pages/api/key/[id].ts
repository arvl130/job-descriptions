import { createApiKey, deleteApiKey, editApiKey } from "@/server/db"
import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { nextAuthOptions } from "@/server/auth"
import { ZodError, z } from "zod"

const InputSchema = z.object({
  userId: z.string().uuid(),
  keyId: z.string().startsWith("AKID"),
})

async function DELETE(
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
          createdAt: string
          displayName: string
        }
      }
  >
) {
  try {
    const session = await getServerSession(req, res, nextAuthOptions)
    const user = session?.user

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      })
      return
    }

    const { userId, keyId } = InputSchema.parse({
      userId: user.id,
      keyId: req.query.id,
    })

    const { displayName, createdAt } = await deleteApiKey({
      userId,
      keyId,
    })

    res.json({
      message: "Access key deleted",
      result: {
        keyId,
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

const EditInputSchema = z.object({
  userId: z.string().uuid(),
  keyId: z.string().startsWith("AKID"),
  displayName: z.string().min(1).max(50),
})

async function POST(
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
          createdAt: string
          displayName: string
        }
      }
  >
) {
  try {
    const session = await getServerSession(req, res, nextAuthOptions)
    const user = session?.user

    if (!user) {
      res.status(401).json({
        message: "Unauthorized",
      })
      return
    }

    const { userId, keyId, displayName } = EditInputSchema.parse({
      userId: user.id,
      keyId: req.query.id,
      displayName: req.body.displayName,
    })

    const { createdAt } = await editApiKey({
      userId,
      keyId,
      displayName,
    })

    res.json({
      message: "Access key updated",
      result: {
        keyId,
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
          createdAt: string
          displayName: string
        }
      }
  >
) {
  if (req.method === "DELETE") {
    DELETE(req, res)
    return
  }

  if (req.method === "POST") {
    POST(req, res)
    return
  }

  res.status(405).json({
    message: "Only POST and DELETE requests are supported",
  })
}

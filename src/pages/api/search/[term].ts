import type { NextApiRequest, NextApiResponse } from "next"
import { z, ZodError } from "zod"
import { getJobs, isValidApiKey } from "@/server/db"
import NextCors from "nextjs-cors"

export type SearchResult = {
  message: string
  result?: {
    jobs: Array<{
      category: string
      title: string
      short_title: string | null
      description: string
    }>
    total: number
    limit: number
  }
  error?: unknown
}

const InputSchema = z.object({
  term: z.string(),
  limit: z.number().min(5).max(100).default(50),
  userId: z.string().uuid(),
  accessKeyId: z.string().length(20).startsWith("AKID"),
  accessKeySecret: z.string().length(32),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
  })

  if (req.method !== "GET") {
    res.status(405).json({
      message: "Only GET requests are supported",
    })
    return
  }

  try {
    const { term, limit, userId, accessKeyId, accessKeySecret } = req.query
    const input = InputSchema.parse({
      term,
      limit: typeof limit === "string" ? parseInt(limit) : undefined,
      userId,
      accessKeyId,
      accessKeySecret,
    })

    const isValid = await isValidApiKey({
      userId: input.userId,
      keyId: input.accessKeyId,
      keySecret: input.accessKeySecret,
    })

    if (!isValid) {
      res.status(401).json({
        message: "Unauthorized",
      })
      return
    }

    const jobs = await getJobs({
      term: input.term,
      limit: input.limit,
    })

    res.json({
      message: `Retrieved a list of jobs related to: ${input.term}`,
      result: {
        jobs: jobs.map((job) => {
          return {
            category: job.title,
            title: job.alternate_title,
            short_title: job.short_title,
            description: job.description,
          }
        }),
        limit: input.limit,
        total: jobs.length,
      },
    })
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({
        message: "Validation error occured",
        error: e,
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

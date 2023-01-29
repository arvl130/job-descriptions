import type { NextApiRequest, NextApiResponse } from "next"
import { runCorsMiddleware } from "@/server/cors"
import { db } from "@/server/db"
import { z, ZodError } from "zod"

const { DB_ENGINE } = process.env

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
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResult>
) {
  await runCorsMiddleware(req, res)

  if (req.method !== "GET") {
    res.status(405).json({
      message: "Only GET requests are supported",
    })
    return
  }

  if (DB_ENGINE !== "mysql" && DB_ENGINE !== "postgres")
    throw new Error("Missing or invalid credentials")

  try {
    const { term, limit } = req.query
    const input = InputSchema.parse({
      term,
      limit: typeof limit === "string" ? parseInt(limit) : undefined,
    })

    const comparisonOperation = DB_ENGINE === "postgres" ? "ilike" : "like"

    const jobs = await db
      .selectFrom("occupation_data")
      .innerJoin(
        "alternate_titles",
        "occupation_data.onetsoc_code",
        "alternate_titles.onetsoc_code"
      )
      .select(["title", "alternate_title", "description", "short_title"])
      .where("alternate_title", comparisonOperation, `%${input.term}%`)
      .orWhere("short_title", comparisonOperation, `%${input.term}%`)
      .limit(input.limit)
      .execute()

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

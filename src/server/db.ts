import { postgresqlDb } from "./postgresql"

export function getJobs({ limit, term }: { limit: number; term: string }) {
  return postgresqlDb
    .selectFrom("occupation_data")
    .innerJoin(
      "alternate_titles",
      "occupation_data.onetsoc_code",
      "alternate_titles.onetsoc_code"
    )
    .select(["title", "alternate_title", "description", "short_title"])
    .where("alternate_title", "ilike", `%${term}%`)
    .orWhere("short_title", "ilike", `%${term}%`)
    .limit(limit)
    .execute()
}

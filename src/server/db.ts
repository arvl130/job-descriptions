import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"

interface OccupationDataTable {
  onetsoc_code: string
  title: string
  description: string
}

interface AlternateTitlesTable {
  onetsoc_code: string
  alternate_title: string
  short_title: string | null
  sources: string
}

interface Database {
  occupation_data: OccupationDataTable
  alternate_titles: AlternateTitlesTable
}

const { POSTGRES_CONNECTION_STRING } = process.env
const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: POSTGRES_CONNECTION_STRING,
    }),
  }),
  log:
    process.env.NODE_ENV !== "production"
      ? function (event) {
          if (event.level === "query") {
            console.log("SQL query executed.")
            console.log(`Query: ${event.query.sql}`)
            console.log(`Parameters: ${event.query.parameters}`)
          }
        }
      : undefined,
})

export function getJobs({ limit, term }: { limit: number; term: string }) {
  return db
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

import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import { serverEnv } from "./env"

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

const { POSTGRES_CONNECTION_STRING } = serverEnv
export const postgresqlDb = new Kysely<Database>({
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

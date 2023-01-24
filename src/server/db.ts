import { Kysely, MysqlDialect, PostgresDialect } from "kysely"
import { Pool } from "pg"
import { createPool } from "mysql2"

const {
  DB_ENGINE,
  DB_POSTGRES_CONNECTION_STRING,
  DB_MYSQL_HOST,
  DB_MYSQL_USER,
  DB_MYSQL_PASSWORD,
  DB_MYSQL_DATABASE,
  DB_MYSQL_PORT,
} = process.env

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

function createPostgresDialect(): PostgresDialect {
  if (!DB_POSTGRES_CONNECTION_STRING)
    throw new Error("Missing or invalid database credentials")

  return new PostgresDialect({
    pool: new Pool({
      connectionString: DB_POSTGRES_CONNECTION_STRING,
    }),
  })
}

function createMySqlDialect(): MysqlDialect {
  if (
    !(DB_MYSQL_HOST && DB_MYSQL_USER && DB_MYSQL_PASSWORD && DB_MYSQL_DATABASE)
  )
    throw new Error("Missing or invalid database credentials")

  return new MysqlDialect({
    pool: createPool({
      host: DB_MYSQL_HOST,
      user: DB_MYSQL_USER,
      password: DB_MYSQL_PASSWORD,
      database: DB_MYSQL_DATABASE,
      port: typeof DB_MYSQL_PORT === "string" ? parseInt(DB_MYSQL_PORT) : 3306,
    }),
  })
}

function createDialect(dbEngine: "mysql" | "postgres") {
  switch (dbEngine) {
    case "mysql":
      return createMySqlDialect()
    case "postgres":
      return createPostgresDialect()
  }
}

function getDbEngine() {
  switch (DB_ENGINE) {
    case "mysql":
      return DB_ENGINE
    case "postgres":
      return DB_ENGINE
    default:
      throw new Error(
        "Invalid database engine: only 'mysql' or 'postgres' is supported."
      )
  }
}

function createDb() {
  return new Kysely<Database>({
    dialect: createDialect(getDbEngine()),
    log(event) {
      if (event.level === "query") {
        console.log(event.query.sql)
        console.log(event.query.parameters)
      }
    },
  })
}

export const db = createDb()

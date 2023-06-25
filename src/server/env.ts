import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    POSTGRES_CONNECTION_STRING: z.string().min(1),
  },
  runtimeEnv: {
    POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION_STRING,
  },
})

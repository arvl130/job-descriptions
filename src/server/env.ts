import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const serverEnv = createEnv({
  server: {
    POSTGRES_CONNECTION_STRING: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_ACCESS_KEY_SECRET: z.string().min(1),
    DYNAMODB_ENDPOINT_URL: z.string().min(1).optional(),
    DYNAMODB_TABLE_NAME: z.string().min(1),
    DYNAMODB_INDEX_NAME: z.string().min(1),
    DYNAMODB_INDEX_PK: z.string().min(1),
    DYNAMODB_INDEX_SK: z.string().min(1),
  },
  runtimeEnv: {
    POSTGRES_CONNECTION_STRING: process.env.POSTGRES_CONNECTION_STRING,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_ACCESS_KEY_SECRET: process.env.AWS_ACCESS_KEY_SECRET,
    DYNAMODB_ENDPOINT_URL: process.env.DYNAMODB_ENDPOINT_URL,
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
    DYNAMODB_INDEX_NAME: process.env.DYNAMODB_INDEX_NAME,
    DYNAMODB_INDEX_PK: process.env.DYNAMODB_INDEX_PK,
    DYNAMODB_INDEX_SK: process.env.DYNAMODB_INDEX_SK,
  },
})

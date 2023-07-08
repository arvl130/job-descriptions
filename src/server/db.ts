import { postgresqlDb } from "./postgresql"
import { dynamodbDocument } from "./dynamodb"
import { serverEnv } from "./env"
import { scryptSync, randomBytes, timingSafeEqual } from "crypto"
import { z } from "zod"

const { DYNAMODB_TABLE_NAME } = serverEnv

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

export async function createApiKey({
  userId,
  displayName,
}: {
  userId: string
  displayName: string
}) {
  const keyId = `AKID${randomBytes(8).toString("hex").toUpperCase()}`
  const keySecret = randomBytes(16).toString("hex").toUpperCase()
  const keySalt = randomBytes(16).toString("hex").toUpperCase()
  const keyHash = scryptSync(keySecret, keySalt, 64)
    .toString("hex")
    .toUpperCase()

  await dynamodbDocument.put({
    TableName: DYNAMODB_TABLE_NAME,
    Item: {
      pk: `USER#${userId}`,
      sk: `APIKEY#${keyId}`,
      keyId,
      keySalt,
      keyHash,
      displayName,
    },
  })

  return {
    keyId,
    keySecret,
  }
}

const ApiKeyItemSchema = z.object({
  pk: z.string().startsWith("USER#"),
  sk: z.string().startsWith("APIKEY#"),
  keyId: z.string().length(20),
  keySalt: z.string().length(32),
  keyHash: z.string().length(128),
  displayName: z.string().min(1).max(50),
})

export async function isValidApiKey({
  userId,
  keyId,
  keySecret,
}: {
  userId: string
  keyId: string
  keySecret: string
}) {
  const { Item } = await dynamodbDocument.get({
    TableName: DYNAMODB_TABLE_NAME,
    Key: {
      pk: `USER#${userId}`,
      sk: `APIKEY#${keyId}`,
    },
  })

  if (!Item) return false

  const { keySalt, keyHash } = ApiKeyItemSchema.parse(Item)
  const givenKeyHashBuffer = scryptSync(keySecret, keySalt, 64)
  const storedKeyHashBuffer = Buffer.from(keyHash, "hex")
  const isValid = timingSafeEqual(givenKeyHashBuffer, storedKeyHashBuffer)

  return isValid
}

export async function getApiKeys(userId: string) {
  const { Items } = await dynamodbDocument.query({
    TableName: DYNAMODB_TABLE_NAME,
    KeyConditions: {
      pk: {
        ComparisonOperator: "EQ",
        AttributeValueList: [`USER#${userId}`],
      },
      sk: {
        ComparisonOperator: "BEGINS_WITH",
        AttributeValueList: ["APIKEY#"],
      },
    },
  })

  if (!Items) return []
  const ValidatedItems = ApiKeyItemSchema.array().parse(Items)

  return ValidatedItems
}

import { NextAuthOptions } from "next-auth"
import type { Adapter } from "next-auth/adapters"
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
import GoogleProvider from "next-auth/providers/google"
import { dynamodbDocument } from "@/server/dynamodb"
import { serverEnv } from "@/server/env"

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXTAUTH_SECRET,
  DYNAMODB_TABLE_NAME,
  DYNAMODB_INDEX_NAME,
  DYNAMODB_INDEX_PK,
  DYNAMODB_INDEX_SK,
} = serverEnv

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: DynamoDBAdapter(dynamodbDocument, {
    tableName: DYNAMODB_TABLE_NAME,
    // Hardcode these values for now until custom PK and SK
    // are supported.
    // Issue: https://github.com/nextauthjs/next-auth/issues/7973
    partitionKey: "pk",
    sortKey: "sk",
    indexName: DYNAMODB_INDEX_NAME,
    indexPartitionKey: DYNAMODB_INDEX_PK,
    indexSortKey: DYNAMODB_INDEX_SK,
    // Adapter type is still broken, so we have
    // to assert the type here for now.
    // Issue: https://github.com/nextauthjs/next-auth/issues/6106
  }) as Adapter,
  secret: NEXTAUTH_SECRET,
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id

      return session
    },
  },
}

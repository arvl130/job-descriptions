import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DynamoDBAdapter } from "@next-auth/dynamodb-adapter"
import { dynamodbDocument } from "@/server/dynamodb"
import { serverEnv } from "@/server/env"

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXT_AUTH_SECRET,
  DYNAMODB_TABLE_NAME,
} = serverEnv

export const nextAuthOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: DynamoDBAdapter(dynamodbDocument, {
    tableName: DYNAMODB_TABLE_NAME,
    partitionKey: "PK",
    sortKey: "SK",
    indexName: "GSI1",
    indexPartitionKey: "GSI1PK",
    indexSortKey: "GSI1SK",
  }),
  secret: NEXT_AUTH_SECRET,
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id

      return session
    },
  },
}

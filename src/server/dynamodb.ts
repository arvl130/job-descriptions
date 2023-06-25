import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { serverEnv } from "./env"

const { AWS_REGION, DYNAMODB_ENDPOINT_URL } = serverEnv
const dynamodb = new DynamoDB({
  region: AWS_REGION,
  endpoint: DYNAMODB_ENDPOINT_URL,
})

export const dynamodbDocument = DynamoDBDocument.from(dynamodb, {
  marshallOptions: {
    convertClassInstanceToMap: true,
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
})

import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { serverEnv } from "./env"

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_ACCESS_KEY_SECRET,
  DYNAMODB_ENDPOINT_URL,
} = serverEnv
const dynamodb = new DynamoDB(
  DYNAMODB_ENDPOINT_URL === undefined
    ? {
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_ACCESS_KEY_SECRET,
        },
      }
    : {
        region: AWS_REGION,
        endpoint: DYNAMODB_ENDPOINT_URL,
      }
)

export const dynamodbDocument = DynamoDBDocument.from(dynamodb, {
  marshallOptions: {
    convertClassInstanceToMap: true,
    convertEmptyValues: true,
    removeUndefinedValues: true,
  },
})

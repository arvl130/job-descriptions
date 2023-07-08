#! /bin/sh -e 

aws dynamodb \
  --no-cli-pager \
  --endpoint-url http://localhost:4566 \
  create-table \
  --table-name JobDescriptions \
  --attribute-definitions \
    AttributeName=pk,AttributeType=S \
    AttributeName=sk,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
  --key-schema \
    AttributeName=pk,KeyType=HASH \
    AttributeName=sk,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --global-secondary-indexes \
    "
      [
        {
          \"IndexName\": \"GSI1\",
          \"Projection\": {
            \"ProjectionType\": \"ALL\"
          },
          \"KeySchema\": [
            {
              \"AttributeName\": \"GSI1PK\",
              \"KeyType\": \"HASH\"
            },
            {
              \"AttributeName\": \"GSI1SK\",
              \"KeyType\": \"RANGE\"
            }
          ],
          \"ProvisionedThroughput\": {
            \"ReadCapacityUnits\": 5,
            \"WriteCapacityUnits\": 5
          }
        }
      ]
    "
aws dynamodb \
  --no-cli-pager \
  --endpoint-url http://localhost:4566 \
  update-time-to-live \
  --table-name JobDescriptions \
  --time-to-live-specification Enabled=true,AttributeName=expires


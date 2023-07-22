#! /bin/sh -e 

echo ">>> Creating DynamoDB table ..."
aws dynamodb \
  --no-cli-pager \
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
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
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
            \"ReadCapacityUnits\": 1,
            \"WriteCapacityUnits\": 1
          }
        }
      ]
    "

echo ">>> Waiting for table to be active ..."
while [ \
  "$(aws dynamodb --no-cli-pager describe-table --table-name JobDescriptions \
    | jq '.Table.TableStatus == "ACTIVE"')" \
    != "true" \
  ]
do
  sleep 3
done
echo ">>> Table created."

echo ">>> Enabling TTL on DynamoDB table ..."
aws dynamodb \
  --no-cli-pager \
  update-time-to-live \
  --table-name JobDescriptions \
  --time-to-live-specification Enabled=true,AttributeName=expires
echo ">>> TTL enabled."

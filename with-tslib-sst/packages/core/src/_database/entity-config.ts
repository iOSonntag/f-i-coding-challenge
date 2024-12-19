

import { Dev } from ':tslib-sst/api-code/utils/dev';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { EntityConfiguration } from 'electrodb';
import { Agent } from 'http';
import { Resource } from 'sst';

export const entityConfig: EntityConfiguration = {
  client: DynamoDBDocumentClient.from(
    new DynamoDBClient({
      requestHandler: new NodeHttpHandler({
        httpAgent: new Agent({
          keepAlive: true,
          keepAliveInitialDelay: 0,
          keepAliveMsecs: 10000,
        }),
      }),
      logger: Dev.awsLogger,
    }),
    {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    }
  ),
  table: Resource.ApiParams.databaseTable,
};

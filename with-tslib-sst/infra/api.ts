



const database = new sst.aws.Dynamo(`Database`, {
  fields: {
    pk: 'string',
    sk: 'string',
    gsi1_pk: 'string',
    gsi1_sk: 'string',
  },
  primaryIndex: { 
    hashKey: 'pk', 
    rangeKey: 'sk' 
  },
  globalIndexes: {
    gsi1: {
      hashKey: 'gsi1_pk',
      rangeKey: 'gsi1_sk',
      projection: 'all',
    },
  },
  transform: {
    table: {
      pointInTimeRecovery: {
        enabled: $app.stage === 'prod',
      }
    },
  },
});

const params = new sst.Linkable('ApiParams', {
  properties: { 
    deployRegion: $app.providers.aws.region,
    databaseTable: database.name,
  }
});



export const api = new sst.aws.ApiGatewayV2('Api', {
  accessLog: {
    retention: $app.stage === 'prod' ? '6 months' : '1 week',
  },
  link: [
    params,
    database,
  ],
  cors: {
    allowOrigins: ['*'],
    allowMethods: ['GET', 'POST', 'PUT',  'DELETE'],
    allowHeaders: [
      'Content-Type',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
      'X-Amz-Security-Token',
      'X-Amz-User-Agent',
      'X-User-Id',
    ],
  },
  transform: {
    route: {
      handler: (args, opts) => 
      {
        args.logging = {
          retention: $app.stage === 'prod' ? '6 months' : '1 week',
        };

        // set the following defaults if they are not set by the routes itself (explicit)
        args.memory ??= '2048 MB';
        args.timeout ??= '30 seconds';
      }
    },
  },
});

api.route(   'GET /articles',       'packages/api/src/routes/articles/GET.handler');
api.route(  'POST /articles',       'packages/api/src/routes/articles/POST.handler');


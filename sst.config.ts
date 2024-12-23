/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app: (input) =>
  {
    return {
      name: 'fichallenge',
      removal: input?.stage === 'prod' ? 'retain' : 'remove',
      protect: input?.stage === 'prod',
      home: 'aws',
      providers: {
        aws: {
          region: 'eu-central-1'
        }
      },
    };
  },
  run: async () =>
  {
    const api = await import('./infra/api');

    return {
      apiUrl: api.api.url,
    };
  },
});

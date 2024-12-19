import { ApiHubConfig } from ':tslib-sst/api-code/api-hub';
import { Dev } from ':tslib-sst/api-code/utils/dev';
import { Resource } from 'sst';


export const apiHubConfig: ApiHubConfig = {
  env: Resource.App.stage,
  region: Resource.ApiParams.deployRegion,
  events: {
    onApiIssue: async (issue) =>
    {
      Dev.logIssue('API ISSUE', issue.toDeveloperReport());
    },
    errorResponseShouldLogIssue: (response) => true,
  },
  transformers: {
    createApiResponseFromUnkownError: (error) =>
    {
      Dev.logIssue('Unknown error:', error);

      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred.',
        },
      };
    },
    createApiGatewayResponse: (response) =>
    {
      let body: string | undefined;
      let statusCode = 500;

      if (response.success)
      {
        statusCode = 200;

        if ('data' in response)
        {
          body = JSON.stringify({
            data: response.data,
          });
        }
      }
      else
      {
        statusCode = statusCodeFromErrorCode(response.error.code);

        // remove unnecessary success key
        delete (response as any).success;

        body = JSON.stringify(response);
      }

      return {
        statusCode: statusCode,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: body,
      };
    },
  }
};

const statusCodeFromErrorCode = (error: string): number =>
{
  switch (error)
  {
    case 'NOT_IMPLEMENTED':           return 501;
    case 'AUTH_TOKEN_EXPIRED':        return 401;
    case 'AUTH_INVALID':              return 401;
    case 'BAD_REQUEST':               return 400;
    case 'FORBIDDEN':                 return 403;
    case 'RESOURCE_NOT_FOUND':        return 404;
    case 'RESOURCE_ALREADY_EXISTS':   return 409;
    case 'INVALID_PAYLOAD':           return 400;
    case 'INTERNAL_SERVER_ERROR':     return 500;
    default:                          return 500;
  }
}
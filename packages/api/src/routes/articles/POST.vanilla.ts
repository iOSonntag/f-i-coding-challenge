'use strict';

import { ArticleService } from '@app/core/services/article-service';
import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { z } from 'zod';
import * as ZodPackageJson from 'zod/package.json';

const Payload = z.object({
  name: z.string().min(1).max(64),
  description: z.string().max(512).optional(),
  price: z.number().gt(0),
  currency: z.enum(['EUR']),
});

export const handler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> =>
{
  try
  {
    let body: any;

    try
    {
      body = event.body ? JSON.parse(event.body) : {};
    }
    catch (e)
    {
      // ignoring error because zod will handle issues with the payload and
      // return a proper error response with the issues
    }

    const payload = Payload.safeParse(body);

    if (!payload.success)
    {
      console.error('Invalid payload:', body);

      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json; charset=utf-8' 
        },
        body: JSON.stringify({ 
          error: {
            code: 'INVALID_PAYLOAD',
            message: 'The payload does not match the expected schema.',
          },
          zod: {
            version: ZodPackageJson.version,
            issues: payload.error.issues,
          },
        }),
      };
    }

    console.log('Payload:', payload.data);

    const article = await ArticleService.createArticle(payload.data);

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json; charset=utf-8' 
      },
      body: JSON.stringify({ 
        data: article,
      }),
    };
  }
  catch (e)
  {
    console.error(e);

    return {
      statusCode: 500,
      headers: { 
        'Content-Type': 'application/json; charset=utf-8' 
      },
      body: JSON.stringify({ 
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An internal server error occurred.',
        },
      }),
    };
  }
}






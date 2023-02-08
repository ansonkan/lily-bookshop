/*
Use the following code to retrieve configured secrets from SSM:

const aws = require('aws-sdk');

const { Parameters } = await (new aws.SSM())
  .getParameters({
    Names: ["MONGODB_URL_READ_ONLY","MONGODB_URL_READ_WRITE"].map(secretName => process.env[secretName]),
    WithDecryption: true,
  })
  .promise();

Parameters will be of the form { Name: 'secretName', Value: 'secretValue', ... }[]
*/
/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_S3LILYBOOKSHOPSTORAGE135156F8_BUCKETNAME
  SENTRY_DSN
Amplify Params - DO NOT EDIT */

/**
 * `@types/aws-lambda` is not installed as `devDependencies` because `amplify-cli`
 * only install production dependencies when `amplify push`. I've tried using:
 *
 * - npm script (amplify:<function_name>: "cd ... && tsc")
 * - amplify pre-push hook to install and build
 *
 * but either ran into errors or couldn't workaround how `amplify push` installing dependencies.
 *
 * Also, see https://github.com/aws-amplify/amplify-cli/issues/11551
 */
import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as AWS from 'aws-sdk'
import { AWSLambda } from '@sentry/serverless'
import { MongoClient } from 'mongodb'

import { DELETE, GET, PATCH, POST } from 'lib'

let client: MongoClient | undefined

AWSLambda.init({
  dsn: process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
})

export const handler = AWSLambda.wrapHandler(
  async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    if (!client) await createMongoClient()

    let result: Partial<APIGatewayProxyResult> = {}

    // Get authenticated user: https://github.com/aws-amplify/amplify-js/issues/390#issuecomment-451337455

    switch (event.httpMethod) {
      case 'GET':
        result = await GET(client, event)
        break
      case 'POST':
        result = await POST(client, event)
        break
      case 'PUT':
      case 'PATCH':
        result = await PATCH(client, event)
        break
      case 'DELETE':
        result = await DELETE(client, event)
        break
    }

    return {
      statusCode: 200,
      body: '',
      ...result,
      headers: {
        //  Uncomment below to enable CORS requests
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        ...result.headers,
      },
    }
  }
)

async function createMongoClient() {
  if (client) return

  const { Parameters } = await new AWS.SSM()
    .getParameters({
      Names: ['MONGODB_URL_READ_WRITE'].map(
        (secretName) => process.env[secretName]
      ),
      WithDecryption: true,
    })
    .promise()

  const MONGODB_URL_READ_WRITE = Parameters?.find(
    ({ Name }) => Name === process.env.MONGODB_URL_READ_WRITE
  )?.Value

  if (!MONGODB_URL_READ_WRITE) {
    throw new Error('Missing environment variables')
  }

  client = new MongoClient(MONGODB_URL_READ_WRITE)
}

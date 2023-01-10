import type { Document, WithId } from 'mongodb'
import type { APIGatewayEvent } from 'aws-lambda'

export const docIdToString = <T extends Document>({
  _id,
  ...others
}: WithId<T>) => ({ id: _id.toString(), ...others })

const IDP_REGEX = /.*\/.*,(.*)\/(.*):CognitoSignIn:(.*)/

export const getUserInfo = ({ requestContext }: APIGatewayEvent) => {
  const [, , userPoolId, userSub] =
    requestContext.identity.cognitoAuthenticationProvider.match(IDP_REGEX)

  return {
    userPoolId,
    userSub,
  }
}

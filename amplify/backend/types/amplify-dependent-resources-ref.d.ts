export type AmplifyDependentResourcesAttributes = {
  api: {
    apicore: {
      ApiId: 'string'
      ApiName: 'string'
      RootUrl: 'string'
    }
  }
  auth: {
    lilybookshop: {
      AppClientID: 'string'
      AppClientIDWeb: 'string'
      CreatedSNSRole: 'string'
      IdentityPoolId: 'string'
      IdentityPoolName: 'string'
      UserPoolArn: 'string'
      UserPoolId: 'string'
      UserPoolName: 'string'
    }
  }
  function: {
    books: {
      Arn: 'string'
      LambdaExecutionRole: 'string'
      LambdaExecutionRoleArn: 'string'
      Name: 'string'
      Region: 'string'
    }
  }
  storage: {
    s3lilybookshopstorage135156f8: {
      BucketName: 'string'
      Region: 'string'
    }
  }
}

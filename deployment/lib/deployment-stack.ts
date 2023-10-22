import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import { dynamodb } from 'aws-cdk-lib';
// import * as s3 from 'aws-cdk-lib/s3';
import { aws_lambda as lambda } from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { aws_codedeploy as codedeploy } from 'aws-cdk-lib';

export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGateway = new apigateway.RestApi(this, 'BackendServicesApi', {
      restApiName: 'Backend Services',
      description:
        'This api gateway routes requests to the respective services.',
      cloudWatchRole: true,
      deployOptions: {
        stageName: 'dev',
        accessLogDestination: new apigateway.LogGroupLogDestination(
          new cdk.aws_logs.LogGroup(this, 'ApiGatewayAccessLogGroup')
        ),
        accessLogFormat: apigateway.AccessLogFormat.clf(),
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      endpointTypes: [apigateway.EndpointType.REGIONAL],
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });

    new cdk.CfnOutput(this, 'apiUrl', { value: apiGateway.url });

    // Your code here
    const userServiceRole = new iam.Role(this, 'UserServiceRole', {
      roleName: 'user-service-role',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role that manages User Service Lambda',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        ),
      ],
    });

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'user_id', type: dynamodb.AttributeType.STRING },
      tableName: 'users',
    });
    const bucket = Bucket.fromBucketArn(
      this,
      'Bucket',
      'arn:aws:s3:::aws-cdk-lambda'
    );
    const userServiceLambda = new lambda.Function(this, 'UserService', {
      functionName: 'user-service',
      code: lambda.Code.fromBucket(bucket, 'user-service.zip'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      role: userServiceRole,
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
      description: `Generated on: ${new Date().toISOString()}`,
    });

    // const version = userServiceLambda.addVersion(new Date().toISOString());
    const userLambdaVersion = new lambda.Version(
      this,
      'user-service-lambda-version',
      {
        lambda: userServiceLambda,
        description: `Generated on: ${new Date().toISOString()}`,
      }
    );

    const userAlias = new lambda.Alias(this, 'user-service-lambda-alias', {
      aliasName: 'live',
      version: userLambdaVersion,
    });

    new codedeploy.LambdaDeploymentGroup(this, 'user-service-deployment', {
      alias: userAlias,
      deploymentConfig: codedeploy.LambdaDeploymentConfig.ALL_AT_ONCE,
    });

    usersTable.grantReadWriteData(userServiceRole);
    // Create Resource
    // Configure as proxy resource
    // Enable API Gateway CORS
    // const usersResource = apiGateway.root.addResource('users');
    // usersResource.addMethod('ANY',
    //   new apigateway.LambdaIntegration(userServiceLambda, {proxy: true})
    // );
    const userResource = apiGateway.root.addResource('users');
    userResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(userServiceLambda, { proxy: true })
    );
    userResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(userServiceLambda, { proxy: true })
    );
    userResource.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(userServiceLambda),
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.NONE,
        apiKeyRequired: false,
      },
      anyMethod: true,
    });

    const questionServiceRole = new iam.Role(this, 'questionServiceRole', {
      roleName: 'question-service-role',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role that manages Question Service Lambda',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole'
        ),
      ],
    });

    const questionsTable = new dynamodb.Table(this, 'QuestionsTable', {
      partitionKey: { name: 'title', type: dynamodb.AttributeType.STRING },
      tableName: 'questions',
    });

    const metadataTable = new dynamodb.Table(this, 'MetadataTable', {
      partitionKey: { name: 'type', type: dynamodb.AttributeType.STRING },
      tableName: 'metadata',
    });

    questionsTable.grantReadWriteData(questionServiceRole);
    metadataTable.grantReadWriteData(questionServiceRole);

    const questionServiceLambda = new lambda.Function(this, 'questionService', {
      functionName: 'question-service',
      code: lambda.Code.fromBucket(bucket, 'question-service.zip'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      role: questionServiceRole,
      environment: {
        QUESTIONS_TABLE: questionsTable.tableName,
      },
      timeout: cdk.Duration.seconds(3),
      description: `Generated on: ${new Date().toISOString()}`,
    });

    // const version = userServiceLambda.addVersion(new Date().toISOString());
    const questionLambdaVersion = new lambda.Version(
      this,
      'question-service-lambda-version',
      {
        lambda: userServiceLambda,
        description: `Generated on: ${new Date().toISOString()}`,
      }
    );

    const questionAlias = new lambda.Alias(
      this,
      'question-service-lambda-alias',
      {
        aliasName: 'live',
        version: questionLambdaVersion,
      }
    );

    const questionResource = apiGateway.root.addResource('questions');
    questionResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(questionServiceLambda, { proxy: true })
    );
    questionResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(questionServiceLambda, { proxy: true })
    );
    questionResource.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(
        questionServiceLambda
      ),
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.NONE,
        apiKeyRequired: false,
      },
      anyMethod: true,
    });
  }
}

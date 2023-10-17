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

export class DeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Your code here
    const userServiceRole = new iam.Role(this, 'UserServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Role that manages User Service Lambda',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      partitionKey: { name: 'user_id', type: dynamodb.AttributeType.STRING },
      tableName: 'users',
    });
    const bucket = Bucket.fromBucketArn(this, 'Bucket', 'arn:aws:s3:::aws-cdk-lambda');
    const userServiceLambda = new lambda.Function(this, 'UserService', {
      code: lambda.Code.fromBucket(bucket, 'user-service.zip'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      role: userServiceRole,
      environment: {
        USERS_TABLE: usersTable.tableName,
      },
    });

    usersTable.grantReadWriteData(userServiceRole);

    // const apigatewayRole = new iam.Role(this, 'ApiGatewayRole', {
    //   assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
    //   description: 'Role that manages API Gateway',
    //   inlinePolicies: {
    //     'CloudwatchLogsPolicy': new iam.PolicyDocument({
    //       statements: [
    //         new iam.PolicyStatement({
    //           effect: iam.Effect.ALLOW,
    //           actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
    //           resources: ['arn:aws:logs:*:*:*'],
    //         }),
    //       ],
    //     }),
    //   }
    // });

    const apiGateway = new apigateway.RestApi(this, 'BackendServicesApi', {
      restApiName: 'Backend Services',
      description: 'This api gateway routes requests to the respective services.',
      cloudWatchRole: true,
      deployOptions: {
        stageName: 'dev',
        accessLogDestination: new apigateway.LogGroupLogDestination(new cdk.aws_logs.LogGroup(this, 'ApiGatewayAccessLogGroup')),
        accessLogFormat: apigateway.AccessLogFormat.clf(),
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      endpointTypes : [apigateway.EndpointType.REGIONAL],
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

    new cdk.CfnOutput(this, 'apiUrl', {value: apiGateway.url});

    // Create Resource
    // Configure as proxy resource
    // Enable API Gateway CORS
    // const usersResource = apiGateway.root.addResource('users');
    // usersResource.addMethod('ANY',
    //   new apigateway.LambdaIntegration(userServiceLambda, {proxy: true})
    // );
    const userResource = apiGateway.root.addResource('users');
    userResource.addMethod('GET', new apigateway.LambdaIntegration(userServiceLambda, {proxy: true}));
    userResource.addMethod('POST', new apigateway.LambdaIntegration(userServiceLambda, {proxy: true}));
    userResource.addProxy({
      defaultIntegration: new apigateway.LambdaIntegration(userServiceLambda),
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.NONE,
        apiKeyRequired: false,
      },
      anyMethod: true
    });

    // const questionServiceRole = new iam.Role(this, 'questionServiceRole', {
    //   assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    //   description: 'Role that manages User Service Lambda',
    //   managedPolicies: [
    //     iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    //   ],
    // });

    // const questionsTable = new dynamodb.Table(this, 'QuestionsTable', {
    //   partitionKey: { name: 'user_id', type: dynamodb.AttributeType.STRING },
    //   tableName: 'questions',
    // });
    // const questionServiceLambda = new lambda.Function(this, 'questionService', {
    //   code: lambda.Code.fromBucket(bucket, 'question-service.zip'),
    //   handler: 'index.handler',
    //   runtime: lambda.Runtime.NODEJS_18_X,
    //   role: questionServiceRole,
    //   environment: {
    //     USERS_TABLE: usersTable.tableName,
    //   },
    // });

    // usersTable.grantReadWriteData(questionServiceRole);
  }

}

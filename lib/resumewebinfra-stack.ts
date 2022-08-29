import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import * as policydoc from '../policy/ddbpolicy.json';

export class ResumewebinfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const policycustom = iam.PolicyDocument.fromJson(policydoc);
    const ddlambdaPolicy = new iam.Policy(this, 'DDLambdaPolicy', {
      document: policycustom,
    });

    const lambdaRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Lambda role to interact with DynamoDb',
    });
    lambdaRole.attachInlinePolicy(ddlambdaPolicy);

    const lambda_dd = new lambda.Function(this, 'DDinteract Handler', {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'ddbinteract.lambda_handler',
      role: lambdaRole
    });

    const api = new apigw.LambdaRestApi(this, 'ddoperations', {
      handler: lambda_dd,
      proxy: false,
    });

    const items = api.root.addResource('ddmanager', { 
      defaultCorsPreflightOptions: {
        statusCode: 200,
        allowOrigins: Cors.ALL_ORIGINS
      }
    });

    const methodResponse: apigw.MethodResponse = {
      statusCode: "200",
      responseParameters: {
        'method.response.header.Access-Control-Allow-Origin': true
      }
    }

    const integrationResponse: apigw.IntegrationResponse = {
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Origin': "'*'"
      }
    };

    const LIntegration = new apigw.LambdaIntegration(lambda_dd, {
      allowTestInvoke: true,
      proxy: false,
      integrationResponses: [integrationResponse]
    });

    items.addMethod('POST',LIntegration, {
      methodResponses: [methodResponse]
    });
  }
}

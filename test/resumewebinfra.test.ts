import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as Resumewebinfra from '../lib/resumewebinfra-stack';

test('Lambda handler created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Resumewebinfra.ResumewebinfraStack(app, 'MyTestStack');
  // THEN

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::Lambda::Function', {
    Handler: 'ddbinteract.lambda_handler',
  });
});

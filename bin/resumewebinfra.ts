#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ResumewebinfraStack } from '../lib/resumewebinfra-stack';

const app = new cdk.App();
new ResumewebinfraStack(app, 'ResumewebinfraStack');

#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { CdkStack } from '../lib/cdk-stack';

const env = {region: "us-east-1", account: "576483741303"}
const app = new cdk.App();
new CdkStack(app, 'CdkStack', {env: env});

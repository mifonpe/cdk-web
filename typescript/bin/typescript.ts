#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { TypescriptStack } from '../lib/typescript-stack';

const app = new cdk.App();
new TypescriptStack(app, 'TypescriptStack');

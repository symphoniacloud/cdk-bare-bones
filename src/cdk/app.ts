#!/usr/bin/env node
import 'source-map-support/register';
import {App, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {createStackProps} from "./initSupport";

class AppStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);
    }
}

const app = new App();
new AppStack(app, 'AppStack', createStackProps(app, 'app-stack'));

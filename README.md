# CDK bare-bones app for TypeScript

An opinionated base project template for any TypeScript app using CDK for deployment to AWS.

<!-- TOC -->
* [CDK bare-bones app for TypeScript](#cdk-bare-bones-app-for-typescript)
  * [Introduction](#introduction)
  * [Other templates](#other-templates)
  * [Prerequisites](#prerequisites)
  * [Usage](#usage)
  * [Extending](#extending)
  * [Design Decisions / Motivation](#design-decisions--motivation)
    * [package.json](#packagejson)
    * [tsconfig](#tsconfig)
    * [Directory layout](#directory-layout)
    * [CDK code](#cdk-code)
    * [cdk.json](#cdkjson)
  * [Appendix](#appendix)
    * [AWS Profile](#aws-profile)
    * [Bootstrapped account](#bootstrapped-account)
    * [CDK Bootstrapping with this project](#cdk-bootstrapping-with-this-project)
    * [Node setup](#node-setup)
<!-- TOC -->

## Introduction

The AWS Cloud Development Kit (CDK) is a tool to help with deploying applications to AWS.
From [one of my articles](https://blog.symphonia.io/posts/2022-06-07_cdk_good_bad_scary): 

> CDK has become, in its short history, a very popular infrastructure-as-code tool. It's not too surprising why - it allows engineers to use richer programming languages to define infrastructure, rather than having to use JSON or YAML. With richer languages comes better tooling, better abstractions, and more.

While CDK is very powerful, it requires a fair amount of "ceremony" to get up and running. This is especially true when using CDK with TypeScript, which itself comes with an assortment of metadata files.

While there are other various tools and templates available for CDK apps (including [the bundled tooling](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html#typescript-newproject)), this project is my (opinionated) take on a "bare-bones" project setup.

You can you use this template repo as the base for your own TypeScript + CDK applications.

## Other templates

The name of this project says "bare-bones", and I mean it! There's no testing, deployment automation ("CD"), no actual resources, no source code.

If you'd like an example with more functionality I also provide the following template projects:

> **TODO** - I wrote these larger examples **BEFORE** this bare-bones project, and I still need to update them to use the same choices I've made in this project

* [Coffee Store V2](https://github.com/symphoniacloud/coffee-store-v2) - Adds a Lambda Function resource; source code + build for the Lambda Function; unit + in-cloud integration tests
* [Coffee Store Web Basic](https://github.com/symphoniacloud/coffee-store-web) - Website hosting on AWS with CloudFront and S3
* [Coffee Store Web Full](https://github.com/symphoniacloud/coffee-store-web-demo) - A further extension of _Coffee Store Web Basic_ that is a real working demo of a production-ready website project, including TLS certificates, DNS hosting, Github Actions Workflows, multiple CDK environments (prod vs test vs dev)

## Prerequisites

To use this project your terminal must be setup correctly for the correct AWS acount and region, and your account and region in AWS must be bootstrapped for CDK. See [the appendix](#appendix) for more details if you need help setting either of these up.

Further, Node and NPM should be correctly setup. This project currently assumes you are using Node 16, although you can likely change that for your own Node version if you're using something different, as long as it is [supported by CDK](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html). If your terminal isn't already configured for Node see [the associated appendix](#node-setup) later.

## Usage

> The terminal examples below assume a Bash / Zsh shell, or equivalent, with the leading `$` signifiying the terminal prompt. If you are using Windows you will need to adjust these commands if using a different type of terminal. 

### Deploy

To deploy this application to AWS for the first time, run the following:

```shell
$ npm install && npm run deploy
```

If successful, the end result will look something like this:

```shell
✨  Deployment time: 18.19s

Stack ARN:
arn:aws:cloudformation:us-east-1:123456789012:stack/app-stack/12345678-1234-1234-1234-123456789ab

✨  Total time: 20.71s
```

The deployed application is the smallest possible CDK app - the only deployed resource is some CDK Metadata.

> Once you've run `npm install` once in the directory you won't need to again

### Deploy with non-default stack name, and other parameters

In situations where you may deploy the same app multiple times with different names to the same AWS account you will
need to override the default stack name. This is common, for example, for development accounts.

To do this you can run the following:

```shell
$ npm run deploy -- --context stackName=my-app-stack
...
 ✅  AppStack (my-app-stack)

✨  Deployment time: 22.64s

Stack ARN:
arn:aws:cloudformation:us-east-1:123456789012:stack/my-app-stack/12345678-1234-1234-1234-123456789ab

✨  Total time: 25.23s
```

You can specify other parameters in the same way, e.g. to use [hotswap deployment](https://docs.aws.amazon.com/cdk/v2/guide/cli.html#cli-deploy) you can run the following:

```shell
$ npm run deploy -- --hotswap
...
⚠️ The --hotswap flag deliberately introduces CloudFormation drift to speed up deployments
⚠️ It should only be used for development - never use it for your production Stacks!
AppStack (app-stack): deploying...
```

### Teardown

To tear down the stack, run the following. **IMPORTANT** - if you haven't made any changes to the project this will delete
the default stack (`app-stack`) in your Account + Region.

```shell
$ npm run cdk-destroy
...
Are you sure you want to delete: AppStack (y/n)? y
AppStack (app-stack): destroying...

 ✅  AppStack (app-stack): destroyed
```

If you want to teardown a stack with name that's not the default, you can add `-- --context stackName=my-app-stack`, the same as with `deploy`.

### Other CDK commands

Another command in _package.json_ is `cdk-diff`, which runs just like `deploy` and `cdk-destroy` above.

You can also run the command `cdk-command`, and set the `command` flag to any valid [cdk CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html) command, e.g. the following is exactly the same as running `cdk deploy` with a custom stack name:

```shell
$ npm run cdk-command --command=deploy -- --context stackName=my-app-stack
```

The point of using `npm run cdk-command --command=deploy` vs `npx cdk command` is to set to the cdk output directory in a consistent way.

## Extending

To start with you might want to create your own Github repository based on using this one as a template. See Github's instructions [here](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) for creating from a template.

Since this is a "bare-bones" template you will need to extend it for your own needs. A few ideas to kick you off are as follows:

* The entrypoint for your CDK deployment is in [_App.ts_](src/cdk/App.ts) .
  * You will likely want to rename the `AppStack` class, the ID of the instantiated `AppStack`, and also change the default stack name (`app-stack`)
  * You should start adding your resources to this file too
* The "stack properties" in this template are just the environment and stack name, but you will likely want to extend those too.
* Consider adding a deployment script to the repo if you want to be able to deploy to different stack names in the same AWS account - this template always defaults the stack name.

For more concrete ideas, see the [extensions to this project](#other-templates) that I listed earlier.

## Design Decisions / Motivation

As I've mentioned, this is my opinionated take on a starting point for a CDK app, and it deviates from the [standard tooling](https://docs.aws.amazon.com/cdk/v2/guide/work-with-cdk-typescript.html#typescript-newproject) and documentation from AWS. Here are a few places it changes from running `npx cdk init app --language typescript`, and why:

### package.json

The CDK CLI `init` version has more dependencies and included scripts than this project. As I've mentioned already this project is deliberately bare-bones, solely providing enough for you to deploy a CDK application.

### tsconfig

The CDK CLI `init` version has a lengthy _tsconfig.json_ file - my version is much shorter, and largely
defers to the recommended configuration from the `@tsconfig/...` library.

### Directory layout

All source code that is committed to the repo is in the _/src_ directory, and any generated code is somewhere under _build_. So my template puts all CDK source code under _/src/cdk_ (rather than _/bin_ **and** _/lib_ from the CDK CLI tooling) and the CDK output under _/build/cdk.out_, rather than _/cdk.out_.

Further my current feeling is that CDK source code and application source code are best **separated**, rather than combined into one tree, so in my own apps I typically have a _/src/app_, or equivalent, as a peer of _/src/cdk_.

### CDK code

In the CDK CLI `init` version you get both a top-level Node script under _/bin_, and a file for the Stack class under _/lib_. I think separating these two concepts is (usually) unnecessarily complicated, at least to get started, and so in my version they are combined. If I cared about unit-testing for my top-level stack class in a particular app I would introduce such a separation.

Further I **always** define the _Environment_ (AWS Account + region) for my stack. This will cause problems if the CDK launcher is run without an AWS environment, but I have found in my usage of CDK that I always actually do want an environment. In theory you can run without an AWS environment, but I've never found that particularly useful.

My reasoning for always setting the _Environment_ is that I assume that pretty much the sole usage of the CDK code is when running `cdk deploy` / `cdk watch`, and occasionally `cdk diff` or `cdk destroy` - in other words commands that actually interact with your AWS account in the cloud. I've never found it particularly useful (for example) to just run `cdk synth` and use the generated CloudFormation separately.

### cdk.json

I think the _cdk.json_ file generated by the CLI is far too complicated. For example I think for a new application it makes much more sense to the use the default settings for `context`.

I think that `cdk watch` is useful, however I don't build my CDK apps the way that the CDK CLI expects me to, so the `watch` property from the default `init` is also not helpful for me.

## Appendix

### AWS Profile

You must have a valid AWS profile pointing to your desired AWS account and region set up in your terminal environment.

To check your profile, run the following:

> NB: this assumes you have the [AWS CLI installed in your terminal](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

```shell
$ aws sts get-caller-identity --query 'Account' --output text
123456789012

$ aws configure get region
us-east-1
```

In this example my profile is targeting AWS Account ID `123456789012` in the `us-east-1` region.

If your profile is **NOT** setup correctly, see [the documentation here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html). 

### Bootstrapped account

The account must also have been bootstrapped for CDK. If your account is using the default bootstrap configuration it will be deployed to CloudFormation with the stack name `CDKToolkit`.

In case you are uncertain then you can check from the terminal whether CDK has been bootstrapped: 

```shell
$ aws cloudformation describe-stacks --stack-name CDKToolkit
```

This will return the stack details, or an error if the stack doesn't exist.

If your account isn't Bootstrapped for CDK see the following section.

### CDK Bootstrapping with this project

If your AWS account is **not** already bootstrapped for CDK (see the previous section), you can use this project to perform bootstrapping.

> **IMPORTANT:** - CDK Bootstrapping has security implications, and should not be performed on sensitive accounts without considering the ramifications. For more details about CDK Bootstrapping, see [the AWS Documentation](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html).

From the documentation:

> Deploying AWS CDK apps into an AWS environment (a combination of an AWS account and region) requires that you provision resources the AWS CDK needs to perform the deployment. These resources include an Amazon S3 bucket for storing files and IAM roles that grant permissions needed to perform deployments. The process of provisioning these initial resources is called bootstrapping.

CDK Bootstrapping can be highly customized, but to use the default settings, using the version of CDK in this project, you can run the following (**NOTE** - this will use the AWS account and region setup in your profile, see [_AWS Profile_](#aws-profile) above.)

```shell
$ npm install && npx cdk bootstrap --output build/cdk.out 
```

This will take a couple of minutes, but the output should look something like this once complete:

```shell
 ✅  Environment aws://123456789012/us-east-1 bootstrapped.
```

### Node setup

Since this is a TypeScript Node application you need to have Node available in your terminal environment.

There are various ways of managing Node, but here is my current preferred method:

1. [Install NVM](https://github.com/nvm-sh/nvm#installing-and-updating) in my user-global environment
2. Use [NVM's shell integration](https://github.com/nvm-sh/nvm#deeper-shell-integration) to automatically load the correct version of Node according to the [.nvmrc](.nvmrc) file
# f-i-coding-challenge


## Getting started

Clone the repository including submodules:

```sh
git clone --recurse-submodules https://github.com/iOSonntag/f-i-coding-challenge.git
```

Now inside the repository root run the following:

```sh
pnpm i
```

This will install all dependencies for the monorepo.
  
> **Still using npm?**  
> *Get pnpm via* `npm install -g pnpm`  
> *More info on pnpm [here](https://pnpm.io/).*

Next we need to install the [sst](https://sst.dev/) cloud providers using:

```sh
pnpm exec sst install
```

This will essentially install the [pulumi AWS providers](https://www.pulumi.com/registry/packages/aws/) in order for sst to
communicate with the AWS cloud and setup our resources.

### Local development

To start local development enter the following shell command. On the first run
you might need to specify a name for the local stage:

```sh
pnpm dev
```

> **Note**  
> *You need to have valid AWS credentials set up on your machine. You can do
> this by running* `aws configure` *and then follow the instructions.*

The first deployment will take a while, but after that you can make changes to
the code and see the changes in real time. Both infrastructural changes and code
changes.

The deployment will return an API Gateway URL which will be your endpoint for
local development. sst will route the requests from the API Gateway service to your
lambda functions and then to your IDE execute the code locally and pass back the
response to the aws lambda function and finally to the API Gateway as a
response.  
This ensures that your local development environment is as close as possible to
the real AWS environment.

> **Good to know**  
> *You can even use the AWS SDK in your code and it will work as expected. For
> example you can use the AWS SDK to access DynamoDB or S3 in the local stage.*


## Infrastructure and deployment


<img src="docs/infrastructure.png?raw=true"> 


## Project structure

The project is structured as a monorepo with the following parts:

### Cloud infrastructure (IaC)

The `infra` directory contains the infrastructure as code and will be deployed
in combination with the settings in the `sst.config.ts` file using the sst
framework. During deployment it will create API Gateway Lambda functions using
the source code from the `packages/api` directory.

### @app/api

The `packages/api` directory contains the source code for the API. To perform
business logic it uses the `packages/core` package.

### @app/core

The `packages/core` directory contains the business logic.

### @iosonntag/tslib-sst

The `packages/tslib-sst` directory contains the source code for my own open
source library [tslib-sst](https://github.com/iOSonntag/tslib-sst). This library
is not published on npm that is why it is included as a submodule in this
repository.

## Some notes on tslib-sst

Using [tslib-sst](https://github.com/iOSonntag/tslib-sst) adds several benefits to the api with minimal effort. That includes (but not limited to):

- better api responses
- log flushing to minimize AWS CloudWatch costs
- more robust api error handling
- AWS services convenient methods
- less bloated api functions

But it also adds another layer of complexity for a first reader. That is why I
created a copy of the api route `POST /articles` that does not use tslib-sst.
You can find these two routes here:

- `packages/api/src/routes/articles/POST.ts` (with `tslib-sst`)
- `packages/api/src/routes/articles/POST.vanilla.ts` (without `tslib-sst`)

This way you can see
the difference between the two approaches and get a sense of the underlying benefits.



## Some notes on CloudWatch logs

This project uses the `tslib-sst` for logging. This means that the logs are not
emitted immediately but are buffered and flushed in a batch if an issue occurs.
This is done to minimize the costs of CloudWatch logs. If this is not the
desired behavior you can opt out of this feature by setting the `alwaysEmitLogs`
setting to `true` in the `ApiHubConfig` located at `packages/api/src/_config/api-hub-config.ts`.




## Further improvements

- implement article availability (amount in stock)
- implement price change during checkout checks
- use proper authentication for endpoints (admin for create article and user
  based / terminal based auth for default endpoints)
- the package `packages/core` is meant to be fully covered by tests. This is not
  the case yet, mainly because it directly accesses DynamoDB. This should be
  mocked and tested properly.




Within this repository you can find two folders containing almost the same solutions for the given coding challenge. The only difference is that the `with-tslib-sst` folder contains a solution including my own open source aws sst library ([tslib-sst](https://github.com/iOSonntag/tslib-sst)) where as the `vanilla` folder contains a solution that compiles without my own library.

> *For more information please visit the README.md files in the sub directories.*

## Why create two solutions?

Using [tslib-sst](https://github.com/iOSonntag/tslib-sst) adds several benefits to the api with minimal effort. That includes (but not limited to):

- better api responses
- log flushing to minimize AWS CloudWatch costs
- more robust api error handling
- AWS services convenient methods
- less bloated api functions

But it also adds another layer of complexity for a first reader. That is why I created the `vanilla` version which is the recommended starting point.

## Some notes to the underlying repository structure

Both solutions / versions assume that they live in the root of the repository - both for documentation and developer commands.

The main difference becomes visible in the `packages/api` directory.

**Also note:**  
The ci / cd setup deploys the `with-tslib-sst` version by default. To deploy the `vanilla` version instead use the commit message flag `[vanilla]`.

E.g.
```
feat: some awesome feature [ci][vanilla]
```

**And one last important note:**

Many files are hidden using the `.vscode/settings.json` file. This is to keep
the repository clean and to avoid confusion. If you want to see all files, just
remove the `files.exclude` section from the `settings.json` file or use the
following plugin for that:

> I use the VSCode plugin [Explorer
> Exclude](https://marketplace.visualstudio.com/items?itemName=PeterSchmalfeldt.explorer-exclude).
> This allows you to toggle the hidden files with a single command:
> `> ExplorerExclude: Toggle Visibility`.
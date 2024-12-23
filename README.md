# f-i-coding-challenge

![Dynamic JSON
Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2FiOSonntag%2Ff-i-coding-challenge%2Fmain%2Fpackage.json&query=%24.version&label=version)
![Static Badge](https://img.shields.io/badge/strict-d?label=TypeScript)
[![build](https://github.com/iOSonntag/f-i-coding-challenge/actions/workflows/branch-push.yaml/badge.svg?branch=main)](https://github.com/iOSonntag/f-i-coding-challenge/actions/workflows/branch-push.yaml)


This is the repository contains the solution for a coding challenge from a
company. The task was to create a RESTful API for a fictional self checkout system.

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

The infrastructure and api code will be deployed using GitHub Actions in 3
seperate stages (`prod`, `stage`, `dev`). The deployment is triggered by a push
to the branches `main`, `stage` and `dev` respectively if the commit message
contains the `[ci]` flag.

Example commit message:
```
feat: some awesome feature [ci]
```

After that the GitHub Actions will run the tests, build the code and deploys
infrastructure and api code to the AWS cloud.

An overview of the infrastructure can be seen in the following diagram:

<img src="docs/infrastructure.png?raw=true"> 


## Project structure


> **Note**  
> *Many files are hidden using the* `.vscode/settings.json` *file. This is to keep
> the repository clean and to avoid confusion. If you want to see all files, just
> remove the* `files.exclude` *section from the* `settings.json` *file or use the
> following plugin:*
>  
> [VSCode plugin Explorer
> Exclude](https://marketplace.visualstudio.com/items?itemName=PeterSchmalfeldt.explorer-exclude)  
> *This allows you to toggle the hidden files with a single command:*  
> `> ExplorerExclude: Toggle Visibility`.

The project is structured as a monorepo with the following parts:

### Cloud infrastructure (IaC)

The `infra` directory contains the infrastructure as code and will be deployed
in combination with the settings in the `sst.config.ts` file using the sst
framework. During deployment it will create API Gateway Lambda functions using
the source code from the `packages/api` directory.

### API

The `packages/api` directory contains the source code for the API. To perform
business logic it uses the `packages/core` package.

### Core 

The `packages/core` directory contains the business logic.

### Custom sst library

The `packages/tslib-sst` directory contains the source code of my own open
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

## Monitor the API

To monitor the API you can use the [sst console](https://console.sst.dev/). 

> **Note**  
> *In order to use the sst console for cloud evironments (not local) you need to
> have an sst account and that account needs to be linked to the AWS account
> that the sst cloud stack is deployed to. More on that can be found [here](https://sst.dev/docs/console/).*


## Some notes on the task specifications

To follow the RESTful API conventions I have changed a few routes:

- `POST /order` changed to `POST /orders`
- `GET /order/{id}` changed to `GET /orders/{id}`
- `PUT /order/{id}` changed to `PUT /orders/{id}/status`
- `POST /payment` changed to `POST /payments`
- `GET /payment/{id}` changed to `GET /payments/{id}`

I also added another route for convenience:

- `POST /articles/insert-test-data` to insert test data into the database

**Also note:**

The data models are far from perfect. There are many parts missing that a real
world application would need to have. That includes but is not limited to:

- article images
- VAT calculation
- article availability (amount in stock)
- price change during checkout checks
- discounts
- etc.

Additionally one important part is missing. There is no authentication for the
api. This is a big issue for a real world application. The api should be secured
using a proper authentication method. This could be done using AWS Cognito, api keys or
a custom authentication method. Especially creating articles should be secured
in a way that no enduser terminal can access this endpoint.

## Further improvements

- The package `packages/core` is meant to be fully covered by tests. This is not
  the case yet, mainly because it directly accesses DynamoDB. This should be
  mocked and tested properly.
- The terminal id is set during order creation but is not really used anywhere.
  It could be used to ensure that the terminal that created the order is the one
  that can change the status of the order. Or it could be used to filter orders
  by terminal. Or any other use case that would require the terminal id.
- The endpoint `PUT /orders/{id}/status` currently contains no checks. It would
  be great if the status could not be changed from `PAID` or `CANCELED` to
  `PENDING`. Also I think it would be better to eliminate this endpoint all
  together and let the payment provider webhooks or payment reciept validation
  endpoints change the status of the order.
- The payment provider service could be abstracted into a generic payment provider
  service that could be used with different payment providers. This would make
  it easier to switch payment providers in the future.

## Endpoint specifications

The endpoint documentation can be found at [`docs/ENDPOINTS.md`](docs/ENDPOINTS.md).


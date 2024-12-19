# f-i-coding-challenge





### Local development

To start local development enter the following shell command. On the first run
you might need to specify a name for the local stage:

```shell
pnpm dev
```

> **Note**
> *You need to have valid AWS credentials set up on your machine. You can do this by running `aws configure` and following the instructions.*


## Further improvements

- implement article availability (amount in stock)
- implement price change during checkout checks
- use proper authentication for endpoints (admin for create article and user
  based / terminal based auth for default endpoints)
- the package `packages/core` is meant to be fully covered by tests. This is not
  the case yet, mainly because it directly accesses DynamoDB. This should be
  mocked and tested properly.
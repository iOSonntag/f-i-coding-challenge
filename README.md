# f-i-coding-challenge


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
# twitch-client

... well, mostly a stripped down chat client for now.

## Why?
There's a few good libraries out there already for this.
Some are functional but not tested.
Some are tested but with bad authentication.
Some just have no types.

This package should solve most of these issues.
Using modern syntax, typescript and cross platform dependencies
paired with vigorous TDD, it should be a safe option for the perfectionists
out there.

If you find something that you would like to contribute with, please do so!


## Local development quickstart:

- Install Yarn https://yarnpkg.com/lang/en/docs/instal
- have Node (10+)
- check out the code
- run `yarn` in the project root

## Other commands
- `yarn test`: to run tests
- `yarn test:coverage`: to run the coverage

## Playing with the library

### Another typescript project
Use it in another project by either directly importing src/index.ts

### A non typescript project
1. run `yarn build`
2. import `dist/index.js` from your js project

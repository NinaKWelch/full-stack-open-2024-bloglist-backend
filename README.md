# full-stack-open-2024-bloglist-backend

## Blog List backend application

https://enigmatic-plains-03238-5cf357ba415b.herokuapp.com

### Tests

Each test file is executed in its own process (see Test execution model in the [documentation](https://nodejs.org/api/test.html#test-runner-execution-model)). The consequence of this is that different test files are executed at the same time. Since the tests share the same database, simultaneous execution may cause problems, which can be avoided by executing the tests with the option `--test-concurrency=1`, i.e. defining them to be executed sequentially.


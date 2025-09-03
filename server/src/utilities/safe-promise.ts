export default (promise: Promise<unknown>) => promise
  .then((data) => [null, data])
  .catch((err) => [err]);

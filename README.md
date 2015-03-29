# lambda-logs

CloudWatch logs of describe in the stream for AWS Lambda.

## Install

```
npm install --save lambda-logs
```

## Example

```js
import LambdaLogsStream from 'lambda-logs'
var log = new LambdaLogsStream();
var stream = log.describe('test1427026173263', (new Date).getTime());
stream.onValue((message) => {
  switch (message.type) {
    case 'start':
      assert(message.requestId === '4ff3bd57-d08c-11e4-af0a-498fc7b5744a');
      break;
    case 'message':
      assert(message.time === new Date('2015-03-22T12:09:53.786Z').getTime());
      assert(message.requestId === '4ff3bd57-d08c-11e4-af0a-498fc7b5744a');
      assert(message.text === 'hogehoge');
      break;
    case 'end':
      assert(message.requestId === '4ff3bd57-d08c-11e4-af0a-498fc7b5744a');
      break;
    case 'report':
      assert(message.requestId === '4ff3bd57-d08c-11e4-af0a-498fc7b5744a');
      assert(message.duration === 11320.01);
      assert(message.billedDulation === 11400.00);
      assert(message.memorySize === 128);
      assert(message.memoryUsed === 17);
      stream.stop();
      done();
      break;
    default:
      throw new Error('undefined type.');
      break;
  }
});
stream.onError((err) => {
  stream.stop();
  throw err;
});
```


## License

MIT

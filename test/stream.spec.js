// LICENSE : MIT
"use strict";
// imports
import assert from 'power-assert'
import support from 'source-map-support'
import fake from 'fakeaws'
import proxyquire from 'proxyquire'
// proxy
var LambdaLogsStream = proxyquire('../lib/stream', {'aws-sdk': fake.AWS})
// initialize
support.install();
// test
describe("LambdaLogsStream: ", () => {
  beforeEach(function() {
    fake.reflash();
  });

  it("should success response", (done) => {
    fake.mockResponse('cloudwatchlogs.describeLogStreams', {
      logStreams: [{
        logStreamName: "test-stream"
      }]
    });
    fake.mockResponse('cloudwatchlogs.getLogEvents', {
      events: [
        {
          ingestionTime: 1396035394997,
          message: 'START RequestId: 4ff3bd57-d08c-11e4-af0a-498fc7b5744a\n',
          timestamp: 1396035394997
        },
        {
          ingestionTime: 1396035394997,
          message: '2015-03-22T12:09:53.786Z\t4ff3bd57-d08c-11e4-af0a-498fc7b5744a\thogehoge',
          timestamp: 1396035394997
        },
        {
          ingestionTime: 1396035394997,
          message: 'END RequestId: 4ff3bd57-d08c-11e4-af0a-498fc7b5744a\n',
          timestamp: 1396035394997
        },
        {
          ingestionTime: 1396035394997,
          message: 'REPORT RequestId: 4ff3bd57-d08c-11e4-af0a-498fc7b5744a\tDuration: 11320.01 ms\tBilled Duration: 11400 ms \tMemory Size: 128 MB\tMax Memory Used: 17 MB\t\n',
          timestamp: 1396035394997
        }
      ]
    });

    var log = new LambdaLogsStream();
    var stream = log.describe('test1427026173263');
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
  });

  it("should multiple success response", (done) => {
    fake.mockResponse('cloudwatchlogs.describeLogStreams', {
      logStreams: [{
        logStreamName: "test-stream",
      }]
    });
    fake.mockResponse('cloudwatchlogs.describeLogStreams', {
      logStreams: [{
        logStreamName: "test-stream",
      }]
    });
    fake.mockResponse('cloudwatchlogs.getLogEvents', {
      events: [
        {
          ingestionTime: 1396035394997,
          message: 'START RequestId: 4ff3bd57-d08c-11e4-af0a-498fc7b5744a\n',
          timestamp: 1396035394997
        },
        {
          ingestionTime: 1396035394997,
          message: '2015-03-22T12:09:53.786Z\t4ff3bd57-d08c-11e4-af0a-498fc7b5744a\thogehoge',
          timestamp: 1396035394997
        }
      ]
    });
    fake.mockResponse('cloudwatchlogs.getLogEvents', {
      events: [
        {
          ingestionTime: 1396035394997,
          message: 'END RequestId: 4ff3bd57-d08c-11e4-af0a-498fc7b5744a\n',
          timestamp: 1396035394997
        },
        {
          ingestionTime: 1396035394997,
          message: 'REPORT RequestId: 4ff3bd57-d08c-11e4-af0a-498fc7b5744a\tDuration: 11320.01 ms\tBilled Duration: 11400 ms \tMemory Size: 128 MB\tMax Memory Used: 17 MB\t\n',
          timestamp: 1396035394997
        }
      ]
    });

    var log = new LambdaLogsStream();
    var stream = log.describe('test1427026173263');
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
  });

});
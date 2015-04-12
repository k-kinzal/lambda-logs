// LICENSE: MIT
"use strict";
// imports
import Promise from 'bluebird'
import AWS from 'aws-sdk'
import Bacon from 'baconjs'
import Scheduler from './scheduler.js'
import LambdaLogsMessage from './entities/message.js'
/**
 * CloudWatch logs of describe in the stream.
 */
export default class LambdaLogsStream {
  /**
   * Initialize LambdaLogsStream.
   */
  constructor() {
    this.logs = Promise.promisifyAll(new AWS.CloudWatchLogs());
  }

  /**
   * CloudWatch logs of describe in the stream.
   *
   * @param {String} functionName function name of AWS Lambda.
   * @param {Number} [startTime=null] to get the log after the specified time
   * @returns {Bacon.Bus} return a stream of LambdaLogs
   */
  describe(functionName, startTime = null) {
    // initialize
    var logs = this.logs;
    var logGroupName = '/aws/lambda/' + functionName;
    // generate scheduler
    var scheduler = new Scheduler(1000, function(index) {
      var params = {
        logGroupName: logGroupName
      };
      return logs.describeLogStreamsAsync(params);
    });
    // get log event
    var stream = scheduler.start().flatMap(Bacon.fromPromise).map(function(data) {
      return data.logStreams.map(function(logStream) {
        var params = {
          logGroupName: logGroupName,
          logStreamName: logStream.logStreamName,
          startTime: startTime
        };
        return logs.getLogEventsAsync(params);
      });
    })
    .flatMap(Bacon.fromArray)
    .flatMap(Bacon.fromPromise)
    // log event to event
    .map(function(logEvent) {
      return logEvent.events;
    })
    .flatMap(Bacon.fromArray)
    // event to message
    .map(function(event) {
      if (startTime < event.timestamp) {
        startTime = event.timestamp + 1;
      }
      return event.message.replace(/[\n\r\t]+$/, '');;
    })
    // message to message entity
    .map(function(message) {
      return new LambdaLogsMessage(message);
    })
    // return stream 
    stream.stop = function() { scheduler.stop() };
    return stream;
  }

}
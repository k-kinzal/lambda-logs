// LICENSE: MIT
"use strict";
/**
 * Log message entity.
 */
export default class LambdaLogsMessage {
  /**
   * Initialize entity.
   * @params {String} text for lambda log. 
   */
  constructor(message) {
    if (/^START RequestId/.test(message)) {
      var match = message.match(/^START RequestId: (.*?)$/);
      this.type      = 'start';
      this.message   = message;
      this.requestId = match[1];
      
    } else if (/^END RequestId/.test(message)) {
      var match = message.match(/^END RequestId: (.*?)$/);
      this.type      = 'end';
      this.message   = message;
      this.requestId = match[1];
      
    } else if (/^REPORT RequestId/.test(message)) {
      var match = message.match(/^REPORT RequestId: (.*?)\tDuration: (.*?) ms\tBilled Duration: (.*?) ms \tMemory Size: (.*?) MB\tMax Memory Used: (.*?) MB$/);
      this.type           = 'report';
      this.message        = message;
      this.requestId      = match[1];
      this.duration       = parseFloat(match[2]);
      this.billedDulation = parseFloat(match[3]);
      this.memorySize     = parseInt(match[4]);
      this.memoryUsed     = parseInt(match[5]);
      
    } else {
      var match = message.match(/^(.*?)\t(.*?)\t([\s\S]*?)$/);
      this.type = 'message';
      this.message   = message;
      this.time      = new Date(match[1]).getTime();
      this.requestId = match[2];
      this.text      = match[3];
    }
  }

}
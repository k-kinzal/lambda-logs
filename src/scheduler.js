/* @flow */
"use strict";
// imports
import Bacon from 'baconjs'
// privates
var privateMap = new WeakMap();
function privates(self) {
  let p = privateMap.get(self);
  if (!p) {
    p = {};
    privateMap.set(self, p);
  }
  return p;
}
/**
 * To push the value to stream by schedule.
 * @class Scheduler
 */
export default class Scheduler {
  /**
   * Initialize Scheduler with interval and callback.
   * @param {Number} interval Interval to schedule
   & @param {Function} callback
   */
  constructor(interval, callback) {
    privates(this).interval = interval;
    privates(this).callback = callback;
  }

  /**
   * Start pushing to the stream.
   * @return {Bacon.Bus} the stream
   */
  start() {
    if (!!privates(this).interbalId) {
      this.stop();
    }

    let bus = new Bacon.Bus();
    let callback = privates(this).callback;
    var index = 0;
    privates(this).interbalId = setInterval(function() {
      bus.push(callback(index++));

    }, privates(this).interval);

    return bus;
  }

  /**
   * Stop pushing to the stream.
   */
  stop() {
    if (!privates(this).interbalId) {
      return;
    }

    clearInterval(privates(this).interbalId);
  }

}

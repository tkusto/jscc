'use strict';

/**
 * Parser result
 * @module lib/parser/combinator/result
 */
module.exports = Result;

const freeze = Object.freeze;
const EMPTY = Symbol('Result.Empty');

/**
 * Parser result
 * @constructor
 * @param {*} value - parser result
 * @param {Number} end - position in input token stream after parser result
 */
function Result(value, end) {
  if (!(this instanceof Result)) {
    return new Result(value, end);
  }
  this.value = value;
  this.end = end;
  // make instance immutable
  freeze(this);
}

/**
 * Constructor for creating empty result
 * @function
 * @param {Number} end - the same as for [constructor]{@link Result}
 * @return {Result}
 */
Result.Empty = (end) => new Result(EMPTY, end);

/** @type {*} */
Result.prototype.value = null;

/** @type {Number} */
Result.prototype.end = NaN;

/**
 * @method
 * @return {Boolean}
 */
Result.prototype.isEmpty = function isEmpty() {
  return this.value === EMPTY;
};

/**
 * @method
 * @param {*} failValue - this value will be returned in case result is empty
 * @return {*}
 */
Result.prototype.maybe = function maybe(failValue) {
  return this.value === EMPTY? failValue: this.value;
};

'use strict';

const EMPTY = Symbol('Result.Empty');

/**
 * Parser result
 * @module lib/parser/combinator/result
 */
module.exports = Result;
module.exports.Empty = Result.bind(undefined, EMPTY);

const { create, freeze } = Object;

const ResultPrototype = {
  value: null,
  end: null,
  isEmpty: isEmpty,
  maybe: maybe
};

/**
 * Parser result
 * @constructor
 * @param {*} value - parser result
 * @param {Number} end - position in input token stream after parser result
 */
function Result(value, end) {
  const result = create(ResultPrototype);
  result.value = value;
  result.end = end;
  return freeze(result);
}

/**
 * @function
 * @return {Boolean}
 */
function isEmpty() {
  return this.value === EMPTY;
}

/**
 * @function
 * @param {*} failValue - this value will be returned in case result is empty
 * @return {*}
 */
function maybe(failValue) {
  return this.value === EMPTY? failValue: this.value;
}

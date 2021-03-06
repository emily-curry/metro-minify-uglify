/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *  strict-local
 * @format
 */

"use strict";

const uglify = require("uglify-es");

function noSourceMap(code) {
  let options =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return minify(code, undefined, options).code;
}

function withSourceMap(code, sourceMap, filename) {
  let options =
    arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const result = minify(code, sourceMap, options);
  const map = JSON.parse(result.map);

  map.sources = [filename];

  return { code: result.code, map };
}

function minify(inputCode, inputMap, options) {
  const result = uglify.minify(inputCode, {
    mangle: false,

    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true
    },

    sourceMap: {
      content: inputMap,
      includeSources: false
    },

    toplevel: false,
    compress: {
      // reduce_funcs inlines single-use function, which cause perf regressions.
      reduce_funcs: false
    }
  });

  if (result.error) {
    throw result.error;
  }

  return {
    code: result.code,
    map: result.map
  };
}

const metroMinifier = {
  noSourceMap,
  withSourceMap
};

module.exports = metroMinifier;

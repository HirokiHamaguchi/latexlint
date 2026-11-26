#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// <define:__LATEXLINT_DEFAULTS__>
var define_LATEXLINT_DEFAULTS_default;
var init_define_LATEXLINT_DEFAULTS = __esm({
  "<define:__LATEXLINT_DEFAULTS__>"() {
    define_LATEXLINT_DEFAULTS_default = { userDefinedRules: [], exceptions: [], LLCrefExceptions: ["line:", "prob:", "problem:"], disabledRules: ["LLBracketMissing", "LLCref", "LLSpaceJapanese", "LLT"] };
  }
});

// node_modules/ignore/index.js
var require_ignore = __commonJS({
  "node_modules/ignore/index.js"(exports2, module2) {
    init_define_LATEXLINT_DEFAULTS();
    function makeArray(subject) {
      return Array.isArray(subject) ? subject : [subject];
    }
    var UNDEFINED = void 0;
    var EMPTY = "";
    var SPACE = " ";
    var ESCAPE = "\\";
    var REGEX_TEST_BLANK_LINE = /^\s+$/;
    var REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/;
    var REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/;
    var REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/;
    var REGEX_SPLITALL_CRLF = /\r?\n/g;
    var REGEX_TEST_INVALID_PATH = /^\.{0,2}\/|^\.{1,2}$/;
    var REGEX_TEST_TRAILING_SLASH = /\/$/;
    var SLASH = "/";
    var TMP_KEY_IGNORE = "node-ignore";
    if (typeof Symbol !== "undefined") {
      TMP_KEY_IGNORE = /* @__PURE__ */ Symbol.for("node-ignore");
    }
    var KEY_IGNORE = TMP_KEY_IGNORE;
    var define = (object, key, value) => {
      Object.defineProperty(object, key, { value });
      return value;
    };
    var REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g;
    var RETURN_FALSE = () => false;
    var sanitizeRange = (range) => range.replace(
      REGEX_REGEXP_RANGE,
      (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0) ? match : EMPTY
    );
    var negateRange = (range) => range.startsWith("!") || range.startsWith("\\^") ? `^${range.slice(range[0] === "!" ? 1 : 2)}` : range;
    var cleanRangeBackSlash = (slashes) => {
      const { length } = slashes;
      return slashes.slice(0, length - length % 2);
    };
    var REPLACERS = [
      [
        // Remove BOM
        // TODO:
        // Other similar zero-width characters?
        /^\uFEFF/,
        () => EMPTY
      ],
      // > Trailing spaces are ignored unless they are quoted with backslash ("\")
      [
        // (a\ ) -> (a )
        // (a  ) -> (a)
        // (a ) -> (a)
        // (a \ ) -> (a  )
        /((?:\\\\)*?)(\\?\s+)$/,
        (_, m1, m2) => m1 + (m2.indexOf("\\") === 0 ? SPACE : EMPTY)
      ],
      // Replace (\ ) with ' '
      // (\ ) -> ' '
      // (\\ ) -> '\\ '
      // (\\\ ) -> '\\ '
      [
        /(\\+?)\s/g,
        (_, m1) => {
          const { length } = m1;
          return m1.slice(0, length - length % 2) + SPACE;
        }
      ],
      // Escape metacharacters
      // which is written down by users but means special for regular expressions.
      // > There are 12 characters with special meanings:
      // > - the backslash \,
      // > - the caret ^,
      // > - the dollar sign $,
      // > - the period or dot .,
      // > - the vertical bar or pipe symbol |,
      // > - the question mark ?,
      // > - the asterisk or star *,
      // > - the plus sign +,
      // > - the opening parenthesis (,
      // > - the closing parenthesis ),
      // > - and the opening square bracket [,
      // > - the opening curly brace {,
      // > These special characters are often called "metacharacters".
      [
        /[\\$.|*+(){^]/g,
        (match) => `\\${match}`
      ],
      [
        // > a question mark (?) matches a single character
        /(?!\\)\?/g,
        () => "[^/]"
      ],
      // leading slash
      [
        // > A leading slash matches the beginning of the pathname.
        // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
        // A leading slash matches the beginning of the pathname
        /^\//,
        () => "^"
      ],
      // replace special metacharacter slash after the leading slash
      [
        /\//g,
        () => "\\/"
      ],
      [
        // > A leading "**" followed by a slash means match in all directories.
        // > For example, "**/foo" matches file or directory "foo" anywhere,
        // > the same as pattern "foo".
        // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
        // >   under directory "foo".
        // Notice that the '*'s have been replaced as '\\*'
        /^\^*(?:\\\*\\\*\\\/)+/,
        // '**/foo' <-> 'foo'
        () => "^(?:.*\\/)?"
      ],
      // starting
      [
        // there will be no leading '/'
        //   (which has been replaced by section "leading slash")
        // If starts with '**', adding a '^' to the regular expression also works
        /^(?=[^^])/,
        function startingReplacer() {
          return !/\/(?!$)/.test(this) ? "(?:^|\\/)" : "^";
        }
      ],
      // two globstars
      [
        // Use lookahead assertions so that we could match more than one `'/**'`
        /\\\/\\\*\\\*(?=\\\/|$)/g,
        // Zero, one or several directories
        // should not use '*', or it will be replaced by the next replacer
        // Check if it is not the last `'/**'`
        (_, index, str) => index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+"
      ],
      // normal intermediate wildcards
      [
        // Never replace escaped '*'
        // ignore rule '\*' will match the path '*'
        // 'abc.*/' -> go
        // 'abc.*'  -> skip this rule,
        //    coz trailing single wildcard will be handed by [trailing wildcard]
        /(^|[^\\]+)(\\\*)+(?=.+)/g,
        // '*.js' matches '.js'
        // '*.js' doesn't match 'abc'
        (_, p1, p2) => {
          const unescaped = p2.replace(/\\\*/g, "[^\\/]*");
          return p1 + unescaped;
        }
      ],
      [
        // unescape, revert step 3 except for back slash
        // For example, if a user escape a '\\*',
        // after step 3, the result will be '\\\\\\*'
        /\\\\\\(?=[$.|*+(){^])/g,
        () => ESCAPE
      ],
      [
        // '\\\\' -> '\\'
        /\\\\/g,
        () => ESCAPE
      ],
      [
        // > The range notation, e.g. [a-zA-Z],
        // > can be used to match one of the characters in a range.
        // `\` is escaped by step 3
        /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
        (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}` : close === "]" ? endEscape.length % 2 === 0 ? `[${negateRange(sanitizeRange(range))}${endEscape}]` : "[]" : "[]"
      ],
      // ending
      [
        // 'js' will not match 'js.'
        // 'ab' will not match 'abc'
        /(?:[^*])$/,
        // WTF!
        // https://git-scm.com/docs/gitignore
        // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
        // which re-fixes #24, #38
        // > If there is a separator at the end of the pattern then the pattern
        // > will only match directories, otherwise the pattern can match both
        // > files and directories.
        // 'js*' will not match 'a.js'
        // 'js/' will not match 'a.js'
        // 'js' will match 'a.js' and 'a.js/'
        (match) => /\/$/.test(match) ? `${match}$` : `${match}(?=$|\\/$)`
      ]
    ];
    var REGEX_REPLACE_TRAILING_WILDCARD = /(^|\\\/)?\\\*$/;
    var MODE_IGNORE = "regex";
    var MODE_CHECK_IGNORE = "checkRegex";
    var UNDERSCORE = "_";
    var TRAILING_WILD_CARD_REPLACERS = {
      [MODE_IGNORE](_, p1) {
        const prefix = p1 ? `${p1}[^/]+` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      },
      [MODE_CHECK_IGNORE](_, p1) {
        const prefix = p1 ? `${p1}[^/]*` : "[^/]*";
        return `${prefix}(?=$|\\/$)`;
      }
    };
    var makeRegexPrefix = (pattern2) => REPLACERS.reduce(
      (prev, [matcher, replacer]) => prev.replace(matcher, replacer.bind(pattern2)),
      pattern2
    );
    var isString = (subject) => typeof subject === "string";
    var checkPattern = (pattern2) => pattern2 && isString(pattern2) && !REGEX_TEST_BLANK_LINE.test(pattern2) && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern2) && pattern2.indexOf("#") !== 0;
    var splitPattern = (pattern2) => pattern2.split(REGEX_SPLITALL_CRLF).filter(Boolean);
    var IgnoreRule = class {
      constructor(pattern2, mark, body, ignoreCase, negative, prefix) {
        this.pattern = pattern2;
        this.mark = mark;
        this.negative = negative;
        define(this, "body", body);
        define(this, "ignoreCase", ignoreCase);
        define(this, "regexPrefix", prefix);
      }
      get regex() {
        const key = UNDERSCORE + MODE_IGNORE;
        if (this[key]) {
          return this[key];
        }
        return this._make(MODE_IGNORE, key);
      }
      get checkRegex() {
        const key = UNDERSCORE + MODE_CHECK_IGNORE;
        if (this[key]) {
          return this[key];
        }
        return this._make(MODE_CHECK_IGNORE, key);
      }
      _make(mode, key) {
        const str = this.regexPrefix.replace(
          REGEX_REPLACE_TRAILING_WILDCARD,
          // It does not need to bind pattern
          TRAILING_WILD_CARD_REPLACERS[mode]
        );
        const regex = this.ignoreCase ? new RegExp(str, "i") : new RegExp(str);
        return define(this, key, regex);
      }
    };
    var createRule = ({
      pattern: pattern2,
      mark
    }, ignoreCase) => {
      let negative = false;
      let body = pattern2;
      if (body.indexOf("!") === 0) {
        negative = true;
        body = body.substr(1);
      }
      body = body.replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, "#");
      const regexPrefix = makeRegexPrefix(body);
      return new IgnoreRule(
        pattern2,
        mark,
        body,
        ignoreCase,
        negative,
        regexPrefix
      );
    };
    var RuleManager = class {
      constructor(ignoreCase) {
        this._ignoreCase = ignoreCase;
        this._rules = [];
      }
      _add(pattern2) {
        if (pattern2 && pattern2[KEY_IGNORE]) {
          this._rules = this._rules.concat(pattern2._rules._rules);
          this._added = true;
          return;
        }
        if (isString(pattern2)) {
          pattern2 = {
            pattern: pattern2
          };
        }
        if (checkPattern(pattern2.pattern)) {
          const rule = createRule(pattern2, this._ignoreCase);
          this._added = true;
          this._rules.push(rule);
        }
      }
      // @param {Array<string> | string | Ignore} pattern
      add(pattern2) {
        this._added = false;
        makeArray(
          isString(pattern2) ? splitPattern(pattern2) : pattern2
        ).forEach(this._add, this);
        return this._added;
      }
      // Test one single path without recursively checking parent directories
      //
      // - checkUnignored `boolean` whether should check if the path is unignored,
      //   setting `checkUnignored` to `false` could reduce additional
      //   path matching.
      // - check `string` either `MODE_IGNORE` or `MODE_CHECK_IGNORE`
      // @returns {TestResult} true if a file is ignored
      test(path, checkUnignored, mode) {
        let ignored = false;
        let unignored = false;
        let matchedRule;
        this._rules.forEach((rule) => {
          const { negative } = rule;
          if (unignored === negative && ignored !== unignored || negative && !ignored && !unignored && !checkUnignored) {
            return;
          }
          const matched = rule[mode].test(path);
          if (!matched) {
            return;
          }
          ignored = !negative;
          unignored = negative;
          matchedRule = negative ? UNDEFINED : rule;
        });
        const ret = {
          ignored,
          unignored
        };
        if (matchedRule) {
          ret.rule = matchedRule;
        }
        return ret;
      }
    };
    var throwError = (message, Ctor) => {
      throw new Ctor(message);
    };
    var checkPath = (path, originalPath, doThrow) => {
      if (!isString(path)) {
        return doThrow(
          `path must be a string, but got \`${originalPath}\``,
          TypeError
        );
      }
      if (!path) {
        return doThrow(`path must not be empty`, TypeError);
      }
      if (checkPath.isNotRelative(path)) {
        const r = "`path.relative()`d";
        return doThrow(
          `path should be a ${r} string, but got "${originalPath}"`,
          RangeError
        );
      }
      return true;
    };
    var isNotRelative = (path) => REGEX_TEST_INVALID_PATH.test(path);
    checkPath.isNotRelative = isNotRelative;
    checkPath.convert = (p) => p;
    var Ignore = class {
      constructor({
        ignorecase = true,
        ignoreCase = ignorecase,
        allowRelativePaths = false
      } = {}) {
        define(this, KEY_IGNORE, true);
        this._rules = new RuleManager(ignoreCase);
        this._strictPathCheck = !allowRelativePaths;
        this._initCache();
      }
      _initCache() {
        this._ignoreCache = /* @__PURE__ */ Object.create(null);
        this._testCache = /* @__PURE__ */ Object.create(null);
      }
      add(pattern2) {
        if (this._rules.add(pattern2)) {
          this._initCache();
        }
        return this;
      }
      // legacy
      addPattern(pattern2) {
        return this.add(pattern2);
      }
      // @returns {TestResult}
      _test(originalPath, cache, checkUnignored, slices) {
        const path = originalPath && checkPath.convert(originalPath);
        checkPath(
          path,
          originalPath,
          this._strictPathCheck ? throwError : RETURN_FALSE
        );
        return this._t(path, cache, checkUnignored, slices);
      }
      checkIgnore(path) {
        if (!REGEX_TEST_TRAILING_SLASH.test(path)) {
          return this.test(path);
        }
        const slices = path.split(SLASH).filter(Boolean);
        slices.pop();
        if (slices.length) {
          const parent = this._t(
            slices.join(SLASH) + SLASH,
            this._testCache,
            true,
            slices
          );
          if (parent.ignored) {
            return parent;
          }
        }
        return this._rules.test(path, false, MODE_CHECK_IGNORE);
      }
      _t(path, cache, checkUnignored, slices) {
        if (path in cache) {
          return cache[path];
        }
        if (!slices) {
          slices = path.split(SLASH).filter(Boolean);
        }
        slices.pop();
        if (!slices.length) {
          return cache[path] = this._rules.test(path, checkUnignored, MODE_IGNORE);
        }
        const parent = this._t(
          slices.join(SLASH) + SLASH,
          cache,
          checkUnignored,
          slices
        );
        return cache[path] = parent.ignored ? parent : this._rules.test(path, checkUnignored, MODE_IGNORE);
      }
      ignores(path) {
        return this._test(path, this._ignoreCache, false).ignored;
      }
      createFilter() {
        return (path) => !this.ignores(path);
      }
      filter(paths) {
        return makeArray(paths).filter(this.createFilter());
      }
      // @returns {TestResult}
      test(path) {
        return this._test(path, this._testCache, true);
      }
    };
    var factory = (options) => new Ignore(options);
    var isPathValid = (path) => checkPath(path && checkPath.convert(path), path, RETURN_FALSE);
    var setupWindows = () => {
      const makePosix = (str) => /^\\\\\?\\/.test(str) || /["<>|\u0000-\u001F]+/u.test(str) ? str : str.replace(/\\/g, "/");
      checkPath.convert = makePosix;
      const REGEX_TEST_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i;
      checkPath.isNotRelative = (path) => REGEX_TEST_WINDOWS_PATH_ABSOLUTE.test(path) || isNotRelative(path);
    };
    if (
      // Detect `process` so that it can run in browsers.
      typeof process !== "undefined" && process.platform === "win32"
    ) {
      setupWindows();
    }
    module2.exports = factory;
    factory.default = factory;
    module2.exports.isPathValid = isPathValid;
    define(module2.exports, /* @__PURE__ */ Symbol.for("setupWindows"), setupWindows);
  }
});

// node_modules/glob/node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({
  "node_modules/glob/node_modules/balanced-match/index.js"(exports2, module2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    module2.exports = balanced;
    function balanced(a, b, str) {
      if (a instanceof RegExp) a = maybeMatch(a, str);
      if (b instanceof RegExp) b = maybeMatch(b, str);
      var r = range(a, b, str);
      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }
    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }
    balanced.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;
      if (ai >= 0 && bi > 0) {
        if (a === b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [begs.pop(), bi];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }
            bi = str.indexOf(b, i + 1);
          }
          i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
          result = [left, right];
        }
      }
      return result;
    }
  }
});

// node_modules/glob/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({
  "node_modules/glob/node_modules/brace-expansion/index.js"(exports2, module2) {
    init_define_LATEXLINT_DEFAULTS();
    var balanced = require_balanced_match();
    module2.exports = expandTop;
    var escSlash = "\0SLASH" + Math.random() + "\0";
    var escOpen = "\0OPEN" + Math.random() + "\0";
    var escClose = "\0CLOSE" + Math.random() + "\0";
    var escComma = "\0COMMA" + Math.random() + "\0";
    var escPeriod = "\0PERIOD" + Math.random() + "\0";
    function numeric(str) {
      return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
    }
    function escapeBraces(str) {
      return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
    }
    function unescapeBraces(str) {
      return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
    }
    function parseCommaParts(str) {
      if (!str)
        return [""];
      var parts = [];
      var m = balanced("{", "}", str);
      if (!m)
        return str.split(",");
      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(",");
      p[p.length - 1] += "{" + body + "}";
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
      }
      parts.push.apply(parts, p);
      return parts;
    }
    function expandTop(str, options) {
      if (!str)
        return [];
      options = options || {};
      var max = options.max == null ? Infinity : options.max;
      if (str.substr(0, 2) === "{}") {
        str = "\\{\\}" + str.substr(2);
      }
      return expand(escapeBraces(str), max, true).map(unescapeBraces);
    }
    function embrace(str) {
      return "{" + str + "}";
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }
    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }
    function expand(str, max, isTop) {
      var expansions = [];
      for (; ; ) {
        const m = balanced("{", "}", str);
        if (!m) return [str];
        const pre = m.pre;
        if (/\$$/.test(m.pre)) {
          const post2 = m.post.length ? expand(m.post, max, false) : [""];
          for (let k2 = 0; k2 < post2.length && k2 < max; k2++) {
            const expansion2 = pre + "{" + m.body + "}" + post2[k2];
            expansions.push(expansion2);
          }
          return expansions;
        }
        var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        var isSequence = isNumericSequence || isAlphaSequence;
        var isOptions = m.body.indexOf(",") >= 0;
        if (!isSequence && !isOptions) {
          if (m.post.match(/,(?!,).*\}/)) {
            str = m.pre + "{" + m.body + escClose + m.post;
            isTop = true;
            continue;
          }
          return [str];
        }
        const post = m.post.length ? expand(m.post, max, false) : [""];
        var n;
        if (isSequence) {
          n = m.body.split(/\.\./);
        } else {
          n = parseCommaParts(m.body);
          if (n.length === 1) {
            n = expand(n[0], max, false).map(embrace);
            if (n.length === 1) {
              return post.map(function(p) {
                return m.pre + n[0] + p;
              });
            }
          }
        }
        var N;
        if (isSequence) {
          var x = numeric(n[0]);
          var y = numeric(n[1]);
          var width = Math.max(n[0].length, n[1].length);
          var incr = n.length == 3 ? Math.max(Math.abs(numeric(n[2])), 1) : 1;
          var test = lte;
          var reverse = y < x;
          if (reverse) {
            incr *= -1;
            test = gte;
          }
          var pad = n.some(isPadded);
          N = [];
          for (var i = x; test(i, y) && N.length < max; i += incr) {
            var c;
            if (isAlphaSequence) {
              c = String.fromCharCode(i);
              if (c === "\\")
                c = "";
            } else {
              c = String(i);
              if (pad) {
                var need = width - c.length;
                if (need > 0) {
                  var z = new Array(need + 1).join("0");
                  if (i < 0)
                    c = "-" + z + c.slice(1);
                  else
                    c = z + c;
                }
              }
            }
            N.push(c);
          }
        } else {
          N = [];
          for (var j = 0; j < n.length; j++) {
            N.push.apply(N, expand(n[j], max, false));
          }
        }
        for (var j = 0; j < N.length; j++) {
          for (var k = 0; k < post.length && expansions.length < max; k++) {
            var expansion = pre + N[j] + post[k];
            if (!isTop || isSequence || expansion)
              expansions.push(expansion);
          }
        }
        return expansions;
      }
    }
  }
});

// node_modules/glob/node_modules/minimatch/dist/commonjs/assert-valid-pattern.js
var require_assert_valid_pattern = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/commonjs/assert-valid-pattern.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.assertValidPattern = void 0;
    var MAX_PATTERN_LENGTH = 1024 * 64;
    var assertValidPattern = (pattern2) => {
      if (typeof pattern2 !== "string") {
        throw new TypeError("invalid pattern");
      }
      if (pattern2.length > MAX_PATTERN_LENGTH) {
        throw new TypeError("pattern is too long");
      }
    };
    exports2.assertValidPattern = assertValidPattern;
  }
});

// node_modules/glob/node_modules/minimatch/dist/commonjs/brace-expressions.js
var require_brace_expressions = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/commonjs/brace-expressions.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.parseClass = void 0;
    var posixClasses = {
      "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}", true],
      "[:alpha:]": ["\\p{L}\\p{Nl}", true],
      "[:ascii:]": ["\\x00-\\x7f", false],
      "[:blank:]": ["\\p{Zs}\\t", true],
      "[:cntrl:]": ["\\p{Cc}", true],
      "[:digit:]": ["\\p{Nd}", true],
      "[:graph:]": ["\\p{Z}\\p{C}", true, true],
      "[:lower:]": ["\\p{Ll}", true],
      "[:print:]": ["\\p{C}", true],
      "[:punct:]": ["\\p{P}", true],
      "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f", true],
      "[:upper:]": ["\\p{Lu}", true],
      "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}", true],
      "[:xdigit:]": ["A-Fa-f0-9", false]
    };
    var braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
    var regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var rangesToString = (ranges) => ranges.join("");
    var parseClass = (glob, position) => {
      const pos = position;
      if (glob.charAt(pos) !== "[") {
        throw new Error("not in a brace expression");
      }
      const ranges = [];
      const negs = [];
      let i = pos + 1;
      let sawStart = false;
      let uflag = false;
      let escaping = false;
      let negate = false;
      let endPos = pos;
      let rangeStart = "";
      WHILE: while (i < glob.length) {
        const c = glob.charAt(i);
        if ((c === "!" || c === "^") && i === pos + 1) {
          negate = true;
          i++;
          continue;
        }
        if (c === "]" && sawStart && !escaping) {
          endPos = i + 1;
          break;
        }
        sawStart = true;
        if (c === "\\") {
          if (!escaping) {
            escaping = true;
            i++;
            continue;
          }
        }
        if (c === "[" && !escaping) {
          for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
            if (glob.startsWith(cls, i)) {
              if (rangeStart) {
                return ["$.", false, glob.length - pos, true];
              }
              i += cls.length;
              if (neg)
                negs.push(unip);
              else
                ranges.push(unip);
              uflag = uflag || u;
              continue WHILE;
            }
          }
        }
        escaping = false;
        if (rangeStart) {
          if (c > rangeStart) {
            ranges.push(braceEscape(rangeStart) + "-" + braceEscape(c));
          } else if (c === rangeStart) {
            ranges.push(braceEscape(c));
          }
          rangeStart = "";
          i++;
          continue;
        }
        if (glob.startsWith("-]", i + 1)) {
          ranges.push(braceEscape(c + "-"));
          i += 2;
          continue;
        }
        if (glob.startsWith("-", i + 1)) {
          rangeStart = c;
          i += 2;
          continue;
        }
        ranges.push(braceEscape(c));
        i++;
      }
      if (endPos < i) {
        return ["", false, 0, false];
      }
      if (!ranges.length && !negs.length) {
        return ["$.", false, glob.length - pos, true];
      }
      if (negs.length === 0 && ranges.length === 1 && /^\\?.$/.test(ranges[0]) && !negate) {
        const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
        return [regexpEscape(r), false, endPos - pos, false];
      }
      const sranges = "[" + (negate ? "^" : "") + rangesToString(ranges) + "]";
      const snegs = "[" + (negate ? "" : "^") + rangesToString(negs) + "]";
      const comb = ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs;
      return [comb, uflag, endPos - pos, true];
    };
    exports2.parseClass = parseClass;
  }
});

// node_modules/glob/node_modules/minimatch/dist/commonjs/unescape.js
var require_unescape = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/commonjs/unescape.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.unescape = void 0;
    var unescape = (s, { windowsPathsNoEscape = false } = {}) => {
      return windowsPathsNoEscape ? s.replace(/\[([^\/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^\/\\])\]/g, "$1$2").replace(/\\([^\/])/g, "$1");
    };
    exports2.unescape = unescape;
  }
});

// node_modules/glob/node_modules/minimatch/dist/commonjs/ast.js
var require_ast = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/commonjs/ast.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AST = void 0;
    var brace_expressions_js_1 = require_brace_expressions();
    var unescape_js_1 = require_unescape();
    var types = /* @__PURE__ */ new Set(["!", "?", "+", "*", "@"]);
    var isExtglobType = (c) => types.has(c);
    var isExtglobAST = (c) => isExtglobType(c.type);
    var adoptionMap = /* @__PURE__ */ new Map([
      ["!", ["@"]],
      ["?", ["?", "@"]],
      ["@", ["@"]],
      ["*", ["*", "+", "?", "@"]],
      ["+", ["+", "@"]]
    ]);
    var adoptionWithSpaceMap = /* @__PURE__ */ new Map([
      ["!", ["?"]],
      ["@", ["?"]],
      ["+", ["?", "*"]]
    ]);
    var adoptionAnyMap = /* @__PURE__ */ new Map([
      ["!", ["?", "@"]],
      ["?", ["?", "@"]],
      ["@", ["?", "@"]],
      ["*", ["*", "+", "?", "@"]],
      ["+", ["+", "@", "?", "*"]]
    ]);
    var usurpMap = /* @__PURE__ */ new Map([
      ["!", /* @__PURE__ */ new Map([["!", "@"]])],
      ["?", /* @__PURE__ */ new Map([["*", "*"], ["+", "*"]])],
      ["@", /* @__PURE__ */ new Map([["!", "!"], ["?", "?"], ["@", "@"], ["*", "*"], ["+", "+"]])],
      ["+", /* @__PURE__ */ new Map([["?", "*"], ["*", "*"]])]
    ]);
    var startNoTraversal = "(?!(?:^|/)\\.\\.?(?:$|/))";
    var startNoDot = "(?!\\.)";
    var addPatternStart = /* @__PURE__ */ new Set(["[", "."]);
    var justDots = /* @__PURE__ */ new Set(["..", "."]);
    var reSpecials = new Set("().*{}+?[]^$\\!");
    var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var qmark = "[^/]";
    var star = qmark + "*?";
    var starNoEmpty = qmark + "+?";
    var AST = class {
      type;
      #root;
      #hasMagic;
      #uflag = false;
      #parts = [];
      #parent;
      #parentIndex;
      #negs;
      #filledNegs = false;
      #options;
      #toString;
      // set to true if it's an extglob with no children
      // (which really means one child of '')
      #emptyExt = false;
      constructor(type, parent, options = {}) {
        this.type = type;
        if (type)
          this.#hasMagic = true;
        this.#parent = parent;
        this.#root = this.#parent ? this.#parent.#root : this;
        this.#options = this.#root === this ? options : this.#root.#options;
        this.#negs = this.#root === this ? [] : this.#root.#negs;
        if (type === "!" && !this.#root.#filledNegs)
          this.#negs.push(this);
        this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
      }
      get hasMagic() {
        if (this.#hasMagic !== void 0)
          return this.#hasMagic;
        for (const p of this.#parts) {
          if (typeof p === "string")
            continue;
          if (p.type || p.hasMagic)
            return this.#hasMagic = true;
        }
        return this.#hasMagic;
      }
      // reconstructs the pattern
      toString() {
        if (this.#toString !== void 0)
          return this.#toString;
        if (!this.type) {
          return this.#toString = this.#parts.map((p) => String(p)).join("");
        } else {
          return this.#toString = this.type + "(" + this.#parts.map((p) => String(p)).join("|") + ")";
        }
      }
      #fillNegs() {
        if (this !== this.#root)
          throw new Error("should only call on root");
        if (this.#filledNegs)
          return this;
        this.toString();
        this.#filledNegs = true;
        let n;
        while (n = this.#negs.pop()) {
          if (n.type !== "!")
            continue;
          let p = n;
          let pp = p.#parent;
          while (pp) {
            for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
              for (const part of n.#parts) {
                if (typeof part === "string") {
                  throw new Error("string part in extglob AST??");
                }
                part.copyIn(pp.#parts[i]);
              }
            }
            p = pp;
            pp = p.#parent;
          }
        }
        return this;
      }
      push(...parts) {
        for (const p of parts) {
          if (p === "")
            continue;
          if (typeof p !== "string" && !(p instanceof _a && p.#parent === this)) {
            throw new Error("invalid part: " + p);
          }
          this.#parts.push(p);
        }
      }
      toJSON() {
        const ret = this.type === null ? this.#parts.slice().map((p) => typeof p === "string" ? p : p.toJSON()) : [this.type, ...this.#parts.map((p) => p.toJSON())];
        if (this.isStart() && !this.type)
          ret.unshift([]);
        if (this.isEnd() && (this === this.#root || this.#root.#filledNegs && this.#parent?.type === "!")) {
          ret.push({});
        }
        return ret;
      }
      isStart() {
        if (this.#root === this)
          return true;
        if (!this.#parent?.isStart())
          return false;
        if (this.#parentIndex === 0)
          return true;
        const p = this.#parent;
        for (let i = 0; i < this.#parentIndex; i++) {
          const pp = p.#parts[i];
          if (!(pp instanceof _a && pp.type === "!")) {
            return false;
          }
        }
        return true;
      }
      isEnd() {
        if (this.#root === this)
          return true;
        if (this.#parent?.type === "!")
          return true;
        if (!this.#parent?.isEnd())
          return false;
        if (!this.type)
          return this.#parent?.isEnd();
        const pl = this.#parent ? this.#parent.#parts.length : 0;
        return this.#parentIndex === pl - 1;
      }
      copyIn(part) {
        if (typeof part === "string")
          this.push(part);
        else
          this.push(part.clone(this));
      }
      clone(parent) {
        const c = new _a(this.type, parent);
        for (const p of this.#parts) {
          c.copyIn(p);
        }
        return c;
      }
      static #parseAST(str, ast, pos, opt, extDepth) {
        const maxDepth = opt.maxExtglobRecursion ?? 2;
        let escaping = false;
        let inBrace = false;
        let braceStart = -1;
        let braceNeg = false;
        if (ast.type === null) {
          let i2 = pos;
          let acc2 = "";
          while (i2 < str.length) {
            const c = str.charAt(i2++);
            if (escaping || c === "\\") {
              escaping = !escaping;
              acc2 += c;
              continue;
            }
            if (inBrace) {
              if (i2 === braceStart + 1) {
                if (c === "^" || c === "!") {
                  braceNeg = true;
                }
              } else if (c === "]" && !(i2 === braceStart + 2 && braceNeg)) {
                inBrace = false;
              }
              acc2 += c;
              continue;
            } else if (c === "[") {
              inBrace = true;
              braceStart = i2;
              braceNeg = false;
              acc2 += c;
              continue;
            }
            const doRecurse = !opt.noext && isExtglobType(c) && str.charAt(i2) === "(" && extDepth <= maxDepth;
            if (doRecurse) {
              ast.push(acc2);
              acc2 = "";
              const ext = new _a(c, ast);
              i2 = _a.#parseAST(str, ext, i2, opt, extDepth + 1);
              ast.push(ext);
              continue;
            }
            acc2 += c;
          }
          ast.push(acc2);
          return i2;
        }
        let i = pos + 1;
        let part = new _a(null, ast);
        const parts = [];
        let acc = "";
        while (i < str.length) {
          const c = str.charAt(i++);
          if (escaping || c === "\\") {
            escaping = !escaping;
            acc += c;
            continue;
          }
          if (inBrace) {
            if (i === braceStart + 1) {
              if (c === "^" || c === "!") {
                braceNeg = true;
              }
            } else if (c === "]" && !(i === braceStart + 2 && braceNeg)) {
              inBrace = false;
            }
            acc += c;
            continue;
          } else if (c === "[") {
            inBrace = true;
            braceStart = i;
            braceNeg = false;
            acc += c;
            continue;
          }
          const doRecurse = isExtglobType(c) && str.charAt(i) === "(" && /* c8 ignore start - the maxDepth is sufficient here */
          (extDepth <= maxDepth || ast && ast.#canAdoptType(c));
          if (doRecurse) {
            const depthAdd = ast && ast.#canAdoptType(c) ? 0 : 1;
            part.push(acc);
            acc = "";
            const ext = new _a(c, part);
            part.push(ext);
            i = _a.#parseAST(str, ext, i, opt, extDepth + depthAdd);
            continue;
          }
          if (c === "|") {
            part.push(acc);
            acc = "";
            parts.push(part);
            part = new _a(null, ast);
            continue;
          }
          if (c === ")") {
            if (acc === "" && ast.#parts.length === 0) {
              ast.#emptyExt = true;
            }
            part.push(acc);
            acc = "";
            ast.push(...parts, part);
            return i;
          }
          acc += c;
        }
        ast.type = null;
        ast.#hasMagic = void 0;
        ast.#parts = [str.substring(pos - 1)];
        return i;
      }
      #canAdoptWithSpace(child) {
        return this.#canAdopt(child, adoptionWithSpaceMap);
      }
      #canAdopt(child, map = adoptionMap) {
        if (!child || typeof child !== "object" || child.type !== null || child.#parts.length !== 1 || this.type === null) {
          return false;
        }
        const gc = child.#parts[0];
        if (!gc || typeof gc !== "object" || gc.type === null) {
          return false;
        }
        return this.#canAdoptType(gc.type, map);
      }
      #canAdoptType(c, map = adoptionAnyMap) {
        return !!map.get(this.type)?.includes(c);
      }
      #adoptWithSpace(child, index) {
        const gc = child.#parts[0];
        const blank = new _a(null, gc, this.options);
        blank.#parts.push("");
        gc.push(blank);
        this.#adopt(child, index);
      }
      #adopt(child, index) {
        const gc = child.#parts[0];
        this.#parts.splice(index, 1, ...gc.#parts);
        for (const p of gc.#parts) {
          if (typeof p === "object")
            p.#parent = this;
        }
        this.#toString = void 0;
      }
      #canUsurpType(c) {
        const m = usurpMap.get(this.type);
        return !!m?.has(c);
      }
      #canUsurp(child) {
        if (!child || typeof child !== "object" || child.type !== null || child.#parts.length !== 1 || this.type === null || this.#parts.length !== 1) {
          return false;
        }
        const gc = child.#parts[0];
        if (!gc || typeof gc !== "object" || gc.type === null) {
          return false;
        }
        return this.#canUsurpType(gc.type);
      }
      #usurp(child) {
        const m = usurpMap.get(this.type);
        const gc = child.#parts[0];
        const nt = m?.get(gc.type);
        if (!nt)
          return false;
        this.#parts = gc.#parts;
        for (const p of this.#parts) {
          if (typeof p === "object")
            p.#parent = this;
        }
        this.type = nt;
        this.#toString = void 0;
        this.#emptyExt = false;
      }
      #flatten() {
        if (!isExtglobAST(this)) {
          for (const p of this.#parts) {
            if (typeof p === "object")
              p.#flatten();
          }
        } else {
          let iterations = 0;
          let done = false;
          do {
            done = true;
            for (let i = 0; i < this.#parts.length; i++) {
              const c = this.#parts[i];
              if (typeof c === "object") {
                c.#flatten();
                if (this.#canAdopt(c)) {
                  done = false;
                  this.#adopt(c, i);
                } else if (this.#canAdoptWithSpace(c)) {
                  done = false;
                  this.#adoptWithSpace(c, i);
                } else if (this.#canUsurp(c)) {
                  done = false;
                  this.#usurp(c);
                }
              }
            }
          } while (!done && ++iterations < 10);
        }
        this.#toString = void 0;
      }
      static fromGlob(pattern2, options = {}) {
        const ast = new _a(null, void 0, options);
        _a.#parseAST(pattern2, ast, 0, options, 0);
        return ast;
      }
      // returns the regular expression if there's magic, or the unescaped
      // string if not.
      toMMPattern() {
        if (this !== this.#root)
          return this.#root.toMMPattern();
        const glob = this.toString();
        const [re, body, hasMagic2, uflag] = this.toRegExpSource();
        const anyMagic = hasMagic2 || this.#hasMagic || this.#options.nocase && !this.#options.nocaseMagicOnly && glob.toUpperCase() !== glob.toLowerCase();
        if (!anyMagic) {
          return body;
        }
        const flags = (this.#options.nocase ? "i" : "") + (uflag ? "u" : "");
        return Object.assign(new RegExp(`^${re}$`, flags), {
          _src: re,
          _glob: glob
        });
      }
      get options() {
        return this.#options;
      }
      // returns the string match, the regexp source, whether there's magic
      // in the regexp (so a regular expression is required) and whether or
      // not the uflag is needed for the regular expression (for posix classes)
      // TODO: instead of injecting the start/end at this point, just return
      // the BODY of the regexp, along with the start/end portions suitable
      // for binding the start/end in either a joined full-path makeRe context
      // (where we bind to (^|/), or a standalone matchPart context (where
      // we bind to ^, and not /).  Otherwise slashes get duped!
      //
      // In part-matching mode, the start is:
      // - if not isStart: nothing
      // - if traversal possible, but not allowed: ^(?!\.\.?$)
      // - if dots allowed or not possible: ^
      // - if dots possible and not allowed: ^(?!\.)
      // end is:
      // - if not isEnd(): nothing
      // - else: $
      //
      // In full-path matching mode, we put the slash at the START of the
      // pattern, so start is:
      // - if first pattern: same as part-matching mode
      // - if not isStart(): nothing
      // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
      // - if dots allowed or not possible: /
      // - if dots possible and not allowed: /(?!\.)
      // end is:
      // - if last pattern, same as part-matching mode
      // - else nothing
      //
      // Always put the (?:$|/) on negated tails, though, because that has to be
      // there to bind the end of the negated pattern portion, and it's easier to
      // just stick it in now rather than try to inject it later in the middle of
      // the pattern.
      //
      // We can just always return the same end, and leave it up to the caller
      // to know whether it's going to be used joined or in parts.
      // And, if the start is adjusted slightly, can do the same there:
      // - if not isStart: nothing
      // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
      // - if dots allowed or not possible: (?:/|^)
      // - if dots possible and not allowed: (?:/|^)(?!\.)
      //
      // But it's better to have a simpler binding without a conditional, for
      // performance, so probably better to return both start options.
      //
      // Then the caller just ignores the end if it's not the first pattern,
      // and the start always gets applied.
      //
      // But that's always going to be $ if it's the ending pattern, or nothing,
      // so the caller can just attach $ at the end of the pattern when building.
      //
      // So the todo is:
      // - better detect what kind of start is needed
      // - return both flavors of starting pattern
      // - attach $ at the end of the pattern when creating the actual RegExp
      //
      // Ah, but wait, no, that all only applies to the root when the first pattern
      // is not an extglob. If the first pattern IS an extglob, then we need all
      // that dot prevention biz to live in the extglob portions, because eg
      // +(*|.x*) can match .xy but not .yx.
      //
      // So, return the two flavors if it's #root and the first child is not an
      // AST, otherwise leave it to the child AST to handle it, and there,
      // use the (?:^|/) style of start binding.
      //
      // Even simplified further:
      // - Since the start for a join is eg /(?!\.) and the start for a part
      // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
      // or start or whatever) and prepend ^ or / at the Regexp construction.
      toRegExpSource(allowDot) {
        const dot = allowDot ?? !!this.#options.dot;
        if (this.#root === this) {
          this.#flatten();
          this.#fillNegs();
        }
        if (!isExtglobAST(this)) {
          const noEmpty = this.isStart() && this.isEnd();
          const src = this.#parts.map((p) => {
            const [re, _, hasMagic2, uflag] = typeof p === "string" ? _a.#parseGlob(p, this.#hasMagic, noEmpty) : p.toRegExpSource(allowDot);
            this.#hasMagic = this.#hasMagic || hasMagic2;
            this.#uflag = this.#uflag || uflag;
            return re;
          }).join("");
          let start2 = "";
          if (this.isStart()) {
            if (typeof this.#parts[0] === "string") {
              const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
              if (!dotTravAllowed) {
                const aps = addPatternStart;
                const needNoTrav = (
                  // dots are allowed, and the pattern starts with [ or .
                  dot && aps.has(src.charAt(0)) || // the pattern starts with \., and then [ or .
                  src.startsWith("\\.") && aps.has(src.charAt(2)) || // the pattern starts with \.\., and then [ or .
                  src.startsWith("\\.\\.") && aps.has(src.charAt(4))
                );
                const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
                start2 = needNoTrav ? startNoTraversal : needNoDot ? startNoDot : "";
              }
            }
          }
          let end = "";
          if (this.isEnd() && this.#root.#filledNegs && this.#parent?.type === "!") {
            end = "(?:$|\\/)";
          }
          const final2 = start2 + src + end;
          return [
            final2,
            (0, unescape_js_1.unescape)(src),
            this.#hasMagic = !!this.#hasMagic,
            this.#uflag
          ];
        }
        const repeated = this.type === "*" || this.type === "+";
        const start = this.type === "!" ? "(?:(?!(?:" : "(?:";
        let body = this.#partsToRegExp(dot);
        if (this.isStart() && this.isEnd() && !body && this.type !== "!") {
          const s = this.toString();
          const me = this;
          me.#parts = [s];
          me.type = null;
          me.#hasMagic = void 0;
          return [s, (0, unescape_js_1.unescape)(this.toString()), false, false];
        }
        let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ? "" : this.#partsToRegExp(true);
        if (bodyDotAllowed === body) {
          bodyDotAllowed = "";
        }
        if (bodyDotAllowed) {
          body = `(?:${body})(?:${bodyDotAllowed})*?`;
        }
        let final = "";
        if (this.type === "!" && this.#emptyExt) {
          final = (this.isStart() && !dot ? startNoDot : "") + starNoEmpty;
        } else {
          const close = this.type === "!" ? (
            // !() must match something,but !(x) can match ''
            "))" + (this.isStart() && !dot && !allowDot ? startNoDot : "") + star + ")"
          ) : this.type === "@" ? ")" : this.type === "?" ? ")?" : this.type === "+" && bodyDotAllowed ? ")" : this.type === "*" && bodyDotAllowed ? `)?` : `)${this.type}`;
          final = start + body + close;
        }
        return [
          final,
          (0, unescape_js_1.unescape)(body),
          this.#hasMagic = !!this.#hasMagic,
          this.#uflag
        ];
      }
      #partsToRegExp(dot) {
        return this.#parts.map((p) => {
          if (typeof p === "string") {
            throw new Error("string type in extglob ast??");
          }
          const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
          this.#uflag = this.#uflag || uflag;
          return re;
        }).filter((p) => !(this.isStart() && this.isEnd()) || !!p).join("|");
      }
      static #parseGlob(glob, hasMagic2, noEmpty = false) {
        let escaping = false;
        let re = "";
        let uflag = false;
        let inStar = false;
        for (let i = 0; i < glob.length; i++) {
          const c = glob.charAt(i);
          if (escaping) {
            escaping = false;
            re += (reSpecials.has(c) ? "\\" : "") + c;
            inStar = false;
            continue;
          }
          if (c === "\\") {
            if (i === glob.length - 1) {
              re += "\\\\";
            } else {
              escaping = true;
            }
            continue;
          }
          if (c === "[") {
            const [src, needUflag, consumed, magic] = (0, brace_expressions_js_1.parseClass)(glob, i);
            if (consumed) {
              re += src;
              uflag = uflag || needUflag;
              i += consumed - 1;
              hasMagic2 = hasMagic2 || magic;
              inStar = false;
              continue;
            }
          }
          if (c === "*") {
            if (inStar)
              continue;
            inStar = true;
            re += noEmpty && /^[*]+$/.test(glob) ? starNoEmpty : star;
            hasMagic2 = true;
            continue;
          } else {
            inStar = false;
          }
          if (c === "?") {
            re += qmark;
            hasMagic2 = true;
            continue;
          }
          re += regExpEscape(c);
        }
        return [re, (0, unescape_js_1.unescape)(glob), !!hasMagic2, uflag];
      }
    };
    exports2.AST = AST;
    _a = AST;
  }
});

// node_modules/glob/node_modules/minimatch/dist/commonjs/escape.js
var require_escape = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/commonjs/escape.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.escape = void 0;
    var escape = (s, { windowsPathsNoEscape = false } = {}) => {
      return windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
    };
    exports2.escape = escape;
  }
});

// node_modules/glob/node_modules/minimatch/dist/commonjs/index.js
var require_commonjs = __commonJS({
  "node_modules/glob/node_modules/minimatch/dist/commonjs/index.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.unescape = exports2.escape = exports2.AST = exports2.Minimatch = exports2.match = exports2.makeRe = exports2.braceExpand = exports2.defaults = exports2.filter = exports2.GLOBSTAR = exports2.sep = exports2.minimatch = void 0;
    var brace_expansion_1 = __importDefault(require_brace_expansion());
    var assert_valid_pattern_js_1 = require_assert_valid_pattern();
    var ast_js_1 = require_ast();
    var escape_js_1 = require_escape();
    var unescape_js_1 = require_unescape();
    var minimatch = (p, pattern2, options = {}) => {
      (0, assert_valid_pattern_js_1.assertValidPattern)(pattern2);
      if (!options.nocomment && pattern2.charAt(0) === "#") {
        return false;
      }
      return new Minimatch(pattern2, options).match(p);
    };
    exports2.minimatch = minimatch;
    var starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
    var starDotExtTest = (ext2) => (f) => !f.startsWith(".") && f.endsWith(ext2);
    var starDotExtTestDot = (ext2) => (f) => f.endsWith(ext2);
    var starDotExtTestNocase = (ext2) => {
      ext2 = ext2.toLowerCase();
      return (f) => !f.startsWith(".") && f.toLowerCase().endsWith(ext2);
    };
    var starDotExtTestNocaseDot = (ext2) => {
      ext2 = ext2.toLowerCase();
      return (f) => f.toLowerCase().endsWith(ext2);
    };
    var starDotStarRE = /^\*+\.\*+$/;
    var starDotStarTest = (f) => !f.startsWith(".") && f.includes(".");
    var starDotStarTestDot = (f) => f !== "." && f !== ".." && f.includes(".");
    var dotStarRE = /^\.\*+$/;
    var dotStarTest = (f) => f !== "." && f !== ".." && f.startsWith(".");
    var starRE = /^\*+$/;
    var starTest = (f) => f.length !== 0 && !f.startsWith(".");
    var starTestDot = (f) => f.length !== 0 && f !== "." && f !== "..";
    var qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
    var qmarksTestNocase = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExt([$0]);
      if (!ext2)
        return noext;
      ext2 = ext2.toLowerCase();
      return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
    };
    var qmarksTestNocaseDot = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExtDot([$0]);
      if (!ext2)
        return noext;
      ext2 = ext2.toLowerCase();
      return (f) => noext(f) && f.toLowerCase().endsWith(ext2);
    };
    var qmarksTestDot = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExtDot([$0]);
      return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
    };
    var qmarksTest = ([$0, ext2 = ""]) => {
      const noext = qmarksTestNoExt([$0]);
      return !ext2 ? noext : (f) => noext(f) && f.endsWith(ext2);
    };
    var qmarksTestNoExt = ([$0]) => {
      const len = $0.length;
      return (f) => f.length === len && !f.startsWith(".");
    };
    var qmarksTestNoExtDot = ([$0]) => {
      const len = $0.length;
      return (f) => f.length === len && f !== "." && f !== "..";
    };
    var defaultPlatform = typeof process === "object" && process ? typeof process.env === "object" && process.env && process.env.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
    var path = {
      win32: { sep: "\\" },
      posix: { sep: "/" }
    };
    exports2.sep = defaultPlatform === "win32" ? path.win32.sep : path.posix.sep;
    exports2.minimatch.sep = exports2.sep;
    exports2.GLOBSTAR = /* @__PURE__ */ Symbol("globstar **");
    exports2.minimatch.GLOBSTAR = exports2.GLOBSTAR;
    var qmark = "[^/]";
    var star = qmark + "*?";
    var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
    var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
    var filter = (pattern2, options = {}) => (p) => (0, exports2.minimatch)(p, pattern2, options);
    exports2.filter = filter;
    exports2.minimatch.filter = exports2.filter;
    var ext = (a, b = {}) => Object.assign({}, a, b);
    var defaults2 = (def) => {
      if (!def || typeof def !== "object" || !Object.keys(def).length) {
        return exports2.minimatch;
      }
      const orig = exports2.minimatch;
      const m = (p, pattern2, options = {}) => orig(p, pattern2, ext(def, options));
      return Object.assign(m, {
        Minimatch: class Minimatch extends orig.Minimatch {
          constructor(pattern2, options = {}) {
            super(pattern2, ext(def, options));
          }
          static defaults(options) {
            return orig.defaults(ext(def, options)).Minimatch;
          }
        },
        AST: class AST extends orig.AST {
          /* c8 ignore start */
          constructor(type, parent, options = {}) {
            super(type, parent, ext(def, options));
          }
          /* c8 ignore stop */
          static fromGlob(pattern2, options = {}) {
            return orig.AST.fromGlob(pattern2, ext(def, options));
          }
        },
        unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
        escape: (s, options = {}) => orig.escape(s, ext(def, options)),
        filter: (pattern2, options = {}) => orig.filter(pattern2, ext(def, options)),
        defaults: (options) => orig.defaults(ext(def, options)),
        makeRe: (pattern2, options = {}) => orig.makeRe(pattern2, ext(def, options)),
        braceExpand: (pattern2, options = {}) => orig.braceExpand(pattern2, ext(def, options)),
        match: (list, pattern2, options = {}) => orig.match(list, pattern2, ext(def, options)),
        sep: orig.sep,
        GLOBSTAR: exports2.GLOBSTAR
      });
    };
    exports2.defaults = defaults2;
    exports2.minimatch.defaults = exports2.defaults;
    var braceExpand = (pattern2, options = {}) => {
      (0, assert_valid_pattern_js_1.assertValidPattern)(pattern2);
      if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern2)) {
        return [pattern2];
      }
      return (0, brace_expansion_1.default)(pattern2);
    };
    exports2.braceExpand = braceExpand;
    exports2.minimatch.braceExpand = exports2.braceExpand;
    var makeRe = (pattern2, options = {}) => new Minimatch(pattern2, options).makeRe();
    exports2.makeRe = makeRe;
    exports2.minimatch.makeRe = exports2.makeRe;
    var match = (list, pattern2, options = {}) => {
      const mm = new Minimatch(pattern2, options);
      list = list.filter((f) => mm.match(f));
      if (mm.options.nonull && !list.length) {
        list.push(pattern2);
      }
      return list;
    };
    exports2.match = match;
    exports2.minimatch.match = exports2.match;
    var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
    var regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var Minimatch = class {
      options;
      set;
      pattern;
      windowsPathsNoEscape;
      nonegate;
      negate;
      comment;
      empty;
      preserveMultipleSlashes;
      partial;
      globSet;
      globParts;
      nocase;
      isWindows;
      platform;
      windowsNoMagicRoot;
      maxGlobstarRecursion;
      regexp;
      constructor(pattern2, options = {}) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern2);
        options = options || {};
        this.options = options;
        this.maxGlobstarRecursion = options.maxGlobstarRecursion ?? 200;
        this.pattern = pattern2;
        this.platform = options.platform || defaultPlatform;
        this.isWindows = this.platform === "win32";
        this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
          this.pattern = this.pattern.replace(/\\/g, "/");
        }
        this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
        this.regexp = null;
        this.negate = false;
        this.nonegate = !!options.nonegate;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.nocase = !!this.options.nocase;
        this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
        this.globSet = [];
        this.globParts = [];
        this.set = [];
        this.make();
      }
      hasMagic() {
        if (this.options.magicalBraces && this.set.length > 1) {
          return true;
        }
        for (const pattern2 of this.set) {
          for (const part of pattern2) {
            if (typeof part !== "string")
              return true;
          }
        }
        return false;
      }
      debug(..._) {
      }
      make() {
        const pattern2 = this.pattern;
        const options = this.options;
        if (!options.nocomment && pattern2.charAt(0) === "#") {
          this.comment = true;
          return;
        }
        if (!pattern2) {
          this.empty = true;
          return;
        }
        this.parseNegate();
        this.globSet = [...new Set(this.braceExpand())];
        if (options.debug) {
          this.debug = (...args) => console.error(...args);
        }
        this.debug(this.pattern, this.globSet);
        const rawGlobParts = this.globSet.map((s) => this.slashSplit(s));
        this.globParts = this.preprocess(rawGlobParts);
        this.debug(this.pattern, this.globParts);
        let set = this.globParts.map((s, _, __) => {
          if (this.isWindows && this.windowsNoMagicRoot) {
            const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && !globMagic.test(s[3]);
            const isDrive = /^[a-z]:/i.test(s[0]);
            if (isUNC) {
              return [...s.slice(0, 4), ...s.slice(4).map((ss) => this.parse(ss))];
            } else if (isDrive) {
              return [s[0], ...s.slice(1).map((ss) => this.parse(ss))];
            }
          }
          return s.map((ss) => this.parse(ss));
        });
        this.debug(this.pattern, set);
        this.set = set.filter((s) => s.indexOf(false) === -1);
        if (this.isWindows) {
          for (let i = 0; i < this.set.length; i++) {
            const p = this.set[i];
            if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && typeof p[3] === "string" && /^[a-z]:$/i.test(p[3])) {
              p[2] = "?";
            }
          }
        }
        this.debug(this.pattern, this.set);
      }
      // various transforms to equivalent pattern sets that are
      // faster to process in a filesystem walk.  The goal is to
      // eliminate what we can, and push all ** patterns as far
      // to the right as possible, even if it increases the number
      // of patterns that we have to process.
      preprocess(globParts) {
        if (this.options.noglobstar) {
          for (let i = 0; i < globParts.length; i++) {
            for (let j = 0; j < globParts[i].length; j++) {
              if (globParts[i][j] === "**") {
                globParts[i][j] = "*";
              }
            }
          }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
          globParts = this.firstPhasePreProcess(globParts);
          globParts = this.secondPhasePreProcess(globParts);
        } else if (optimizationLevel >= 1) {
          globParts = this.levelOneOptimize(globParts);
        } else {
          globParts = this.adjascentGlobstarOptimize(globParts);
        }
        return globParts;
      }
      // just get rid of adjascent ** portions
      adjascentGlobstarOptimize(globParts) {
        return globParts.map((parts) => {
          let gs = -1;
          while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
            let i = gs;
            while (parts[i + 1] === "**") {
              i++;
            }
            if (i !== gs) {
              parts.splice(gs, i - gs);
            }
          }
          return parts;
        });
      }
      // get rid of adjascent ** and resolve .. portions
      levelOneOptimize(globParts) {
        return globParts.map((parts) => {
          parts = parts.reduce((set, part) => {
            const prev = set[set.length - 1];
            if (part === "**" && prev === "**") {
              return set;
            }
            if (part === "..") {
              if (prev && prev !== ".." && prev !== "." && prev !== "**") {
                set.pop();
                return set;
              }
            }
            set.push(part);
            return set;
          }, []);
          return parts.length === 0 ? [""] : parts;
        });
      }
      levelTwoFileOptimize(parts) {
        if (!Array.isArray(parts)) {
          parts = this.slashSplit(parts);
        }
        let didSomething = false;
        do {
          didSomething = false;
          if (!this.preserveMultipleSlashes) {
            for (let i = 1; i < parts.length - 1; i++) {
              const p = parts[i];
              if (i === 1 && p === "" && parts[0] === "")
                continue;
              if (p === "." || p === "") {
                didSomething = true;
                parts.splice(i, 1);
                i--;
              }
            }
            if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
              didSomething = true;
              parts.pop();
            }
          }
          let dd = 0;
          while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
            const p = parts[dd - 1];
            if (p && p !== "." && p !== ".." && p !== "**") {
              didSomething = true;
              parts.splice(dd - 1, 2);
              dd -= 2;
            }
          }
        } while (didSomething);
        return parts.length === 0 ? [""] : parts;
      }
      // First phase: single-pattern processing
      // <pre> is 1 or more portions
      // <rest> is 1 or more portions
      // <p> is any portion other than ., .., '', or **
      // <e> is . or ''
      //
      // **/.. is *brutal* for filesystem walking performance, because
      // it effectively resets the recursive walk each time it occurs,
      // and ** cannot be reduced out by a .. pattern part like a regexp
      // or most strings (other than .., ., and '') can be.
      //
      // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
      // <pre>/<e>/<rest> -> <pre>/<rest>
      // <pre>/<p>/../<rest> -> <pre>/<rest>
      // **/**/<rest> -> **/<rest>
      //
      // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
      // this WOULD be allowed if ** did follow symlinks, or * didn't
      firstPhasePreProcess(globParts) {
        let didSomething = false;
        do {
          didSomething = false;
          for (let parts of globParts) {
            let gs = -1;
            while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
              let gss = gs;
              while (parts[gss + 1] === "**") {
                gss++;
              }
              if (gss > gs) {
                parts.splice(gs + 1, gss - gs);
              }
              let next = parts[gs + 1];
              const p = parts[gs + 2];
              const p2 = parts[gs + 3];
              if (next !== "..")
                continue;
              if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
                continue;
              }
              didSomething = true;
              parts.splice(gs, 1);
              const other = parts.slice(0);
              other[gs] = "**";
              globParts.push(other);
              gs--;
            }
            if (!this.preserveMultipleSlashes) {
              for (let i = 1; i < parts.length - 1; i++) {
                const p = parts[i];
                if (i === 1 && p === "" && parts[0] === "")
                  continue;
                if (p === "." || p === "") {
                  didSomething = true;
                  parts.splice(i, 1);
                  i--;
                }
              }
              if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
                didSomething = true;
                parts.pop();
              }
            }
            let dd = 0;
            while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
              const p = parts[dd - 1];
              if (p && p !== "." && p !== ".." && p !== "**") {
                didSomething = true;
                const needDot = dd === 1 && parts[dd + 1] === "**";
                const splin = needDot ? ["."] : [];
                parts.splice(dd - 1, 2, ...splin);
                if (parts.length === 0)
                  parts.push("");
                dd -= 2;
              }
            }
          }
        } while (didSomething);
        return globParts;
      }
      // second phase: multi-pattern dedupes
      // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
      // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
      // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
      //
      // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
      // ^-- not valid because ** doens't follow symlinks
      secondPhasePreProcess(globParts) {
        for (let i = 0; i < globParts.length - 1; i++) {
          for (let j = i + 1; j < globParts.length; j++) {
            const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
            if (matched) {
              globParts[i] = [];
              globParts[j] = matched;
              break;
            }
          }
        }
        return globParts.filter((gs) => gs.length);
      }
      partsMatch(a, b, emptyGSMatch = false) {
        let ai = 0;
        let bi = 0;
        let result = [];
        let which = "";
        while (ai < a.length && bi < b.length) {
          if (a[ai] === b[bi]) {
            result.push(which === "b" ? b[bi] : a[ai]);
            ai++;
            bi++;
          } else if (emptyGSMatch && a[ai] === "**" && b[bi] === a[ai + 1]) {
            result.push(a[ai]);
            ai++;
          } else if (emptyGSMatch && b[bi] === "**" && a[ai] === b[bi + 1]) {
            result.push(b[bi]);
            bi++;
          } else if (a[ai] === "*" && b[bi] && (this.options.dot || !b[bi].startsWith(".")) && b[bi] !== "**") {
            if (which === "b")
              return false;
            which = "a";
            result.push(a[ai]);
            ai++;
            bi++;
          } else if (b[bi] === "*" && a[ai] && (this.options.dot || !a[ai].startsWith(".")) && a[ai] !== "**") {
            if (which === "a")
              return false;
            which = "b";
            result.push(b[bi]);
            ai++;
            bi++;
          } else {
            return false;
          }
        }
        return a.length === b.length && result;
      }
      parseNegate() {
        if (this.nonegate)
          return;
        const pattern2 = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i = 0; i < pattern2.length && pattern2.charAt(i) === "!"; i++) {
          negate = !negate;
          negateOffset++;
        }
        if (negateOffset)
          this.pattern = pattern2.slice(negateOffset);
        this.negate = negate;
      }
      // set partial to true to test if, for example,
      // "/a/b" matches the start of "/*/b/*/d"
      // Partial means, if you run out of file before you run
      // out of pattern, then that's fine, as long as all
      // the parts match.
      matchOne(file, pattern2, partial = false) {
        let fileStartIndex = 0;
        let patternStartIndex = 0;
        if (this.isWindows) {
          const fileDrive = typeof file[0] === "string" && /^[a-z]:$/i.test(file[0]);
          const fileUNC = !fileDrive && file[0] === "" && file[1] === "" && file[2] === "?" && /^[a-z]:$/i.test(file[3]);
          const patternDrive = typeof pattern2[0] === "string" && /^[a-z]:$/i.test(pattern2[0]);
          const patternUNC = !patternDrive && pattern2[0] === "" && pattern2[1] === "" && pattern2[2] === "?" && typeof pattern2[3] === "string" && /^[a-z]:$/i.test(pattern2[3]);
          const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
          const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
          if (typeof fdi === "number" && typeof pdi === "number") {
            const [fd, pd] = [
              file[fdi],
              pattern2[pdi]
            ];
            if (fd.toLowerCase() === pd.toLowerCase()) {
              pattern2[pdi] = fd;
              patternStartIndex = pdi;
              fileStartIndex = fdi;
            }
          }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
          file = this.levelTwoFileOptimize(file);
        }
        if (pattern2.includes(exports2.GLOBSTAR)) {
          return this.#matchGlobstar(file, pattern2, partial, fileStartIndex, patternStartIndex);
        }
        return this.#matchOne(file, pattern2, partial, fileStartIndex, patternStartIndex);
      }
      #matchGlobstar(file, pattern2, partial, fileIndex, patternIndex) {
        const firstgs = pattern2.indexOf(exports2.GLOBSTAR, patternIndex);
        const lastgs = pattern2.lastIndexOf(exports2.GLOBSTAR);
        const [head, body, tail] = partial ? [
          pattern2.slice(patternIndex, firstgs),
          pattern2.slice(firstgs + 1),
          []
        ] : [
          pattern2.slice(patternIndex, firstgs),
          pattern2.slice(firstgs + 1, lastgs),
          pattern2.slice(lastgs + 1)
        ];
        if (head.length) {
          const fileHead = file.slice(fileIndex, fileIndex + head.length);
          if (!this.#matchOne(fileHead, head, partial, 0, 0))
            return false;
          fileIndex += head.length;
        }
        let fileTailMatch = 0;
        if (tail.length) {
          if (tail.length + fileIndex > file.length)
            return false;
          let tailStart = file.length - tail.length;
          if (this.#matchOne(file, tail, partial, tailStart, 0)) {
            fileTailMatch = tail.length;
          } else {
            if (file[file.length - 1] !== "" || fileIndex + tail.length === file.length) {
              return false;
            }
            tailStart--;
            if (!this.#matchOne(file, tail, partial, tailStart, 0))
              return false;
            fileTailMatch = tail.length + 1;
          }
        }
        if (!body.length) {
          let sawSome = !!fileTailMatch;
          for (let i2 = fileIndex; i2 < file.length - fileTailMatch; i2++) {
            const f = String(file[i2]);
            sawSome = true;
            if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
              return false;
            }
          }
          return partial || sawSome;
        }
        const bodySegments = [[[], 0]];
        let currentBody = bodySegments[0];
        let nonGsParts = 0;
        const nonGsPartsSums = [0];
        for (const b of body) {
          if (b === exports2.GLOBSTAR) {
            nonGsPartsSums.push(nonGsParts);
            currentBody = [[], 0];
            bodySegments.push(currentBody);
          } else {
            currentBody[0].push(b);
            nonGsParts++;
          }
        }
        let i = bodySegments.length - 1;
        const fileLength = file.length - fileTailMatch;
        for (const b of bodySegments) {
          b[1] = fileLength - (nonGsPartsSums[i--] + b[0].length);
        }
        return !!this.#matchGlobStarBodySections(file, bodySegments, fileIndex, 0, partial, 0, !!fileTailMatch);
      }
      #matchGlobStarBodySections(file, bodySegments, fileIndex, bodyIndex, partial, globStarDepth, sawTail) {
        const bs = bodySegments[bodyIndex];
        if (!bs) {
          for (let i = fileIndex; i < file.length; i++) {
            sawTail = true;
            const f = file[i];
            if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
              return false;
            }
          }
          return sawTail;
        }
        const [body, after] = bs;
        while (fileIndex <= after) {
          const m = this.#matchOne(file.slice(0, fileIndex + body.length), body, partial, fileIndex, 0);
          if (m && globStarDepth < this.maxGlobstarRecursion) {
            const sub = this.#matchGlobStarBodySections(file, bodySegments, fileIndex + body.length, bodyIndex + 1, partial, globStarDepth + 1, sawTail);
            if (sub !== false)
              return sub;
          }
          const f = file[fileIndex];
          if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
            return false;
          }
          fileIndex++;
        }
        return partial || null;
      }
      #matchOne(file, pattern2, partial, fileIndex, patternIndex) {
        let fi;
        let pi;
        let pl;
        let fl;
        for (fi = fileIndex, pi = patternIndex, fl = file.length, pl = pattern2.length; fi < fl && pi < pl; fi++, pi++) {
          this.debug("matchOne loop");
          let p = pattern2[pi];
          let f = file[fi];
          this.debug(pattern2, p, f);
          if (p === false || p === exports2.GLOBSTAR)
            return false;
          let hit;
          if (typeof p === "string") {
            hit = f === p;
            this.debug("string match", p, f, hit);
          } else {
            hit = p.test(f);
            this.debug("pattern match", p, f, hit);
          }
          if (!hit)
            return false;
        }
        if (fi === fl && pi === pl) {
          return true;
        } else if (fi === fl) {
          return partial;
        } else if (pi === pl) {
          return fi === fl - 1 && file[fi] === "";
        } else {
          throw new Error("wtf?");
        }
      }
      braceExpand() {
        return (0, exports2.braceExpand)(this.pattern, this.options);
      }
      parse(pattern2) {
        (0, assert_valid_pattern_js_1.assertValidPattern)(pattern2);
        const options = this.options;
        if (pattern2 === "**")
          return exports2.GLOBSTAR;
        if (pattern2 === "")
          return "";
        let m;
        let fastTest = null;
        if (m = pattern2.match(starRE)) {
          fastTest = options.dot ? starTestDot : starTest;
        } else if (m = pattern2.match(starDotExtRE)) {
          fastTest = (options.nocase ? options.dot ? starDotExtTestNocaseDot : starDotExtTestNocase : options.dot ? starDotExtTestDot : starDotExtTest)(m[1]);
        } else if (m = pattern2.match(qmarksRE)) {
          fastTest = (options.nocase ? options.dot ? qmarksTestNocaseDot : qmarksTestNocase : options.dot ? qmarksTestDot : qmarksTest)(m);
        } else if (m = pattern2.match(starDotStarRE)) {
          fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
        } else if (m = pattern2.match(dotStarRE)) {
          fastTest = dotStarTest;
        }
        const re = ast_js_1.AST.fromGlob(pattern2, this.options).toMMPattern();
        if (fastTest && typeof re === "object") {
          Reflect.defineProperty(re, "test", { value: fastTest });
        }
        return re;
      }
      makeRe() {
        if (this.regexp || this.regexp === false)
          return this.regexp;
        const set = this.set;
        if (!set.length) {
          this.regexp = false;
          return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
        const flags = new Set(options.nocase ? ["i"] : []);
        let re = set.map((pattern2) => {
          const pp = pattern2.map((p) => {
            if (p instanceof RegExp) {
              for (const f of p.flags.split(""))
                flags.add(f);
            }
            return typeof p === "string" ? regExpEscape(p) : p === exports2.GLOBSTAR ? exports2.GLOBSTAR : p._src;
          });
          pp.forEach((p, i) => {
            const next = pp[i + 1];
            const prev = pp[i - 1];
            if (p !== exports2.GLOBSTAR || prev === exports2.GLOBSTAR) {
              return;
            }
            if (prev === void 0) {
              if (next !== void 0 && next !== exports2.GLOBSTAR) {
                pp[i + 1] = "(?:\\/|" + twoStar + "\\/)?" + next;
              } else {
                pp[i] = twoStar;
              }
            } else if (next === void 0) {
              pp[i - 1] = prev + "(?:\\/|" + twoStar + ")?";
            } else if (next !== exports2.GLOBSTAR) {
              pp[i - 1] = prev + "(?:\\/|\\/" + twoStar + "\\/)" + next;
              pp[i + 1] = exports2.GLOBSTAR;
            }
          });
          return pp.filter((p) => p !== exports2.GLOBSTAR).join("/");
        }).join("|");
        const [open, close] = set.length > 1 ? ["(?:", ")"] : ["", ""];
        re = "^" + open + re + close + "$";
        if (this.negate)
          re = "^(?!" + re + ").+$";
        try {
          this.regexp = new RegExp(re, [...flags].join(""));
        } catch (ex) {
          this.regexp = false;
        }
        return this.regexp;
      }
      slashSplit(p) {
        if (this.preserveMultipleSlashes) {
          return p.split("/");
        } else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
          return ["", ...p.split(/\/+/)];
        } else {
          return p.split(/\/+/);
        }
      }
      match(f, partial = this.partial) {
        this.debug("match", f, this.pattern);
        if (this.comment) {
          return false;
        }
        if (this.empty) {
          return f === "";
        }
        if (f === "/" && partial) {
          return true;
        }
        const options = this.options;
        if (this.isWindows) {
          f = f.split("\\").join("/");
        }
        const ff = this.slashSplit(f);
        this.debug(this.pattern, "split", ff);
        const set = this.set;
        this.debug(this.pattern, "set", set);
        let filename = ff[ff.length - 1];
        if (!filename) {
          for (let i = ff.length - 2; !filename && i >= 0; i--) {
            filename = ff[i];
          }
        }
        for (let i = 0; i < set.length; i++) {
          const pattern2 = set[i];
          let file = ff;
          if (options.matchBase && pattern2.length === 1) {
            file = [filename];
          }
          const hit = this.matchOne(file, pattern2, partial);
          if (hit) {
            if (options.flipNegate) {
              return true;
            }
            return !this.negate;
          }
        }
        if (options.flipNegate) {
          return false;
        }
        return this.negate;
      }
      static defaults(def) {
        return exports2.minimatch.defaults(def).Minimatch;
      }
    };
    exports2.Minimatch = Minimatch;
    var ast_js_2 = require_ast();
    Object.defineProperty(exports2, "AST", { enumerable: true, get: function() {
      return ast_js_2.AST;
    } });
    var escape_js_2 = require_escape();
    Object.defineProperty(exports2, "escape", { enumerable: true, get: function() {
      return escape_js_2.escape;
    } });
    var unescape_js_2 = require_unescape();
    Object.defineProperty(exports2, "unescape", { enumerable: true, get: function() {
      return unescape_js_2.unescape;
    } });
    exports2.minimatch.AST = ast_js_1.AST;
    exports2.minimatch.Minimatch = Minimatch;
    exports2.minimatch.escape = escape_js_1.escape;
    exports2.minimatch.unescape = unescape_js_1.unescape;
  }
});

// node_modules/lru-cache/dist/commonjs/index.js
var require_commonjs2 = __commonJS({
  "node_modules/lru-cache/dist/commonjs/index.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LRUCache = void 0;
    var perf = typeof performance === "object" && performance && typeof performance.now === "function" ? performance : Date;
    var warned = /* @__PURE__ */ new Set();
    var PROCESS = typeof process === "object" && !!process ? process : {};
    var emitWarning = (msg, type, code, fn) => {
      typeof PROCESS.emitWarning === "function" ? PROCESS.emitWarning(msg, type, code, fn) : console.error(`[${code}] ${type}: ${msg}`);
    };
    var AC = globalThis.AbortController;
    var AS = globalThis.AbortSignal;
    if (typeof AC === "undefined") {
      AS = class AbortSignal {
        onabort;
        _onabort = [];
        reason;
        aborted = false;
        addEventListener(_, fn) {
          this._onabort.push(fn);
        }
      };
      AC = class AbortController {
        constructor() {
          warnACPolyfill();
        }
        signal = new AS();
        abort(reason) {
          if (this.signal.aborted)
            return;
          this.signal.reason = reason;
          this.signal.aborted = true;
          for (const fn of this.signal._onabort) {
            fn(reason);
          }
          this.signal.onabort?.(reason);
        }
      };
      let printACPolyfillWarning = PROCESS.env?.LRU_CACHE_IGNORE_AC_WARNING !== "1";
      const warnACPolyfill = () => {
        if (!printACPolyfillWarning)
          return;
        printACPolyfillWarning = false;
        emitWarning("AbortController is not defined. If using lru-cache in node 14, load an AbortController polyfill from the `node-abort-controller` package. A minimal polyfill is provided for use by LRUCache.fetch(), but it should not be relied upon in other contexts (eg, passing it to other APIs that use AbortController/AbortSignal might have undesirable effects). You may disable this with LRU_CACHE_IGNORE_AC_WARNING=1 in the env.", "NO_ABORT_CONTROLLER", "ENOTSUP", warnACPolyfill);
      };
    }
    var shouldWarn = (code) => !warned.has(code);
    var isPosInt = (n) => n && n === Math.floor(n) && n > 0 && isFinite(n);
    var getUintArray = (max) => !isPosInt(max) ? null : max <= Math.pow(2, 8) ? Uint8Array : max <= Math.pow(2, 16) ? Uint16Array : max <= Math.pow(2, 32) ? Uint32Array : max <= Number.MAX_SAFE_INTEGER ? ZeroArray : null;
    var ZeroArray = class extends Array {
      constructor(size) {
        super(size);
        this.fill(0);
      }
    };
    var Stack = class _Stack {
      heap;
      length;
      // private constructor
      static #constructing = false;
      static create(max) {
        const HeapCls = getUintArray(max);
        if (!HeapCls)
          return [];
        _Stack.#constructing = true;
        const s = new _Stack(max, HeapCls);
        _Stack.#constructing = false;
        return s;
      }
      constructor(max, HeapCls) {
        if (!_Stack.#constructing) {
          throw new TypeError("instantiate Stack using Stack.create(n)");
        }
        this.heap = new HeapCls(max);
        this.length = 0;
      }
      push(n) {
        this.heap[this.length++] = n;
      }
      pop() {
        return this.heap[--this.length];
      }
    };
    var LRUCache = class _LRUCache {
      // options that cannot be changed without disaster
      #max;
      #maxSize;
      #dispose;
      #disposeAfter;
      #fetchMethod;
      #memoMethod;
      /**
       * {@link LRUCache.OptionsBase.ttl}
       */
      ttl;
      /**
       * {@link LRUCache.OptionsBase.ttlResolution}
       */
      ttlResolution;
      /**
       * {@link LRUCache.OptionsBase.ttlAutopurge}
       */
      ttlAutopurge;
      /**
       * {@link LRUCache.OptionsBase.updateAgeOnGet}
       */
      updateAgeOnGet;
      /**
       * {@link LRUCache.OptionsBase.updateAgeOnHas}
       */
      updateAgeOnHas;
      /**
       * {@link LRUCache.OptionsBase.allowStale}
       */
      allowStale;
      /**
       * {@link LRUCache.OptionsBase.noDisposeOnSet}
       */
      noDisposeOnSet;
      /**
       * {@link LRUCache.OptionsBase.noUpdateTTL}
       */
      noUpdateTTL;
      /**
       * {@link LRUCache.OptionsBase.maxEntrySize}
       */
      maxEntrySize;
      /**
       * {@link LRUCache.OptionsBase.sizeCalculation}
       */
      sizeCalculation;
      /**
       * {@link LRUCache.OptionsBase.noDeleteOnFetchRejection}
       */
      noDeleteOnFetchRejection;
      /**
       * {@link LRUCache.OptionsBase.noDeleteOnStaleGet}
       */
      noDeleteOnStaleGet;
      /**
       * {@link LRUCache.OptionsBase.allowStaleOnFetchAbort}
       */
      allowStaleOnFetchAbort;
      /**
       * {@link LRUCache.OptionsBase.allowStaleOnFetchRejection}
       */
      allowStaleOnFetchRejection;
      /**
       * {@link LRUCache.OptionsBase.ignoreFetchAbort}
       */
      ignoreFetchAbort;
      // computed properties
      #size;
      #calculatedSize;
      #keyMap;
      #keyList;
      #valList;
      #next;
      #prev;
      #head;
      #tail;
      #free;
      #disposed;
      #sizes;
      #starts;
      #ttls;
      #hasDispose;
      #hasFetchMethod;
      #hasDisposeAfter;
      /**
       * Do not call this method unless you need to inspect the
       * inner workings of the cache.  If anything returned by this
       * object is modified in any way, strange breakage may occur.
       *
       * These fields are private for a reason!
       *
       * @internal
       */
      static unsafeExposeInternals(c) {
        return {
          // properties
          starts: c.#starts,
          ttls: c.#ttls,
          sizes: c.#sizes,
          keyMap: c.#keyMap,
          keyList: c.#keyList,
          valList: c.#valList,
          next: c.#next,
          prev: c.#prev,
          get head() {
            return c.#head;
          },
          get tail() {
            return c.#tail;
          },
          free: c.#free,
          // methods
          isBackgroundFetch: (p) => c.#isBackgroundFetch(p),
          backgroundFetch: (k, index, options, context) => c.#backgroundFetch(k, index, options, context),
          moveToTail: (index) => c.#moveToTail(index),
          indexes: (options) => c.#indexes(options),
          rindexes: (options) => c.#rindexes(options),
          isStale: (index) => c.#isStale(index)
        };
      }
      // Protected read-only members
      /**
       * {@link LRUCache.OptionsBase.max} (read-only)
       */
      get max() {
        return this.#max;
      }
      /**
       * {@link LRUCache.OptionsBase.maxSize} (read-only)
       */
      get maxSize() {
        return this.#maxSize;
      }
      /**
       * The total computed size of items in the cache (read-only)
       */
      get calculatedSize() {
        return this.#calculatedSize;
      }
      /**
       * The number of items stored in the cache (read-only)
       */
      get size() {
        return this.#size;
      }
      /**
       * {@link LRUCache.OptionsBase.fetchMethod} (read-only)
       */
      get fetchMethod() {
        return this.#fetchMethod;
      }
      get memoMethod() {
        return this.#memoMethod;
      }
      /**
       * {@link LRUCache.OptionsBase.dispose} (read-only)
       */
      get dispose() {
        return this.#dispose;
      }
      /**
       * {@link LRUCache.OptionsBase.disposeAfter} (read-only)
       */
      get disposeAfter() {
        return this.#disposeAfter;
      }
      constructor(options) {
        const { max = 0, ttl, ttlResolution = 1, ttlAutopurge, updateAgeOnGet, updateAgeOnHas, allowStale, dispose, disposeAfter, noDisposeOnSet, noUpdateTTL, maxSize = 0, maxEntrySize = 0, sizeCalculation, fetchMethod, memoMethod, noDeleteOnFetchRejection, noDeleteOnStaleGet, allowStaleOnFetchRejection, allowStaleOnFetchAbort, ignoreFetchAbort } = options;
        if (max !== 0 && !isPosInt(max)) {
          throw new TypeError("max option must be a nonnegative integer");
        }
        const UintArray = max ? getUintArray(max) : Array;
        if (!UintArray) {
          throw new Error("invalid max value: " + max);
        }
        this.#max = max;
        this.#maxSize = maxSize;
        this.maxEntrySize = maxEntrySize || this.#maxSize;
        this.sizeCalculation = sizeCalculation;
        if (this.sizeCalculation) {
          if (!this.#maxSize && !this.maxEntrySize) {
            throw new TypeError("cannot set sizeCalculation without setting maxSize or maxEntrySize");
          }
          if (typeof this.sizeCalculation !== "function") {
            throw new TypeError("sizeCalculation set to non-function");
          }
        }
        if (memoMethod !== void 0 && typeof memoMethod !== "function") {
          throw new TypeError("memoMethod must be a function if defined");
        }
        this.#memoMethod = memoMethod;
        if (fetchMethod !== void 0 && typeof fetchMethod !== "function") {
          throw new TypeError("fetchMethod must be a function if specified");
        }
        this.#fetchMethod = fetchMethod;
        this.#hasFetchMethod = !!fetchMethod;
        this.#keyMap = /* @__PURE__ */ new Map();
        this.#keyList = new Array(max).fill(void 0);
        this.#valList = new Array(max).fill(void 0);
        this.#next = new UintArray(max);
        this.#prev = new UintArray(max);
        this.#head = 0;
        this.#tail = 0;
        this.#free = Stack.create(max);
        this.#size = 0;
        this.#calculatedSize = 0;
        if (typeof dispose === "function") {
          this.#dispose = dispose;
        }
        if (typeof disposeAfter === "function") {
          this.#disposeAfter = disposeAfter;
          this.#disposed = [];
        } else {
          this.#disposeAfter = void 0;
          this.#disposed = void 0;
        }
        this.#hasDispose = !!this.#dispose;
        this.#hasDisposeAfter = !!this.#disposeAfter;
        this.noDisposeOnSet = !!noDisposeOnSet;
        this.noUpdateTTL = !!noUpdateTTL;
        this.noDeleteOnFetchRejection = !!noDeleteOnFetchRejection;
        this.allowStaleOnFetchRejection = !!allowStaleOnFetchRejection;
        this.allowStaleOnFetchAbort = !!allowStaleOnFetchAbort;
        this.ignoreFetchAbort = !!ignoreFetchAbort;
        if (this.maxEntrySize !== 0) {
          if (this.#maxSize !== 0) {
            if (!isPosInt(this.#maxSize)) {
              throw new TypeError("maxSize must be a positive integer if specified");
            }
          }
          if (!isPosInt(this.maxEntrySize)) {
            throw new TypeError("maxEntrySize must be a positive integer if specified");
          }
          this.#initializeSizeTracking();
        }
        this.allowStale = !!allowStale;
        this.noDeleteOnStaleGet = !!noDeleteOnStaleGet;
        this.updateAgeOnGet = !!updateAgeOnGet;
        this.updateAgeOnHas = !!updateAgeOnHas;
        this.ttlResolution = isPosInt(ttlResolution) || ttlResolution === 0 ? ttlResolution : 1;
        this.ttlAutopurge = !!ttlAutopurge;
        this.ttl = ttl || 0;
        if (this.ttl) {
          if (!isPosInt(this.ttl)) {
            throw new TypeError("ttl must be a positive integer if specified");
          }
          this.#initializeTTLTracking();
        }
        if (this.#max === 0 && this.ttl === 0 && this.#maxSize === 0) {
          throw new TypeError("At least one of max, maxSize, or ttl is required");
        }
        if (!this.ttlAutopurge && !this.#max && !this.#maxSize) {
          const code = "LRU_CACHE_UNBOUNDED";
          if (shouldWarn(code)) {
            warned.add(code);
            const msg = "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.";
            emitWarning(msg, "UnboundedCacheWarning", code, _LRUCache);
          }
        }
      }
      /**
       * Return the number of ms left in the item's TTL. If item is not in cache,
       * returns `0`. Returns `Infinity` if item is in cache without a defined TTL.
       */
      getRemainingTTL(key) {
        return this.#keyMap.has(key) ? Infinity : 0;
      }
      #initializeTTLTracking() {
        const ttls = new ZeroArray(this.#max);
        const starts = new ZeroArray(this.#max);
        this.#ttls = ttls;
        this.#starts = starts;
        this.#setItemTTL = (index, ttl, start = perf.now()) => {
          starts[index] = ttl !== 0 ? start : 0;
          ttls[index] = ttl;
          if (ttl !== 0 && this.ttlAutopurge) {
            const t = setTimeout(() => {
              if (this.#isStale(index)) {
                this.#delete(this.#keyList[index], "expire");
              }
            }, ttl + 1);
            if (t.unref) {
              t.unref();
            }
          }
        };
        this.#updateItemAge = (index) => {
          starts[index] = ttls[index] !== 0 ? perf.now() : 0;
        };
        this.#statusTTL = (status, index) => {
          if (ttls[index]) {
            const ttl = ttls[index];
            const start = starts[index];
            if (!ttl || !start)
              return;
            status.ttl = ttl;
            status.start = start;
            status.now = cachedNow || getNow();
            const age = status.now - start;
            status.remainingTTL = ttl - age;
          }
        };
        let cachedNow = 0;
        const getNow = () => {
          const n = perf.now();
          if (this.ttlResolution > 0) {
            cachedNow = n;
            const t = setTimeout(() => cachedNow = 0, this.ttlResolution);
            if (t.unref) {
              t.unref();
            }
          }
          return n;
        };
        this.getRemainingTTL = (key) => {
          const index = this.#keyMap.get(key);
          if (index === void 0) {
            return 0;
          }
          const ttl = ttls[index];
          const start = starts[index];
          if (!ttl || !start) {
            return Infinity;
          }
          const age = (cachedNow || getNow()) - start;
          return ttl - age;
        };
        this.#isStale = (index) => {
          const s = starts[index];
          const t = ttls[index];
          return !!t && !!s && (cachedNow || getNow()) - s > t;
        };
      }
      // conditionally set private methods related to TTL
      #updateItemAge = () => {
      };
      #statusTTL = () => {
      };
      #setItemTTL = () => {
      };
      /* c8 ignore stop */
      #isStale = () => false;
      #initializeSizeTracking() {
        const sizes = new ZeroArray(this.#max);
        this.#calculatedSize = 0;
        this.#sizes = sizes;
        this.#removeItemSize = (index) => {
          this.#calculatedSize -= sizes[index];
          sizes[index] = 0;
        };
        this.#requireSize = (k, v, size, sizeCalculation) => {
          if (this.#isBackgroundFetch(v)) {
            return 0;
          }
          if (!isPosInt(size)) {
            if (sizeCalculation) {
              if (typeof sizeCalculation !== "function") {
                throw new TypeError("sizeCalculation must be a function");
              }
              size = sizeCalculation(v, k);
              if (!isPosInt(size)) {
                throw new TypeError("sizeCalculation return invalid (expect positive integer)");
              }
            } else {
              throw new TypeError("invalid size value (must be positive integer). When maxSize or maxEntrySize is used, sizeCalculation or size must be set.");
            }
          }
          return size;
        };
        this.#addItemSize = (index, size, status) => {
          sizes[index] = size;
          if (this.#maxSize) {
            const maxSize = this.#maxSize - sizes[index];
            while (this.#calculatedSize > maxSize) {
              this.#evict(true);
            }
          }
          this.#calculatedSize += sizes[index];
          if (status) {
            status.entrySize = size;
            status.totalCalculatedSize = this.#calculatedSize;
          }
        };
      }
      #removeItemSize = (_i) => {
      };
      #addItemSize = (_i, _s, _st) => {
      };
      #requireSize = (_k, _v, size, sizeCalculation) => {
        if (size || sizeCalculation) {
          throw new TypeError("cannot set size without setting maxSize or maxEntrySize on cache");
        }
        return 0;
      };
      *#indexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
          for (let i = this.#tail; true; ) {
            if (!this.#isValidIndex(i)) {
              break;
            }
            if (allowStale || !this.#isStale(i)) {
              yield i;
            }
            if (i === this.#head) {
              break;
            } else {
              i = this.#prev[i];
            }
          }
        }
      }
      *#rindexes({ allowStale = this.allowStale } = {}) {
        if (this.#size) {
          for (let i = this.#head; true; ) {
            if (!this.#isValidIndex(i)) {
              break;
            }
            if (allowStale || !this.#isStale(i)) {
              yield i;
            }
            if (i === this.#tail) {
              break;
            } else {
              i = this.#next[i];
            }
          }
        }
      }
      #isValidIndex(index) {
        return index !== void 0 && this.#keyMap.get(this.#keyList[index]) === index;
      }
      /**
       * Return a generator yielding `[key, value]` pairs,
       * in order from most recently used to least recently used.
       */
      *entries() {
        for (const i of this.#indexes()) {
          if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield [this.#keyList[i], this.#valList[i]];
          }
        }
      }
      /**
       * Inverse order version of {@link LRUCache.entries}
       *
       * Return a generator yielding `[key, value]` pairs,
       * in order from least recently used to most recently used.
       */
      *rentries() {
        for (const i of this.#rindexes()) {
          if (this.#valList[i] !== void 0 && this.#keyList[i] !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield [this.#keyList[i], this.#valList[i]];
          }
        }
      }
      /**
       * Return a generator yielding the keys in the cache,
       * in order from most recently used to least recently used.
       */
      *keys() {
        for (const i of this.#indexes()) {
          const k = this.#keyList[i];
          if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield k;
          }
        }
      }
      /**
       * Inverse order version of {@link LRUCache.keys}
       *
       * Return a generator yielding the keys in the cache,
       * in order from least recently used to most recently used.
       */
      *rkeys() {
        for (const i of this.#rindexes()) {
          const k = this.#keyList[i];
          if (k !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield k;
          }
        }
      }
      /**
       * Return a generator yielding the values in the cache,
       * in order from most recently used to least recently used.
       */
      *values() {
        for (const i of this.#indexes()) {
          const v = this.#valList[i];
          if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield this.#valList[i];
          }
        }
      }
      /**
       * Inverse order version of {@link LRUCache.values}
       *
       * Return a generator yielding the values in the cache,
       * in order from least recently used to most recently used.
       */
      *rvalues() {
        for (const i of this.#rindexes()) {
          const v = this.#valList[i];
          if (v !== void 0 && !this.#isBackgroundFetch(this.#valList[i])) {
            yield this.#valList[i];
          }
        }
      }
      /**
       * Iterating over the cache itself yields the same results as
       * {@link LRUCache.entries}
       */
      [Symbol.iterator]() {
        return this.entries();
      }
      /**
       * A String value that is used in the creation of the default string
       * description of an object. Called by the built-in method
       * `Object.prototype.toString`.
       */
      [Symbol.toStringTag] = "LRUCache";
      /**
       * Find a value for which the supplied fn method returns a truthy value,
       * similar to `Array.find()`. fn is called as `fn(value, key, cache)`.
       */
      find(fn, getOptions = {}) {
        for (const i of this.#indexes()) {
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0)
            continue;
          if (fn(value, this.#keyList[i], this)) {
            return this.get(this.#keyList[i], getOptions);
          }
        }
      }
      /**
       * Call the supplied function on each item in the cache, in order from most
       * recently used to least recently used.
       *
       * `fn` is called as `fn(value, key, cache)`.
       *
       * If `thisp` is provided, function will be called in the `this`-context of
       * the provided object, or the cache if no `thisp` object is provided.
       *
       * Does not update age or recenty of use, or iterate over stale values.
       */
      forEach(fn, thisp = this) {
        for (const i of this.#indexes()) {
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0)
            continue;
          fn.call(thisp, value, this.#keyList[i], this);
        }
      }
      /**
       * The same as {@link LRUCache.forEach} but items are iterated over in
       * reverse order.  (ie, less recently used items are iterated over first.)
       */
      rforEach(fn, thisp = this) {
        for (const i of this.#rindexes()) {
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0)
            continue;
          fn.call(thisp, value, this.#keyList[i], this);
        }
      }
      /**
       * Delete any stale entries. Returns true if anything was removed,
       * false otherwise.
       */
      purgeStale() {
        let deleted = false;
        for (const i of this.#rindexes({ allowStale: true })) {
          if (this.#isStale(i)) {
            this.#delete(this.#keyList[i], "expire");
            deleted = true;
          }
        }
        return deleted;
      }
      /**
       * Get the extended info about a given entry, to get its value, size, and
       * TTL info simultaneously. Returns `undefined` if the key is not present.
       *
       * Unlike {@link LRUCache#dump}, which is designed to be portable and survive
       * serialization, the `start` value is always the current timestamp, and the
       * `ttl` is a calculated remaining time to live (negative if expired).
       *
       * Always returns stale values, if their info is found in the cache, so be
       * sure to check for expirations (ie, a negative {@link LRUCache.Entry#ttl})
       * if relevant.
       */
      info(key) {
        const i = this.#keyMap.get(key);
        if (i === void 0)
          return void 0;
        const v = this.#valList[i];
        const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
        if (value === void 0)
          return void 0;
        const entry = { value };
        if (this.#ttls && this.#starts) {
          const ttl = this.#ttls[i];
          const start = this.#starts[i];
          if (ttl && start) {
            const remain = ttl - (perf.now() - start);
            entry.ttl = remain;
            entry.start = Date.now();
          }
        }
        if (this.#sizes) {
          entry.size = this.#sizes[i];
        }
        return entry;
      }
      /**
       * Return an array of [key, {@link LRUCache.Entry}] tuples which can be
       * passed to {@link LRLUCache#load}.
       *
       * The `start` fields are calculated relative to a portable `Date.now()`
       * timestamp, even if `performance.now()` is available.
       *
       * Stale entries are always included in the `dump`, even if
       * {@link LRUCache.OptionsBase.allowStale} is false.
       *
       * Note: this returns an actual array, not a generator, so it can be more
       * easily passed around.
       */
      dump() {
        const arr = [];
        for (const i of this.#indexes({ allowStale: true })) {
          const key = this.#keyList[i];
          const v = this.#valList[i];
          const value = this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
          if (value === void 0 || key === void 0)
            continue;
          const entry = { value };
          if (this.#ttls && this.#starts) {
            entry.ttl = this.#ttls[i];
            const age = perf.now() - this.#starts[i];
            entry.start = Math.floor(Date.now() - age);
          }
          if (this.#sizes) {
            entry.size = this.#sizes[i];
          }
          arr.unshift([key, entry]);
        }
        return arr;
      }
      /**
       * Reset the cache and load in the items in entries in the order listed.
       *
       * The shape of the resulting cache may be different if the same options are
       * not used in both caches.
       *
       * The `start` fields are assumed to be calculated relative to a portable
       * `Date.now()` timestamp, even if `performance.now()` is available.
       */
      load(arr) {
        this.clear();
        for (const [key, entry] of arr) {
          if (entry.start) {
            const age = Date.now() - entry.start;
            entry.start = perf.now() - age;
          }
          this.set(key, entry.value, entry);
        }
      }
      /**
       * Add a value to the cache.
       *
       * Note: if `undefined` is specified as a value, this is an alias for
       * {@link LRUCache#delete}
       *
       * Fields on the {@link LRUCache.SetOptions} options param will override
       * their corresponding values in the constructor options for the scope
       * of this single `set()` operation.
       *
       * If `start` is provided, then that will set the effective start
       * time for the TTL calculation. Note that this must be a previous
       * value of `performance.now()` if supported, or a previous value of
       * `Date.now()` if not.
       *
       * Options object may also include `size`, which will prevent
       * calling the `sizeCalculation` function and just use the specified
       * number if it is a positive integer, and `noDisposeOnSet` which
       * will prevent calling a `dispose` function in the case of
       * overwrites.
       *
       * If the `size` (or return value of `sizeCalculation`) for a given
       * entry is greater than `maxEntrySize`, then the item will not be
       * added to the cache.
       *
       * Will update the recency of the entry.
       *
       * If the value is `undefined`, then this is an alias for
       * `cache.delete(key)`. `undefined` is never stored in the cache.
       */
      set(k, v, setOptions = {}) {
        if (v === void 0) {
          this.delete(k);
          return this;
        }
        const { ttl = this.ttl, start, noDisposeOnSet = this.noDisposeOnSet, sizeCalculation = this.sizeCalculation, status } = setOptions;
        let { noUpdateTTL = this.noUpdateTTL } = setOptions;
        const size = this.#requireSize(k, v, setOptions.size || 0, sizeCalculation);
        if (this.maxEntrySize && size > this.maxEntrySize) {
          if (status) {
            status.set = "miss";
            status.maxEntrySizeExceeded = true;
          }
          this.#delete(k, "set");
          return this;
        }
        let index = this.#size === 0 ? void 0 : this.#keyMap.get(k);
        if (index === void 0) {
          index = this.#size === 0 ? this.#tail : this.#free.length !== 0 ? this.#free.pop() : this.#size === this.#max ? this.#evict(false) : this.#size;
          this.#keyList[index] = k;
          this.#valList[index] = v;
          this.#keyMap.set(k, index);
          this.#next[this.#tail] = index;
          this.#prev[index] = this.#tail;
          this.#tail = index;
          this.#size++;
          this.#addItemSize(index, size, status);
          if (status)
            status.set = "add";
          noUpdateTTL = false;
        } else {
          this.#moveToTail(index);
          const oldVal = this.#valList[index];
          if (v !== oldVal) {
            if (this.#hasFetchMethod && this.#isBackgroundFetch(oldVal)) {
              oldVal.__abortController.abort(new Error("replaced"));
              const { __staleWhileFetching: s } = oldVal;
              if (s !== void 0 && !noDisposeOnSet) {
                if (this.#hasDispose) {
                  this.#dispose?.(s, k, "set");
                }
                if (this.#hasDisposeAfter) {
                  this.#disposed?.push([s, k, "set"]);
                }
              }
            } else if (!noDisposeOnSet) {
              if (this.#hasDispose) {
                this.#dispose?.(oldVal, k, "set");
              }
              if (this.#hasDisposeAfter) {
                this.#disposed?.push([oldVal, k, "set"]);
              }
            }
            this.#removeItemSize(index);
            this.#addItemSize(index, size, status);
            this.#valList[index] = v;
            if (status) {
              status.set = "replace";
              const oldValue = oldVal && this.#isBackgroundFetch(oldVal) ? oldVal.__staleWhileFetching : oldVal;
              if (oldValue !== void 0)
                status.oldValue = oldValue;
            }
          } else if (status) {
            status.set = "update";
          }
        }
        if (ttl !== 0 && !this.#ttls) {
          this.#initializeTTLTracking();
        }
        if (this.#ttls) {
          if (!noUpdateTTL) {
            this.#setItemTTL(index, ttl, start);
          }
          if (status)
            this.#statusTTL(status, index);
        }
        if (!noDisposeOnSet && this.#hasDisposeAfter && this.#disposed) {
          const dt = this.#disposed;
          let task;
          while (task = dt?.shift()) {
            this.#disposeAfter?.(...task);
          }
        }
        return this;
      }
      /**
       * Evict the least recently used item, returning its value or
       * `undefined` if cache is empty.
       */
      pop() {
        try {
          while (this.#size) {
            const val = this.#valList[this.#head];
            this.#evict(true);
            if (this.#isBackgroundFetch(val)) {
              if (val.__staleWhileFetching) {
                return val.__staleWhileFetching;
              }
            } else if (val !== void 0) {
              return val;
            }
          }
        } finally {
          if (this.#hasDisposeAfter && this.#disposed) {
            const dt = this.#disposed;
            let task;
            while (task = dt?.shift()) {
              this.#disposeAfter?.(...task);
            }
          }
        }
      }
      #evict(free) {
        const head = this.#head;
        const k = this.#keyList[head];
        const v = this.#valList[head];
        if (this.#hasFetchMethod && this.#isBackgroundFetch(v)) {
          v.__abortController.abort(new Error("evicted"));
        } else if (this.#hasDispose || this.#hasDisposeAfter) {
          if (this.#hasDispose) {
            this.#dispose?.(v, k, "evict");
          }
          if (this.#hasDisposeAfter) {
            this.#disposed?.push([v, k, "evict"]);
          }
        }
        this.#removeItemSize(head);
        if (free) {
          this.#keyList[head] = void 0;
          this.#valList[head] = void 0;
          this.#free.push(head);
        }
        if (this.#size === 1) {
          this.#head = this.#tail = 0;
          this.#free.length = 0;
        } else {
          this.#head = this.#next[head];
        }
        this.#keyMap.delete(k);
        this.#size--;
        return head;
      }
      /**
       * Check if a key is in the cache, without updating the recency of use.
       * Will return false if the item is stale, even though it is technically
       * in the cache.
       *
       * Check if a key is in the cache, without updating the recency of
       * use. Age is updated if {@link LRUCache.OptionsBase.updateAgeOnHas} is set
       * to `true` in either the options or the constructor.
       *
       * Will return `false` if the item is stale, even though it is technically in
       * the cache. The difference can be determined (if it matters) by using a
       * `status` argument, and inspecting the `has` field.
       *
       * Will not update item age unless
       * {@link LRUCache.OptionsBase.updateAgeOnHas} is set.
       */
      has(k, hasOptions = {}) {
        const { updateAgeOnHas = this.updateAgeOnHas, status } = hasOptions;
        const index = this.#keyMap.get(k);
        if (index !== void 0) {
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v) && v.__staleWhileFetching === void 0) {
            return false;
          }
          if (!this.#isStale(index)) {
            if (updateAgeOnHas) {
              this.#updateItemAge(index);
            }
            if (status) {
              status.has = "hit";
              this.#statusTTL(status, index);
            }
            return true;
          } else if (status) {
            status.has = "stale";
            this.#statusTTL(status, index);
          }
        } else if (status) {
          status.has = "miss";
        }
        return false;
      }
      /**
       * Like {@link LRUCache#get} but doesn't update recency or delete stale
       * items.
       *
       * Returns `undefined` if the item is stale, unless
       * {@link LRUCache.OptionsBase.allowStale} is set.
       */
      peek(k, peekOptions = {}) {
        const { allowStale = this.allowStale } = peekOptions;
        const index = this.#keyMap.get(k);
        if (index === void 0 || !allowStale && this.#isStale(index)) {
          return;
        }
        const v = this.#valList[index];
        return this.#isBackgroundFetch(v) ? v.__staleWhileFetching : v;
      }
      #backgroundFetch(k, index, options, context) {
        const v = index === void 0 ? void 0 : this.#valList[index];
        if (this.#isBackgroundFetch(v)) {
          return v;
        }
        const ac = new AC();
        const { signal } = options;
        signal?.addEventListener("abort", () => ac.abort(signal.reason), {
          signal: ac.signal
        });
        const fetchOpts = {
          signal: ac.signal,
          options,
          context
        };
        const cb = (v2, updateCache = false) => {
          const { aborted } = ac.signal;
          const ignoreAbort = options.ignoreFetchAbort && v2 !== void 0;
          if (options.status) {
            if (aborted && !updateCache) {
              options.status.fetchAborted = true;
              options.status.fetchError = ac.signal.reason;
              if (ignoreAbort)
                options.status.fetchAbortIgnored = true;
            } else {
              options.status.fetchResolved = true;
            }
          }
          if (aborted && !ignoreAbort && !updateCache) {
            return fetchFail(ac.signal.reason);
          }
          const bf2 = p;
          if (this.#valList[index] === p) {
            if (v2 === void 0) {
              if (bf2.__staleWhileFetching) {
                this.#valList[index] = bf2.__staleWhileFetching;
              } else {
                this.#delete(k, "fetch");
              }
            } else {
              if (options.status)
                options.status.fetchUpdated = true;
              this.set(k, v2, fetchOpts.options);
            }
          }
          return v2;
        };
        const eb = (er) => {
          if (options.status) {
            options.status.fetchRejected = true;
            options.status.fetchError = er;
          }
          return fetchFail(er);
        };
        const fetchFail = (er) => {
          const { aborted } = ac.signal;
          const allowStaleAborted = aborted && options.allowStaleOnFetchAbort;
          const allowStale = allowStaleAborted || options.allowStaleOnFetchRejection;
          const noDelete = allowStale || options.noDeleteOnFetchRejection;
          const bf2 = p;
          if (this.#valList[index] === p) {
            const del = !noDelete || bf2.__staleWhileFetching === void 0;
            if (del) {
              this.#delete(k, "fetch");
            } else if (!allowStaleAborted) {
              this.#valList[index] = bf2.__staleWhileFetching;
            }
          }
          if (allowStale) {
            if (options.status && bf2.__staleWhileFetching !== void 0) {
              options.status.returnedStale = true;
            }
            return bf2.__staleWhileFetching;
          } else if (bf2.__returned === bf2) {
            throw er;
          }
        };
        const pcall = (res, rej) => {
          const fmp = this.#fetchMethod?.(k, v, fetchOpts);
          if (fmp && fmp instanceof Promise) {
            fmp.then((v2) => res(v2 === void 0 ? void 0 : v2), rej);
          }
          ac.signal.addEventListener("abort", () => {
            if (!options.ignoreFetchAbort || options.allowStaleOnFetchAbort) {
              res(void 0);
              if (options.allowStaleOnFetchAbort) {
                res = (v2) => cb(v2, true);
              }
            }
          });
        };
        if (options.status)
          options.status.fetchDispatched = true;
        const p = new Promise(pcall).then(cb, eb);
        const bf = Object.assign(p, {
          __abortController: ac,
          __staleWhileFetching: v,
          __returned: void 0
        });
        if (index === void 0) {
          this.set(k, bf, { ...fetchOpts.options, status: void 0 });
          index = this.#keyMap.get(k);
        } else {
          this.#valList[index] = bf;
        }
        return bf;
      }
      #isBackgroundFetch(p) {
        if (!this.#hasFetchMethod)
          return false;
        const b = p;
        return !!b && b instanceof Promise && b.hasOwnProperty("__staleWhileFetching") && b.__abortController instanceof AC;
      }
      async fetch(k, fetchOptions = {}) {
        const {
          // get options
          allowStale = this.allowStale,
          updateAgeOnGet = this.updateAgeOnGet,
          noDeleteOnStaleGet = this.noDeleteOnStaleGet,
          // set options
          ttl = this.ttl,
          noDisposeOnSet = this.noDisposeOnSet,
          size = 0,
          sizeCalculation = this.sizeCalculation,
          noUpdateTTL = this.noUpdateTTL,
          // fetch exclusive options
          noDeleteOnFetchRejection = this.noDeleteOnFetchRejection,
          allowStaleOnFetchRejection = this.allowStaleOnFetchRejection,
          ignoreFetchAbort = this.ignoreFetchAbort,
          allowStaleOnFetchAbort = this.allowStaleOnFetchAbort,
          context,
          forceRefresh = false,
          status,
          signal
        } = fetchOptions;
        if (!this.#hasFetchMethod) {
          if (status)
            status.fetch = "get";
          return this.get(k, {
            allowStale,
            updateAgeOnGet,
            noDeleteOnStaleGet,
            status
          });
        }
        const options = {
          allowStale,
          updateAgeOnGet,
          noDeleteOnStaleGet,
          ttl,
          noDisposeOnSet,
          size,
          sizeCalculation,
          noUpdateTTL,
          noDeleteOnFetchRejection,
          allowStaleOnFetchRejection,
          allowStaleOnFetchAbort,
          ignoreFetchAbort,
          status,
          signal
        };
        let index = this.#keyMap.get(k);
        if (index === void 0) {
          if (status)
            status.fetch = "miss";
          const p = this.#backgroundFetch(k, index, options, context);
          return p.__returned = p;
        } else {
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            const stale = allowStale && v.__staleWhileFetching !== void 0;
            if (status) {
              status.fetch = "inflight";
              if (stale)
                status.returnedStale = true;
            }
            return stale ? v.__staleWhileFetching : v.__returned = v;
          }
          const isStale = this.#isStale(index);
          if (!forceRefresh && !isStale) {
            if (status)
              status.fetch = "hit";
            this.#moveToTail(index);
            if (updateAgeOnGet) {
              this.#updateItemAge(index);
            }
            if (status)
              this.#statusTTL(status, index);
            return v;
          }
          const p = this.#backgroundFetch(k, index, options, context);
          const hasStale = p.__staleWhileFetching !== void 0;
          const staleVal = hasStale && allowStale;
          if (status) {
            status.fetch = isStale ? "stale" : "refresh";
            if (staleVal && isStale)
              status.returnedStale = true;
          }
          return staleVal ? p.__staleWhileFetching : p.__returned = p;
        }
      }
      async forceFetch(k, fetchOptions = {}) {
        const v = await this.fetch(k, fetchOptions);
        if (v === void 0)
          throw new Error("fetch() returned undefined");
        return v;
      }
      memo(k, memoOptions = {}) {
        const memoMethod = this.#memoMethod;
        if (!memoMethod) {
          throw new Error("no memoMethod provided to constructor");
        }
        const { context, forceRefresh, ...options } = memoOptions;
        const v = this.get(k, options);
        if (!forceRefresh && v !== void 0)
          return v;
        const vv = memoMethod(k, v, {
          options,
          context
        });
        this.set(k, vv, options);
        return vv;
      }
      /**
       * Return a value from the cache. Will update the recency of the cache
       * entry found.
       *
       * If the key is not found, get() will return `undefined`.
       */
      get(k, getOptions = {}) {
        const { allowStale = this.allowStale, updateAgeOnGet = this.updateAgeOnGet, noDeleteOnStaleGet = this.noDeleteOnStaleGet, status } = getOptions;
        const index = this.#keyMap.get(k);
        if (index !== void 0) {
          const value = this.#valList[index];
          const fetching = this.#isBackgroundFetch(value);
          if (status)
            this.#statusTTL(status, index);
          if (this.#isStale(index)) {
            if (status)
              status.get = "stale";
            if (!fetching) {
              if (!noDeleteOnStaleGet) {
                this.#delete(k, "expire");
              }
              if (status && allowStale)
                status.returnedStale = true;
              return allowStale ? value : void 0;
            } else {
              if (status && allowStale && value.__staleWhileFetching !== void 0) {
                status.returnedStale = true;
              }
              return allowStale ? value.__staleWhileFetching : void 0;
            }
          } else {
            if (status)
              status.get = "hit";
            if (fetching) {
              return value.__staleWhileFetching;
            }
            this.#moveToTail(index);
            if (updateAgeOnGet) {
              this.#updateItemAge(index);
            }
            return value;
          }
        } else if (status) {
          status.get = "miss";
        }
      }
      #connect(p, n) {
        this.#prev[n] = p;
        this.#next[p] = n;
      }
      #moveToTail(index) {
        if (index !== this.#tail) {
          if (index === this.#head) {
            this.#head = this.#next[index];
          } else {
            this.#connect(this.#prev[index], this.#next[index]);
          }
          this.#connect(this.#tail, index);
          this.#tail = index;
        }
      }
      /**
       * Deletes a key out of the cache.
       *
       * Returns true if the key was deleted, false otherwise.
       */
      delete(k) {
        return this.#delete(k, "delete");
      }
      #delete(k, reason) {
        let deleted = false;
        if (this.#size !== 0) {
          const index = this.#keyMap.get(k);
          if (index !== void 0) {
            deleted = true;
            if (this.#size === 1) {
              this.#clear(reason);
            } else {
              this.#removeItemSize(index);
              const v = this.#valList[index];
              if (this.#isBackgroundFetch(v)) {
                v.__abortController.abort(new Error("deleted"));
              } else if (this.#hasDispose || this.#hasDisposeAfter) {
                if (this.#hasDispose) {
                  this.#dispose?.(v, k, reason);
                }
                if (this.#hasDisposeAfter) {
                  this.#disposed?.push([v, k, reason]);
                }
              }
              this.#keyMap.delete(k);
              this.#keyList[index] = void 0;
              this.#valList[index] = void 0;
              if (index === this.#tail) {
                this.#tail = this.#prev[index];
              } else if (index === this.#head) {
                this.#head = this.#next[index];
              } else {
                const pi = this.#prev[index];
                this.#next[pi] = this.#next[index];
                const ni = this.#next[index];
                this.#prev[ni] = this.#prev[index];
              }
              this.#size--;
              this.#free.push(index);
            }
          }
        }
        if (this.#hasDisposeAfter && this.#disposed?.length) {
          const dt = this.#disposed;
          let task;
          while (task = dt?.shift()) {
            this.#disposeAfter?.(...task);
          }
        }
        return deleted;
      }
      /**
       * Clear the cache entirely, throwing away all values.
       */
      clear() {
        return this.#clear("delete");
      }
      #clear(reason) {
        for (const index of this.#rindexes({ allowStale: true })) {
          const v = this.#valList[index];
          if (this.#isBackgroundFetch(v)) {
            v.__abortController.abort(new Error("deleted"));
          } else {
            const k = this.#keyList[index];
            if (this.#hasDispose) {
              this.#dispose?.(v, k, reason);
            }
            if (this.#hasDisposeAfter) {
              this.#disposed?.push([v, k, reason]);
            }
          }
        }
        this.#keyMap.clear();
        this.#valList.fill(void 0);
        this.#keyList.fill(void 0);
        if (this.#ttls && this.#starts) {
          this.#ttls.fill(0);
          this.#starts.fill(0);
        }
        if (this.#sizes) {
          this.#sizes.fill(0);
        }
        this.#head = 0;
        this.#tail = 0;
        this.#free.length = 0;
        this.#calculatedSize = 0;
        this.#size = 0;
        if (this.#hasDisposeAfter && this.#disposed) {
          const dt = this.#disposed;
          let task;
          while (task = dt?.shift()) {
            this.#disposeAfter?.(...task);
          }
        }
      }
    };
    exports2.LRUCache = LRUCache;
  }
});

// node_modules/minipass/dist/commonjs/index.js
var require_commonjs3 = __commonJS({
  "node_modules/minipass/dist/commonjs/index.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    var __importDefault = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Minipass = exports2.isWritable = exports2.isReadable = exports2.isStream = void 0;
    var proc = typeof process === "object" && process ? process : {
      stdout: null,
      stderr: null
    };
    var node_events_1 = require("node:events");
    var node_stream_1 = __importDefault(require("node:stream"));
    var node_string_decoder_1 = require("node:string_decoder");
    var isStream = (s) => !!s && typeof s === "object" && (s instanceof Minipass || s instanceof node_stream_1.default || (0, exports2.isReadable)(s) || (0, exports2.isWritable)(s));
    exports2.isStream = isStream;
    var isReadable = (s) => !!s && typeof s === "object" && s instanceof node_events_1.EventEmitter && typeof s.pipe === "function" && // node core Writable streams have a pipe() method, but it throws
    s.pipe !== node_stream_1.default.Writable.prototype.pipe;
    exports2.isReadable = isReadable;
    var isWritable = (s) => !!s && typeof s === "object" && s instanceof node_events_1.EventEmitter && typeof s.write === "function" && typeof s.end === "function";
    exports2.isWritable = isWritable;
    var EOF = /* @__PURE__ */ Symbol("EOF");
    var MAYBE_EMIT_END = /* @__PURE__ */ Symbol("maybeEmitEnd");
    var EMITTED_END = /* @__PURE__ */ Symbol("emittedEnd");
    var EMITTING_END = /* @__PURE__ */ Symbol("emittingEnd");
    var EMITTED_ERROR = /* @__PURE__ */ Symbol("emittedError");
    var CLOSED = /* @__PURE__ */ Symbol("closed");
    var READ = /* @__PURE__ */ Symbol("read");
    var FLUSH = /* @__PURE__ */ Symbol("flush");
    var FLUSHCHUNK = /* @__PURE__ */ Symbol("flushChunk");
    var ENCODING = /* @__PURE__ */ Symbol("encoding");
    var DECODER = /* @__PURE__ */ Symbol("decoder");
    var FLOWING = /* @__PURE__ */ Symbol("flowing");
    var PAUSED = /* @__PURE__ */ Symbol("paused");
    var RESUME = /* @__PURE__ */ Symbol("resume");
    var BUFFER = /* @__PURE__ */ Symbol("buffer");
    var PIPES = /* @__PURE__ */ Symbol("pipes");
    var BUFFERLENGTH = /* @__PURE__ */ Symbol("bufferLength");
    var BUFFERPUSH = /* @__PURE__ */ Symbol("bufferPush");
    var BUFFERSHIFT = /* @__PURE__ */ Symbol("bufferShift");
    var OBJECTMODE = /* @__PURE__ */ Symbol("objectMode");
    var DESTROYED = /* @__PURE__ */ Symbol("destroyed");
    var ERROR = /* @__PURE__ */ Symbol("error");
    var EMITDATA = /* @__PURE__ */ Symbol("emitData");
    var EMITEND = /* @__PURE__ */ Symbol("emitEnd");
    var EMITEND2 = /* @__PURE__ */ Symbol("emitEnd2");
    var ASYNC = /* @__PURE__ */ Symbol("async");
    var ABORT = /* @__PURE__ */ Symbol("abort");
    var ABORTED = /* @__PURE__ */ Symbol("aborted");
    var SIGNAL = /* @__PURE__ */ Symbol("signal");
    var DATALISTENERS = /* @__PURE__ */ Symbol("dataListeners");
    var DISCARDED = /* @__PURE__ */ Symbol("discarded");
    var defer = (fn) => Promise.resolve().then(fn);
    var nodefer = (fn) => fn();
    var isEndish = (ev) => ev === "end" || ev === "finish" || ev === "prefinish";
    var isArrayBufferLike = (b) => b instanceof ArrayBuffer || !!b && typeof b === "object" && b.constructor && b.constructor.name === "ArrayBuffer" && b.byteLength >= 0;
    var isArrayBufferView = (b) => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);
    var Pipe = class {
      src;
      dest;
      opts;
      ondrain;
      constructor(src, dest, opts) {
        this.src = src;
        this.dest = dest;
        this.opts = opts;
        this.ondrain = () => src[RESUME]();
        this.dest.on("drain", this.ondrain);
      }
      unpipe() {
        this.dest.removeListener("drain", this.ondrain);
      }
      // only here for the prototype
      /* c8 ignore start */
      proxyErrors(_er) {
      }
      /* c8 ignore stop */
      end() {
        this.unpipe();
        if (this.opts.end)
          this.dest.end();
      }
    };
    var PipeProxyErrors = class extends Pipe {
      unpipe() {
        this.src.removeListener("error", this.proxyErrors);
        super.unpipe();
      }
      constructor(src, dest, opts) {
        super(src, dest, opts);
        this.proxyErrors = (er) => this.dest.emit("error", er);
        src.on("error", this.proxyErrors);
      }
    };
    var isObjectModeOptions = (o) => !!o.objectMode;
    var isEncodingOptions = (o) => !o.objectMode && !!o.encoding && o.encoding !== "buffer";
    var Minipass = class extends node_events_1.EventEmitter {
      [FLOWING] = false;
      [PAUSED] = false;
      [PIPES] = [];
      [BUFFER] = [];
      [OBJECTMODE];
      [ENCODING];
      [ASYNC];
      [DECODER];
      [EOF] = false;
      [EMITTED_END] = false;
      [EMITTING_END] = false;
      [CLOSED] = false;
      [EMITTED_ERROR] = null;
      [BUFFERLENGTH] = 0;
      [DESTROYED] = false;
      [SIGNAL];
      [ABORTED] = false;
      [DATALISTENERS] = 0;
      [DISCARDED] = false;
      /**
       * true if the stream can be written
       */
      writable = true;
      /**
       * true if the stream can be read
       */
      readable = true;
      /**
       * If `RType` is Buffer, then options do not need to be provided.
       * Otherwise, an options object must be provided to specify either
       * {@link Minipass.SharedOptions.objectMode} or
       * {@link Minipass.SharedOptions.encoding}, as appropriate.
       */
      constructor(...args) {
        const options = args[0] || {};
        super();
        if (options.objectMode && typeof options.encoding === "string") {
          throw new TypeError("Encoding and objectMode may not be used together");
        }
        if (isObjectModeOptions(options)) {
          this[OBJECTMODE] = true;
          this[ENCODING] = null;
        } else if (isEncodingOptions(options)) {
          this[ENCODING] = options.encoding;
          this[OBJECTMODE] = false;
        } else {
          this[OBJECTMODE] = false;
          this[ENCODING] = null;
        }
        this[ASYNC] = !!options.async;
        this[DECODER] = this[ENCODING] ? new node_string_decoder_1.StringDecoder(this[ENCODING]) : null;
        if (options && options.debugExposeBuffer === true) {
          Object.defineProperty(this, "buffer", { get: () => this[BUFFER] });
        }
        if (options && options.debugExposePipes === true) {
          Object.defineProperty(this, "pipes", { get: () => this[PIPES] });
        }
        const { signal } = options;
        if (signal) {
          this[SIGNAL] = signal;
          if (signal.aborted) {
            this[ABORT]();
          } else {
            signal.addEventListener("abort", () => this[ABORT]());
          }
        }
      }
      /**
       * The amount of data stored in the buffer waiting to be read.
       *
       * For Buffer strings, this will be the total byte length.
       * For string encoding streams, this will be the string character length,
       * according to JavaScript's `string.length` logic.
       * For objectMode streams, this is a count of the items waiting to be
       * emitted.
       */
      get bufferLength() {
        return this[BUFFERLENGTH];
      }
      /**
       * The `BufferEncoding` currently in use, or `null`
       */
      get encoding() {
        return this[ENCODING];
      }
      /**
       * @deprecated - This is a read only property
       */
      set encoding(_enc) {
        throw new Error("Encoding must be set at instantiation time");
      }
      /**
       * @deprecated - Encoding may only be set at instantiation time
       */
      setEncoding(_enc) {
        throw new Error("Encoding must be set at instantiation time");
      }
      /**
       * True if this is an objectMode stream
       */
      get objectMode() {
        return this[OBJECTMODE];
      }
      /**
       * @deprecated - This is a read-only property
       */
      set objectMode(_om) {
        throw new Error("objectMode must be set at instantiation time");
      }
      /**
       * true if this is an async stream
       */
      get ["async"]() {
        return this[ASYNC];
      }
      /**
       * Set to true to make this stream async.
       *
       * Once set, it cannot be unset, as this would potentially cause incorrect
       * behavior.  Ie, a sync stream can be made async, but an async stream
       * cannot be safely made sync.
       */
      set ["async"](a) {
        this[ASYNC] = this[ASYNC] || !!a;
      }
      // drop everything and get out of the flow completely
      [ABORT]() {
        this[ABORTED] = true;
        this.emit("abort", this[SIGNAL]?.reason);
        this.destroy(this[SIGNAL]?.reason);
      }
      /**
       * True if the stream has been aborted.
       */
      get aborted() {
        return this[ABORTED];
      }
      /**
       * No-op setter. Stream aborted status is set via the AbortSignal provided
       * in the constructor options.
       */
      set aborted(_) {
      }
      write(chunk, encoding, cb) {
        if (this[ABORTED])
          return false;
        if (this[EOF])
          throw new Error("write after end");
        if (this[DESTROYED]) {
          this.emit("error", Object.assign(new Error("Cannot call write after a stream was destroyed"), { code: "ERR_STREAM_DESTROYED" }));
          return true;
        }
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = "utf8";
        }
        if (!encoding)
          encoding = "utf8";
        const fn = this[ASYNC] ? defer : nodefer;
        if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
          if (isArrayBufferView(chunk)) {
            chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
          } else if (isArrayBufferLike(chunk)) {
            chunk = Buffer.from(chunk);
          } else if (typeof chunk !== "string") {
            throw new Error("Non-contiguous data written to non-objectMode stream");
          }
        }
        if (this[OBJECTMODE]) {
          if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
            this[FLUSH](true);
          if (this[FLOWING])
            this.emit("data", chunk);
          else
            this[BUFFERPUSH](chunk);
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            fn(cb);
          return this[FLOWING];
        }
        if (!chunk.length) {
          if (this[BUFFERLENGTH] !== 0)
            this.emit("readable");
          if (cb)
            fn(cb);
          return this[FLOWING];
        }
        if (typeof chunk === "string" && // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER]?.lastNeed)) {
          chunk = Buffer.from(chunk, encoding);
        }
        if (Buffer.isBuffer(chunk) && this[ENCODING]) {
          chunk = this[DECODER].write(chunk);
        }
        if (this[FLOWING] && this[BUFFERLENGTH] !== 0)
          this[FLUSH](true);
        if (this[FLOWING])
          this.emit("data", chunk);
        else
          this[BUFFERPUSH](chunk);
        if (this[BUFFERLENGTH] !== 0)
          this.emit("readable");
        if (cb)
          fn(cb);
        return this[FLOWING];
      }
      /**
       * Low-level explicit read method.
       *
       * In objectMode, the argument is ignored, and one item is returned if
       * available.
       *
       * `n` is the number of bytes (or in the case of encoding streams,
       * characters) to consume. If `n` is not provided, then the entire buffer
       * is returned, or `null` is returned if no data is available.
       *
       * If `n` is greater that the amount of data in the internal buffer,
       * then `null` is returned.
       */
      read(n) {
        if (this[DESTROYED])
          return null;
        this[DISCARDED] = false;
        if (this[BUFFERLENGTH] === 0 || n === 0 || n && n > this[BUFFERLENGTH]) {
          this[MAYBE_EMIT_END]();
          return null;
        }
        if (this[OBJECTMODE])
          n = null;
        if (this[BUFFER].length > 1 && !this[OBJECTMODE]) {
          this[BUFFER] = [
            this[ENCODING] ? this[BUFFER].join("") : Buffer.concat(this[BUFFER], this[BUFFERLENGTH])
          ];
        }
        const ret = this[READ](n || null, this[BUFFER][0]);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [READ](n, chunk) {
        if (this[OBJECTMODE])
          this[BUFFERSHIFT]();
        else {
          const c = chunk;
          if (n === c.length || n === null)
            this[BUFFERSHIFT]();
          else if (typeof c === "string") {
            this[BUFFER][0] = c.slice(n);
            chunk = c.slice(0, n);
            this[BUFFERLENGTH] -= n;
          } else {
            this[BUFFER][0] = c.subarray(n);
            chunk = c.subarray(0, n);
            this[BUFFERLENGTH] -= n;
          }
        }
        this.emit("data", chunk);
        if (!this[BUFFER].length && !this[EOF])
          this.emit("drain");
        return chunk;
      }
      end(chunk, encoding, cb) {
        if (typeof chunk === "function") {
          cb = chunk;
          chunk = void 0;
        }
        if (typeof encoding === "function") {
          cb = encoding;
          encoding = "utf8";
        }
        if (chunk !== void 0)
          this.write(chunk, encoding);
        if (cb)
          this.once("end", cb);
        this[EOF] = true;
        this.writable = false;
        if (this[FLOWING] || !this[PAUSED])
          this[MAYBE_EMIT_END]();
        return this;
      }
      // don't let the internal resume be overwritten
      [RESUME]() {
        if (this[DESTROYED])
          return;
        if (!this[DATALISTENERS] && !this[PIPES].length) {
          this[DISCARDED] = true;
        }
        this[PAUSED] = false;
        this[FLOWING] = true;
        this.emit("resume");
        if (this[BUFFER].length)
          this[FLUSH]();
        else if (this[EOF])
          this[MAYBE_EMIT_END]();
        else
          this.emit("drain");
      }
      /**
       * Resume the stream if it is currently in a paused state
       *
       * If called when there are no pipe destinations or `data` event listeners,
       * this will place the stream in a "discarded" state, where all data will
       * be thrown away. The discarded state is removed if a pipe destination or
       * data handler is added, if pause() is called, or if any synchronous or
       * asynchronous iteration is started.
       */
      resume() {
        return this[RESUME]();
      }
      /**
       * Pause the stream
       */
      pause() {
        this[FLOWING] = false;
        this[PAUSED] = true;
        this[DISCARDED] = false;
      }
      /**
       * true if the stream has been forcibly destroyed
       */
      get destroyed() {
        return this[DESTROYED];
      }
      /**
       * true if the stream is currently in a flowing state, meaning that
       * any writes will be immediately emitted.
       */
      get flowing() {
        return this[FLOWING];
      }
      /**
       * true if the stream is currently in a paused state
       */
      get paused() {
        return this[PAUSED];
      }
      [BUFFERPUSH](chunk) {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] += 1;
        else
          this[BUFFERLENGTH] += chunk.length;
        this[BUFFER].push(chunk);
      }
      [BUFFERSHIFT]() {
        if (this[OBJECTMODE])
          this[BUFFERLENGTH] -= 1;
        else
          this[BUFFERLENGTH] -= this[BUFFER][0].length;
        return this[BUFFER].shift();
      }
      [FLUSH](noDrain = false) {
        do {
        } while (this[FLUSHCHUNK](this[BUFFERSHIFT]()) && this[BUFFER].length);
        if (!noDrain && !this[BUFFER].length && !this[EOF])
          this.emit("drain");
      }
      [FLUSHCHUNK](chunk) {
        this.emit("data", chunk);
        return this[FLOWING];
      }
      /**
       * Pipe all data emitted by this stream into the destination provided.
       *
       * Triggers the flow of data.
       */
      pipe(dest, opts) {
        if (this[DESTROYED])
          return dest;
        this[DISCARDED] = false;
        const ended = this[EMITTED_END];
        opts = opts || {};
        if (dest === proc.stdout || dest === proc.stderr)
          opts.end = false;
        else
          opts.end = opts.end !== false;
        opts.proxyErrors = !!opts.proxyErrors;
        if (ended) {
          if (opts.end)
            dest.end();
        } else {
          this[PIPES].push(!opts.proxyErrors ? new Pipe(this, dest, opts) : new PipeProxyErrors(this, dest, opts));
          if (this[ASYNC])
            defer(() => this[RESUME]());
          else
            this[RESUME]();
        }
        return dest;
      }
      /**
       * Fully unhook a piped destination stream.
       *
       * If the destination stream was the only consumer of this stream (ie,
       * there are no other piped destinations or `'data'` event listeners)
       * then the flow of data will stop until there is another consumer or
       * {@link Minipass#resume} is explicitly called.
       */
      unpipe(dest) {
        const p = this[PIPES].find((p2) => p2.dest === dest);
        if (p) {
          if (this[PIPES].length === 1) {
            if (this[FLOWING] && this[DATALISTENERS] === 0) {
              this[FLOWING] = false;
            }
            this[PIPES] = [];
          } else
            this[PIPES].splice(this[PIPES].indexOf(p), 1);
          p.unpipe();
        }
      }
      /**
       * Alias for {@link Minipass#on}
       */
      addListener(ev, handler) {
        return this.on(ev, handler);
      }
      /**
       * Mostly identical to `EventEmitter.on`, with the following
       * behavior differences to prevent data loss and unnecessary hangs:
       *
       * - Adding a 'data' event handler will trigger the flow of data
       *
       * - Adding a 'readable' event handler when there is data waiting to be read
       *   will cause 'readable' to be emitted immediately.
       *
       * - Adding an 'endish' event handler ('end', 'finish', etc.) which has
       *   already passed will cause the event to be emitted immediately and all
       *   handlers removed.
       *
       * - Adding an 'error' event handler after an error has been emitted will
       *   cause the event to be re-emitted immediately with the error previously
       *   raised.
       */
      on(ev, handler) {
        const ret = super.on(ev, handler);
        if (ev === "data") {
          this[DISCARDED] = false;
          this[DATALISTENERS]++;
          if (!this[PIPES].length && !this[FLOWING]) {
            this[RESUME]();
          }
        } else if (ev === "readable" && this[BUFFERLENGTH] !== 0) {
          super.emit("readable");
        } else if (isEndish(ev) && this[EMITTED_END]) {
          super.emit(ev);
          this.removeAllListeners(ev);
        } else if (ev === "error" && this[EMITTED_ERROR]) {
          const h = handler;
          if (this[ASYNC])
            defer(() => h.call(this, this[EMITTED_ERROR]));
          else
            h.call(this, this[EMITTED_ERROR]);
        }
        return ret;
      }
      /**
       * Alias for {@link Minipass#off}
       */
      removeListener(ev, handler) {
        return this.off(ev, handler);
      }
      /**
       * Mostly identical to `EventEmitter.off`
       *
       * If a 'data' event handler is removed, and it was the last consumer
       * (ie, there are no pipe destinations or other 'data' event listeners),
       * then the flow of data will stop until there is another consumer or
       * {@link Minipass#resume} is explicitly called.
       */
      off(ev, handler) {
        const ret = super.off(ev, handler);
        if (ev === "data") {
          this[DATALISTENERS] = this.listeners("data").length;
          if (this[DATALISTENERS] === 0 && !this[DISCARDED] && !this[PIPES].length) {
            this[FLOWING] = false;
          }
        }
        return ret;
      }
      /**
       * Mostly identical to `EventEmitter.removeAllListeners`
       *
       * If all 'data' event handlers are removed, and they were the last consumer
       * (ie, there are no pipe destinations), then the flow of data will stop
       * until there is another consumer or {@link Minipass#resume} is explicitly
       * called.
       */
      removeAllListeners(ev) {
        const ret = super.removeAllListeners(ev);
        if (ev === "data" || ev === void 0) {
          this[DATALISTENERS] = 0;
          if (!this[DISCARDED] && !this[PIPES].length) {
            this[FLOWING] = false;
          }
        }
        return ret;
      }
      /**
       * true if the 'end' event has been emitted
       */
      get emittedEnd() {
        return this[EMITTED_END];
      }
      [MAYBE_EMIT_END]() {
        if (!this[EMITTING_END] && !this[EMITTED_END] && !this[DESTROYED] && this[BUFFER].length === 0 && this[EOF]) {
          this[EMITTING_END] = true;
          this.emit("end");
          this.emit("prefinish");
          this.emit("finish");
          if (this[CLOSED])
            this.emit("close");
          this[EMITTING_END] = false;
        }
      }
      /**
       * Mostly identical to `EventEmitter.emit`, with the following
       * behavior differences to prevent data loss and unnecessary hangs:
       *
       * If the stream has been destroyed, and the event is something other
       * than 'close' or 'error', then `false` is returned and no handlers
       * are called.
       *
       * If the event is 'end', and has already been emitted, then the event
       * is ignored. If the stream is in a paused or non-flowing state, then
       * the event will be deferred until data flow resumes. If the stream is
       * async, then handlers will be called on the next tick rather than
       * immediately.
       *
       * If the event is 'close', and 'end' has not yet been emitted, then
       * the event will be deferred until after 'end' is emitted.
       *
       * If the event is 'error', and an AbortSignal was provided for the stream,
       * and there are no listeners, then the event is ignored, matching the
       * behavior of node core streams in the presense of an AbortSignal.
       *
       * If the event is 'finish' or 'prefinish', then all listeners will be
       * removed after emitting the event, to prevent double-firing.
       */
      emit(ev, ...args) {
        const data = args[0];
        if (ev !== "error" && ev !== "close" && ev !== DESTROYED && this[DESTROYED]) {
          return false;
        } else if (ev === "data") {
          return !this[OBJECTMODE] && !data ? false : this[ASYNC] ? (defer(() => this[EMITDATA](data)), true) : this[EMITDATA](data);
        } else if (ev === "end") {
          return this[EMITEND]();
        } else if (ev === "close") {
          this[CLOSED] = true;
          if (!this[EMITTED_END] && !this[DESTROYED])
            return false;
          const ret2 = super.emit("close");
          this.removeAllListeners("close");
          return ret2;
        } else if (ev === "error") {
          this[EMITTED_ERROR] = data;
          super.emit(ERROR, data);
          const ret2 = !this[SIGNAL] || this.listeners("error").length ? super.emit("error", data) : false;
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === "resume") {
          const ret2 = super.emit("resume");
          this[MAYBE_EMIT_END]();
          return ret2;
        } else if (ev === "finish" || ev === "prefinish") {
          const ret2 = super.emit(ev);
          this.removeAllListeners(ev);
          return ret2;
        }
        const ret = super.emit(ev, ...args);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITDATA](data) {
        for (const p of this[PIPES]) {
          if (p.dest.write(data) === false)
            this.pause();
        }
        const ret = this[DISCARDED] ? false : super.emit("data", data);
        this[MAYBE_EMIT_END]();
        return ret;
      }
      [EMITEND]() {
        if (this[EMITTED_END])
          return false;
        this[EMITTED_END] = true;
        this.readable = false;
        return this[ASYNC] ? (defer(() => this[EMITEND2]()), true) : this[EMITEND2]();
      }
      [EMITEND2]() {
        if (this[DECODER]) {
          const data = this[DECODER].end();
          if (data) {
            for (const p of this[PIPES]) {
              p.dest.write(data);
            }
            if (!this[DISCARDED])
              super.emit("data", data);
          }
        }
        for (const p of this[PIPES]) {
          p.end();
        }
        const ret = super.emit("end");
        this.removeAllListeners("end");
        return ret;
      }
      /**
       * Return a Promise that resolves to an array of all emitted data once
       * the stream ends.
       */
      async collect() {
        const buf = Object.assign([], {
          dataLength: 0
        });
        if (!this[OBJECTMODE])
          buf.dataLength = 0;
        const p = this.promise();
        this.on("data", (c) => {
          buf.push(c);
          if (!this[OBJECTMODE])
            buf.dataLength += c.length;
        });
        await p;
        return buf;
      }
      /**
       * Return a Promise that resolves to the concatenation of all emitted data
       * once the stream ends.
       *
       * Not allowed on objectMode streams.
       */
      async concat() {
        if (this[OBJECTMODE]) {
          throw new Error("cannot concat in objectMode");
        }
        const buf = await this.collect();
        return this[ENCODING] ? buf.join("") : Buffer.concat(buf, buf.dataLength);
      }
      /**
       * Return a void Promise that resolves once the stream ends.
       */
      async promise() {
        return new Promise((resolve3, reject) => {
          this.on(DESTROYED, () => reject(new Error("stream destroyed")));
          this.on("error", (er) => reject(er));
          this.on("end", () => resolve3());
        });
      }
      /**
       * Asynchronous `for await of` iteration.
       *
       * This will continue emitting all chunks until the stream terminates.
       */
      [Symbol.asyncIterator]() {
        this[DISCARDED] = false;
        let stopped = false;
        const stop = async () => {
          this.pause();
          stopped = true;
          return { value: void 0, done: true };
        };
        const next = () => {
          if (stopped)
            return stop();
          const res = this.read();
          if (res !== null)
            return Promise.resolve({ done: false, value: res });
          if (this[EOF])
            return stop();
          let resolve3;
          let reject;
          const onerr = (er) => {
            this.off("data", ondata);
            this.off("end", onend);
            this.off(DESTROYED, ondestroy);
            stop();
            reject(er);
          };
          const ondata = (value) => {
            this.off("error", onerr);
            this.off("end", onend);
            this.off(DESTROYED, ondestroy);
            this.pause();
            resolve3({ value, done: !!this[EOF] });
          };
          const onend = () => {
            this.off("error", onerr);
            this.off("data", ondata);
            this.off(DESTROYED, ondestroy);
            stop();
            resolve3({ done: true, value: void 0 });
          };
          const ondestroy = () => onerr(new Error("stream destroyed"));
          return new Promise((res2, rej) => {
            reject = rej;
            resolve3 = res2;
            this.once(DESTROYED, ondestroy);
            this.once("error", onerr);
            this.once("end", onend);
            this.once("data", ondata);
          });
        };
        return {
          next,
          throw: stop,
          return: stop,
          [Symbol.asyncIterator]() {
            return this;
          },
          [Symbol.asyncDispose]: async () => {
          }
        };
      }
      /**
       * Synchronous `for of` iteration.
       *
       * The iteration will terminate when the internal buffer runs out, even
       * if the stream has not yet terminated.
       */
      [Symbol.iterator]() {
        this[DISCARDED] = false;
        let stopped = false;
        const stop = () => {
          this.pause();
          this.off(ERROR, stop);
          this.off(DESTROYED, stop);
          this.off("end", stop);
          stopped = true;
          return { done: true, value: void 0 };
        };
        const next = () => {
          if (stopped)
            return stop();
          const value = this.read();
          return value === null ? stop() : { done: false, value };
        };
        this.once("end", stop);
        this.once(ERROR, stop);
        this.once(DESTROYED, stop);
        return {
          next,
          throw: stop,
          return: stop,
          [Symbol.iterator]() {
            return this;
          },
          [Symbol.dispose]: () => {
          }
        };
      }
      /**
       * Destroy a stream, preventing it from being used for any further purpose.
       *
       * If the stream has a `close()` method, then it will be called on
       * destruction.
       *
       * After destruction, any attempt to write data, read data, or emit most
       * events will be ignored.
       *
       * If an error argument is provided, then it will be emitted in an
       * 'error' event.
       */
      destroy(er) {
        if (this[DESTROYED]) {
          if (er)
            this.emit("error", er);
          else
            this.emit(DESTROYED);
          return this;
        }
        this[DESTROYED] = true;
        this[DISCARDED] = true;
        this[BUFFER].length = 0;
        this[BUFFERLENGTH] = 0;
        const wc = this;
        if (typeof wc.close === "function" && !this[CLOSED])
          wc.close();
        if (er)
          this.emit("error", er);
        else
          this.emit(DESTROYED);
        return this;
      }
      /**
       * Alias for {@link isStream}
       *
       * Former export location, maintained for backwards compatibility.
       *
       * @deprecated
       */
      static get isStream() {
        return exports2.isStream;
      }
    };
    exports2.Minipass = Minipass;
  }
});

// node_modules/path-scurry/dist/commonjs/index.js
var require_commonjs4 = __commonJS({
  "node_modules/path-scurry/dist/commonjs/index.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PathScurry = exports2.Path = exports2.PathScurryDarwin = exports2.PathScurryPosix = exports2.PathScurryWin32 = exports2.PathScurryBase = exports2.PathPosix = exports2.PathWin32 = exports2.PathBase = exports2.ChildrenCache = exports2.ResolveCache = void 0;
    var lru_cache_1 = require_commonjs2();
    var node_path_1 = require("node:path");
    var node_url_1 = require("node:url");
    var fs_1 = require("fs");
    var actualFS = __importStar(require("node:fs"));
    var realpathSync = fs_1.realpathSync.native;
    var promises_1 = require("node:fs/promises");
    var minipass_1 = require_commonjs3();
    var defaultFS = {
      lstatSync: fs_1.lstatSync,
      readdir: fs_1.readdir,
      readdirSync: fs_1.readdirSync,
      readlinkSync: fs_1.readlinkSync,
      realpathSync,
      promises: {
        lstat: promises_1.lstat,
        readdir: promises_1.readdir,
        readlink: promises_1.readlink,
        realpath: promises_1.realpath
      }
    };
    var fsFromOption = (fsOption) => !fsOption || fsOption === defaultFS || fsOption === actualFS ? defaultFS : {
      ...defaultFS,
      ...fsOption,
      promises: {
        ...defaultFS.promises,
        ...fsOption.promises || {}
      }
    };
    var uncDriveRegexp = /^\\\\\?\\([a-z]:)\\?$/i;
    var uncToDrive = (rootPath) => rootPath.replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
    var eitherSep = /[\\\/]/;
    var UNKNOWN = 0;
    var IFIFO = 1;
    var IFCHR = 2;
    var IFDIR = 4;
    var IFBLK = 6;
    var IFREG = 8;
    var IFLNK = 10;
    var IFSOCK = 12;
    var IFMT = 15;
    var IFMT_UNKNOWN = ~IFMT;
    var READDIR_CALLED = 16;
    var LSTAT_CALLED = 32;
    var ENOTDIR = 64;
    var ENOENT = 128;
    var ENOREADLINK = 256;
    var ENOREALPATH = 512;
    var ENOCHILD = ENOTDIR | ENOENT | ENOREALPATH;
    var TYPEMASK = 1023;
    var entToType = (s) => s.isFile() ? IFREG : s.isDirectory() ? IFDIR : s.isSymbolicLink() ? IFLNK : s.isCharacterDevice() ? IFCHR : s.isBlockDevice() ? IFBLK : s.isSocket() ? IFSOCK : s.isFIFO() ? IFIFO : UNKNOWN;
    var normalizeCache = /* @__PURE__ */ new Map();
    var normalize = (s) => {
      const c = normalizeCache.get(s);
      if (c)
        return c;
      const n = s.normalize("NFKD");
      normalizeCache.set(s, n);
      return n;
    };
    var normalizeNocaseCache = /* @__PURE__ */ new Map();
    var normalizeNocase = (s) => {
      const c = normalizeNocaseCache.get(s);
      if (c)
        return c;
      const n = normalize(s.toLowerCase());
      normalizeNocaseCache.set(s, n);
      return n;
    };
    var ResolveCache = class extends lru_cache_1.LRUCache {
      constructor() {
        super({ max: 256 });
      }
    };
    exports2.ResolveCache = ResolveCache;
    var ChildrenCache = class extends lru_cache_1.LRUCache {
      constructor(maxSize = 16 * 1024) {
        super({
          maxSize,
          // parent + children
          sizeCalculation: (a) => a.length + 1
        });
      }
    };
    exports2.ChildrenCache = ChildrenCache;
    var setAsCwd = /* @__PURE__ */ Symbol("PathScurry setAsCwd");
    var PathBase = class {
      /**
       * the basename of this path
       *
       * **Important**: *always* test the path name against any test string
       * usingthe {@link isNamed} method, and not by directly comparing this
       * string. Otherwise, unicode path strings that the system sees as identical
       * will not be properly treated as the same path, leading to incorrect
       * behavior and possible security issues.
       */
      name;
      /**
       * the Path entry corresponding to the path root.
       *
       * @internal
       */
      root;
      /**
       * All roots found within the current PathScurry family
       *
       * @internal
       */
      roots;
      /**
       * a reference to the parent path, or undefined in the case of root entries
       *
       * @internal
       */
      parent;
      /**
       * boolean indicating whether paths are compared case-insensitively
       * @internal
       */
      nocase;
      /**
       * boolean indicating that this path is the current working directory
       * of the PathScurry collection that contains it.
       */
      isCWD = false;
      // potential default fs override
      #fs;
      // Stats fields
      #dev;
      get dev() {
        return this.#dev;
      }
      #mode;
      get mode() {
        return this.#mode;
      }
      #nlink;
      get nlink() {
        return this.#nlink;
      }
      #uid;
      get uid() {
        return this.#uid;
      }
      #gid;
      get gid() {
        return this.#gid;
      }
      #rdev;
      get rdev() {
        return this.#rdev;
      }
      #blksize;
      get blksize() {
        return this.#blksize;
      }
      #ino;
      get ino() {
        return this.#ino;
      }
      #size;
      get size() {
        return this.#size;
      }
      #blocks;
      get blocks() {
        return this.#blocks;
      }
      #atimeMs;
      get atimeMs() {
        return this.#atimeMs;
      }
      #mtimeMs;
      get mtimeMs() {
        return this.#mtimeMs;
      }
      #ctimeMs;
      get ctimeMs() {
        return this.#ctimeMs;
      }
      #birthtimeMs;
      get birthtimeMs() {
        return this.#birthtimeMs;
      }
      #atime;
      get atime() {
        return this.#atime;
      }
      #mtime;
      get mtime() {
        return this.#mtime;
      }
      #ctime;
      get ctime() {
        return this.#ctime;
      }
      #birthtime;
      get birthtime() {
        return this.#birthtime;
      }
      #matchName;
      #depth;
      #fullpath;
      #fullpathPosix;
      #relative;
      #relativePosix;
      #type;
      #children;
      #linkTarget;
      #realpath;
      /**
       * This property is for compatibility with the Dirent class as of
       * Node v20, where Dirent['parentPath'] refers to the path of the
       * directory that was passed to readdir. For root entries, it's the path
       * to the entry itself.
       */
      get parentPath() {
        return (this.parent || this).fullpath();
      }
      /**
       * Deprecated alias for Dirent['parentPath'] Somewhat counterintuitively,
       * this property refers to the *parent* path, not the path object itself.
       */
      get path() {
        return this.parentPath;
      }
      /**
       * Do not create new Path objects directly.  They should always be accessed
       * via the PathScurry class or other methods on the Path class.
       *
       * @internal
       */
      constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        this.name = name;
        this.#matchName = nocase ? normalizeNocase(name) : normalize(name);
        this.#type = type & TYPEMASK;
        this.nocase = nocase;
        this.roots = roots;
        this.root = root || this;
        this.#children = children;
        this.#fullpath = opts.fullpath;
        this.#relative = opts.relative;
        this.#relativePosix = opts.relativePosix;
        this.parent = opts.parent;
        if (this.parent) {
          this.#fs = this.parent.#fs;
        } else {
          this.#fs = fsFromOption(opts.fs);
        }
      }
      /**
       * Returns the depth of the Path object from its root.
       *
       * For example, a path at `/foo/bar` would have a depth of 2.
       */
      depth() {
        if (this.#depth !== void 0)
          return this.#depth;
        if (!this.parent)
          return this.#depth = 0;
        return this.#depth = this.parent.depth() + 1;
      }
      /**
       * @internal
       */
      childrenCache() {
        return this.#children;
      }
      /**
       * Get the Path object referenced by the string path, resolved from this Path
       */
      resolve(path) {
        if (!path) {
          return this;
        }
        const rootPath = this.getRootString(path);
        const dir = path.substring(rootPath.length);
        const dirParts = dir.split(this.splitSep);
        const result = rootPath ? this.getRoot(rootPath).#resolveParts(dirParts) : this.#resolveParts(dirParts);
        return result;
      }
      #resolveParts(dirParts) {
        let p = this;
        for (const part of dirParts) {
          p = p.child(part);
        }
        return p;
      }
      /**
       * Returns the cached children Path objects, if still available.  If they
       * have fallen out of the cache, then returns an empty array, and resets the
       * READDIR_CALLED bit, so that future calls to readdir() will require an fs
       * lookup.
       *
       * @internal
       */
      children() {
        const cached = this.#children.get(this);
        if (cached) {
          return cached;
        }
        const children = Object.assign([], { provisional: 0 });
        this.#children.set(this, children);
        this.#type &= ~READDIR_CALLED;
        return children;
      }
      /**
       * Resolves a path portion and returns or creates the child Path.
       *
       * Returns `this` if pathPart is `''` or `'.'`, or `parent` if pathPart is
       * `'..'`.
       *
       * This should not be called directly.  If `pathPart` contains any path
       * separators, it will lead to unsafe undefined behavior.
       *
       * Use `Path.resolve()` instead.
       *
       * @internal
       */
      child(pathPart, opts) {
        if (pathPart === "" || pathPart === ".") {
          return this;
        }
        if (pathPart === "..") {
          return this.parent || this;
        }
        const children = this.children();
        const name = this.nocase ? normalizeNocase(pathPart) : normalize(pathPart);
        for (const p of children) {
          if (p.#matchName === name) {
            return p;
          }
        }
        const s = this.parent ? this.sep : "";
        const fullpath = this.#fullpath ? this.#fullpath + s + pathPart : void 0;
        const pchild = this.newChild(pathPart, UNKNOWN, {
          ...opts,
          parent: this,
          fullpath
        });
        if (!this.canReaddir()) {
          pchild.#type |= ENOENT;
        }
        children.push(pchild);
        return pchild;
      }
      /**
       * The relative path from the cwd. If it does not share an ancestor with
       * the cwd, then this ends up being equivalent to the fullpath()
       */
      relative() {
        if (this.isCWD)
          return "";
        if (this.#relative !== void 0) {
          return this.#relative;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
          return this.#relative = this.name;
        }
        const pv = p.relative();
        return pv + (!pv || !p.parent ? "" : this.sep) + name;
      }
      /**
       * The relative path from the cwd, using / as the path separator.
       * If it does not share an ancestor with
       * the cwd, then this ends up being equivalent to the fullpathPosix()
       * On posix systems, this is identical to relative().
       */
      relativePosix() {
        if (this.sep === "/")
          return this.relative();
        if (this.isCWD)
          return "";
        if (this.#relativePosix !== void 0)
          return this.#relativePosix;
        const name = this.name;
        const p = this.parent;
        if (!p) {
          return this.#relativePosix = this.fullpathPosix();
        }
        const pv = p.relativePosix();
        return pv + (!pv || !p.parent ? "" : "/") + name;
      }
      /**
       * The fully resolved path string for this Path entry
       */
      fullpath() {
        if (this.#fullpath !== void 0) {
          return this.#fullpath;
        }
        const name = this.name;
        const p = this.parent;
        if (!p) {
          return this.#fullpath = this.name;
        }
        const pv = p.fullpath();
        const fp = pv + (!p.parent ? "" : this.sep) + name;
        return this.#fullpath = fp;
      }
      /**
       * On platforms other than windows, this is identical to fullpath.
       *
       * On windows, this is overridden to return the forward-slash form of the
       * full UNC path.
       */
      fullpathPosix() {
        if (this.#fullpathPosix !== void 0)
          return this.#fullpathPosix;
        if (this.sep === "/")
          return this.#fullpathPosix = this.fullpath();
        if (!this.parent) {
          const p2 = this.fullpath().replace(/\\/g, "/");
          if (/^[a-z]:\//i.test(p2)) {
            return this.#fullpathPosix = `//?/${p2}`;
          } else {
            return this.#fullpathPosix = p2;
          }
        }
        const p = this.parent;
        const pfpp = p.fullpathPosix();
        const fpp = pfpp + (!pfpp || !p.parent ? "" : "/") + this.name;
        return this.#fullpathPosix = fpp;
      }
      /**
       * Is the Path of an unknown type?
       *
       * Note that we might know *something* about it if there has been a previous
       * filesystem operation, for example that it does not exist, or is not a
       * link, or whether it has child entries.
       */
      isUnknown() {
        return (this.#type & IFMT) === UNKNOWN;
      }
      isType(type) {
        return this[`is${type}`]();
      }
      getType() {
        return this.isUnknown() ? "Unknown" : this.isDirectory() ? "Directory" : this.isFile() ? "File" : this.isSymbolicLink() ? "SymbolicLink" : this.isFIFO() ? "FIFO" : this.isCharacterDevice() ? "CharacterDevice" : this.isBlockDevice() ? "BlockDevice" : (
          /* c8 ignore start */
          this.isSocket() ? "Socket" : "Unknown"
        );
      }
      /**
       * Is the Path a regular file?
       */
      isFile() {
        return (this.#type & IFMT) === IFREG;
      }
      /**
       * Is the Path a directory?
       */
      isDirectory() {
        return (this.#type & IFMT) === IFDIR;
      }
      /**
       * Is the path a character device?
       */
      isCharacterDevice() {
        return (this.#type & IFMT) === IFCHR;
      }
      /**
       * Is the path a block device?
       */
      isBlockDevice() {
        return (this.#type & IFMT) === IFBLK;
      }
      /**
       * Is the path a FIFO pipe?
       */
      isFIFO() {
        return (this.#type & IFMT) === IFIFO;
      }
      /**
       * Is the path a socket?
       */
      isSocket() {
        return (this.#type & IFMT) === IFSOCK;
      }
      /**
       * Is the path a symbolic link?
       */
      isSymbolicLink() {
        return (this.#type & IFLNK) === IFLNK;
      }
      /**
       * Return the entry if it has been subject of a successful lstat, or
       * undefined otherwise.
       *
       * Does not read the filesystem, so an undefined result *could* simply
       * mean that we haven't called lstat on it.
       */
      lstatCached() {
        return this.#type & LSTAT_CALLED ? this : void 0;
      }
      /**
       * Return the cached link target if the entry has been the subject of a
       * successful readlink, or undefined otherwise.
       *
       * Does not read the filesystem, so an undefined result *could* just mean we
       * don't have any cached data. Only use it if you are very sure that a
       * readlink() has been called at some point.
       */
      readlinkCached() {
        return this.#linkTarget;
      }
      /**
       * Returns the cached realpath target if the entry has been the subject
       * of a successful realpath, or undefined otherwise.
       *
       * Does not read the filesystem, so an undefined result *could* just mean we
       * don't have any cached data. Only use it if you are very sure that a
       * realpath() has been called at some point.
       */
      realpathCached() {
        return this.#realpath;
      }
      /**
       * Returns the cached child Path entries array if the entry has been the
       * subject of a successful readdir(), or [] otherwise.
       *
       * Does not read the filesystem, so an empty array *could* just mean we
       * don't have any cached data. Only use it if you are very sure that a
       * readdir() has been called recently enough to still be valid.
       */
      readdirCached() {
        const children = this.children();
        return children.slice(0, children.provisional);
      }
      /**
       * Return true if it's worth trying to readlink.  Ie, we don't (yet) have
       * any indication that readlink will definitely fail.
       *
       * Returns false if the path is known to not be a symlink, if a previous
       * readlink failed, or if the entry does not exist.
       */
      canReadlink() {
        if (this.#linkTarget)
          return true;
        if (!this.parent)
          return false;
        const ifmt = this.#type & IFMT;
        return !(ifmt !== UNKNOWN && ifmt !== IFLNK || this.#type & ENOREADLINK || this.#type & ENOENT);
      }
      /**
       * Return true if readdir has previously been successfully called on this
       * path, indicating that cachedReaddir() is likely valid.
       */
      calledReaddir() {
        return !!(this.#type & READDIR_CALLED);
      }
      /**
       * Returns true if the path is known to not exist. That is, a previous lstat
       * or readdir failed to verify its existence when that would have been
       * expected, or a parent entry was marked either enoent or enotdir.
       */
      isENOENT() {
        return !!(this.#type & ENOENT);
      }
      /**
       * Return true if the path is a match for the given path name.  This handles
       * case sensitivity and unicode normalization.
       *
       * Note: even on case-sensitive systems, it is **not** safe to test the
       * equality of the `.name` property to determine whether a given pathname
       * matches, due to unicode normalization mismatches.
       *
       * Always use this method instead of testing the `path.name` property
       * directly.
       */
      isNamed(n) {
        return !this.nocase ? this.#matchName === normalize(n) : this.#matchName === normalizeNocase(n);
      }
      /**
       * Return the Path object corresponding to the target of a symbolic link.
       *
       * If the Path is not a symbolic link, or if the readlink call fails for any
       * reason, `undefined` is returned.
       *
       * Result is cached, and thus may be outdated if the filesystem is mutated.
       */
      async readlink() {
        const target = this.#linkTarget;
        if (target) {
          return target;
        }
        if (!this.canReadlink()) {
          return void 0;
        }
        if (!this.parent) {
          return void 0;
        }
        try {
          const read = await this.#fs.promises.readlink(this.fullpath());
          const linkTarget = (await this.parent.realpath())?.resolve(read);
          if (linkTarget) {
            return this.#linkTarget = linkTarget;
          }
        } catch (er) {
          this.#readlinkFail(er.code);
          return void 0;
        }
      }
      /**
       * Synchronous {@link PathBase.readlink}
       */
      readlinkSync() {
        const target = this.#linkTarget;
        if (target) {
          return target;
        }
        if (!this.canReadlink()) {
          return void 0;
        }
        if (!this.parent) {
          return void 0;
        }
        try {
          const read = this.#fs.readlinkSync(this.fullpath());
          const linkTarget = this.parent.realpathSync()?.resolve(read);
          if (linkTarget) {
            return this.#linkTarget = linkTarget;
          }
        } catch (er) {
          this.#readlinkFail(er.code);
          return void 0;
        }
      }
      #readdirSuccess(children) {
        this.#type |= READDIR_CALLED;
        for (let p = children.provisional; p < children.length; p++) {
          const c = children[p];
          if (c)
            c.#markENOENT();
        }
      }
      #markENOENT() {
        if (this.#type & ENOENT)
          return;
        this.#type = (this.#type | ENOENT) & IFMT_UNKNOWN;
        this.#markChildrenENOENT();
      }
      #markChildrenENOENT() {
        const children = this.children();
        children.provisional = 0;
        for (const p of children) {
          p.#markENOENT();
        }
      }
      #markENOREALPATH() {
        this.#type |= ENOREALPATH;
        this.#markENOTDIR();
      }
      // save the information when we know the entry is not a dir
      #markENOTDIR() {
        if (this.#type & ENOTDIR)
          return;
        let t = this.#type;
        if ((t & IFMT) === IFDIR)
          t &= IFMT_UNKNOWN;
        this.#type = t | ENOTDIR;
        this.#markChildrenENOENT();
      }
      #readdirFail(code = "") {
        if (code === "ENOTDIR" || code === "EPERM") {
          this.#markENOTDIR();
        } else if (code === "ENOENT") {
          this.#markENOENT();
        } else {
          this.children().provisional = 0;
        }
      }
      #lstatFail(code = "") {
        if (code === "ENOTDIR") {
          const p = this.parent;
          p.#markENOTDIR();
        } else if (code === "ENOENT") {
          this.#markENOENT();
        }
      }
      #readlinkFail(code = "") {
        let ter = this.#type;
        ter |= ENOREADLINK;
        if (code === "ENOENT")
          ter |= ENOENT;
        if (code === "EINVAL" || code === "UNKNOWN") {
          ter &= IFMT_UNKNOWN;
        }
        this.#type = ter;
        if (code === "ENOTDIR" && this.parent) {
          this.parent.#markENOTDIR();
        }
      }
      #readdirAddChild(e, c) {
        return this.#readdirMaybePromoteChild(e, c) || this.#readdirAddNewChild(e, c);
      }
      #readdirAddNewChild(e, c) {
        const type = entToType(e);
        const child = this.newChild(e.name, type, { parent: this });
        const ifmt = child.#type & IFMT;
        if (ifmt !== IFDIR && ifmt !== IFLNK && ifmt !== UNKNOWN) {
          child.#type |= ENOTDIR;
        }
        c.unshift(child);
        c.provisional++;
        return child;
      }
      #readdirMaybePromoteChild(e, c) {
        for (let p = c.provisional; p < c.length; p++) {
          const pchild = c[p];
          const name = this.nocase ? normalizeNocase(e.name) : normalize(e.name);
          if (name !== pchild.#matchName) {
            continue;
          }
          return this.#readdirPromoteChild(e, pchild, p, c);
        }
      }
      #readdirPromoteChild(e, p, index, c) {
        const v = p.name;
        p.#type = p.#type & IFMT_UNKNOWN | entToType(e);
        if (v !== e.name)
          p.name = e.name;
        if (index !== c.provisional) {
          if (index === c.length - 1)
            c.pop();
          else
            c.splice(index, 1);
          c.unshift(p);
        }
        c.provisional++;
        return p;
      }
      /**
       * Call lstat() on this Path, and update all known information that can be
       * determined.
       *
       * Note that unlike `fs.lstat()`, the returned value does not contain some
       * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
       * information is required, you will need to call `fs.lstat` yourself.
       *
       * If the Path refers to a nonexistent file, or if the lstat call fails for
       * any reason, `undefined` is returned.  Otherwise the updated Path object is
       * returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       */
      async lstat() {
        if ((this.#type & ENOENT) === 0) {
          try {
            this.#applyStat(await this.#fs.promises.lstat(this.fullpath()));
            return this;
          } catch (er) {
            this.#lstatFail(er.code);
          }
        }
      }
      /**
       * synchronous {@link PathBase.lstat}
       */
      lstatSync() {
        if ((this.#type & ENOENT) === 0) {
          try {
            this.#applyStat(this.#fs.lstatSync(this.fullpath()));
            return this;
          } catch (er) {
            this.#lstatFail(er.code);
          }
        }
      }
      #applyStat(st) {
        const { atime, atimeMs, birthtime, birthtimeMs, blksize, blocks, ctime, ctimeMs, dev, gid, ino, mode, mtime, mtimeMs, nlink, rdev, size, uid } = st;
        this.#atime = atime;
        this.#atimeMs = atimeMs;
        this.#birthtime = birthtime;
        this.#birthtimeMs = birthtimeMs;
        this.#blksize = blksize;
        this.#blocks = blocks;
        this.#ctime = ctime;
        this.#ctimeMs = ctimeMs;
        this.#dev = dev;
        this.#gid = gid;
        this.#ino = ino;
        this.#mode = mode;
        this.#mtime = mtime;
        this.#mtimeMs = mtimeMs;
        this.#nlink = nlink;
        this.#rdev = rdev;
        this.#size = size;
        this.#uid = uid;
        const ifmt = entToType(st);
        this.#type = this.#type & IFMT_UNKNOWN | ifmt | LSTAT_CALLED;
        if (ifmt !== UNKNOWN && ifmt !== IFDIR && ifmt !== IFLNK) {
          this.#type |= ENOTDIR;
        }
      }
      #onReaddirCB = [];
      #readdirCBInFlight = false;
      #callOnReaddirCB(children) {
        this.#readdirCBInFlight = false;
        const cbs = this.#onReaddirCB.slice();
        this.#onReaddirCB.length = 0;
        cbs.forEach((cb) => cb(null, children));
      }
      /**
       * Standard node-style callback interface to get list of directory entries.
       *
       * If the Path cannot or does not contain any children, then an empty array
       * is returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       *
       * @param cb The callback called with (er, entries).  Note that the `er`
       * param is somewhat extraneous, as all readdir() errors are handled and
       * simply result in an empty set of entries being returned.
       * @param allowZalgo Boolean indicating that immediately known results should
       * *not* be deferred with `queueMicrotask`. Defaults to `false`. Release
       * zalgo at your peril, the dark pony lord is devious and unforgiving.
       */
      readdirCB(cb, allowZalgo = false) {
        if (!this.canReaddir()) {
          if (allowZalgo)
            cb(null, []);
          else
            queueMicrotask(() => cb(null, []));
          return;
        }
        const children = this.children();
        if (this.calledReaddir()) {
          const c = children.slice(0, children.provisional);
          if (allowZalgo)
            cb(null, c);
          else
            queueMicrotask(() => cb(null, c));
          return;
        }
        this.#onReaddirCB.push(cb);
        if (this.#readdirCBInFlight) {
          return;
        }
        this.#readdirCBInFlight = true;
        const fullpath = this.fullpath();
        this.#fs.readdir(fullpath, { withFileTypes: true }, (er, entries) => {
          if (er) {
            this.#readdirFail(er.code);
            children.provisional = 0;
          } else {
            for (const e of entries) {
              this.#readdirAddChild(e, children);
            }
            this.#readdirSuccess(children);
          }
          this.#callOnReaddirCB(children.slice(0, children.provisional));
          return;
        });
      }
      #asyncReaddirInFlight;
      /**
       * Return an array of known child entries.
       *
       * If the Path cannot or does not contain any children, then an empty array
       * is returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       */
      async readdir() {
        if (!this.canReaddir()) {
          return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
          return children.slice(0, children.provisional);
        }
        const fullpath = this.fullpath();
        if (this.#asyncReaddirInFlight) {
          await this.#asyncReaddirInFlight;
        } else {
          let resolve3 = () => {
          };
          this.#asyncReaddirInFlight = new Promise((res) => resolve3 = res);
          try {
            for (const e of await this.#fs.promises.readdir(fullpath, {
              withFileTypes: true
            })) {
              this.#readdirAddChild(e, children);
            }
            this.#readdirSuccess(children);
          } catch (er) {
            this.#readdirFail(er.code);
            children.provisional = 0;
          }
          this.#asyncReaddirInFlight = void 0;
          resolve3();
        }
        return children.slice(0, children.provisional);
      }
      /**
       * synchronous {@link PathBase.readdir}
       */
      readdirSync() {
        if (!this.canReaddir()) {
          return [];
        }
        const children = this.children();
        if (this.calledReaddir()) {
          return children.slice(0, children.provisional);
        }
        const fullpath = this.fullpath();
        try {
          for (const e of this.#fs.readdirSync(fullpath, {
            withFileTypes: true
          })) {
            this.#readdirAddChild(e, children);
          }
          this.#readdirSuccess(children);
        } catch (er) {
          this.#readdirFail(er.code);
          children.provisional = 0;
        }
        return children.slice(0, children.provisional);
      }
      canReaddir() {
        if (this.#type & ENOCHILD)
          return false;
        const ifmt = IFMT & this.#type;
        if (!(ifmt === UNKNOWN || ifmt === IFDIR || ifmt === IFLNK)) {
          return false;
        }
        return true;
      }
      shouldWalk(dirs, walkFilter) {
        return (this.#type & IFDIR) === IFDIR && !(this.#type & ENOCHILD) && !dirs.has(this) && (!walkFilter || walkFilter(this));
      }
      /**
       * Return the Path object corresponding to path as resolved
       * by realpath(3).
       *
       * If the realpath call fails for any reason, `undefined` is returned.
       *
       * Result is cached, and thus may be outdated if the filesystem is mutated.
       * On success, returns a Path object.
       */
      async realpath() {
        if (this.#realpath)
          return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
          return void 0;
        try {
          const rp = await this.#fs.promises.realpath(this.fullpath());
          return this.#realpath = this.resolve(rp);
        } catch (_) {
          this.#markENOREALPATH();
        }
      }
      /**
       * Synchronous {@link realpath}
       */
      realpathSync() {
        if (this.#realpath)
          return this.#realpath;
        if ((ENOREALPATH | ENOREADLINK | ENOENT) & this.#type)
          return void 0;
        try {
          const rp = this.#fs.realpathSync(this.fullpath());
          return this.#realpath = this.resolve(rp);
        } catch (_) {
          this.#markENOREALPATH();
        }
      }
      /**
       * Internal method to mark this Path object as the scurry cwd,
       * called by {@link PathScurry#chdir}
       *
       * @internal
       */
      [setAsCwd](oldCwd) {
        if (oldCwd === this)
          return;
        oldCwd.isCWD = false;
        this.isCWD = true;
        const changed = /* @__PURE__ */ new Set([]);
        let rp = [];
        let p = this;
        while (p && p.parent) {
          changed.add(p);
          p.#relative = rp.join(this.sep);
          p.#relativePosix = rp.join("/");
          p = p.parent;
          rp.push("..");
        }
        p = oldCwd;
        while (p && p.parent && !changed.has(p)) {
          p.#relative = void 0;
          p.#relativePosix = void 0;
          p = p.parent;
        }
      }
    };
    exports2.PathBase = PathBase;
    var PathWin32 = class _PathWin32 extends PathBase {
      /**
       * Separator for generating path strings.
       */
      sep = "\\";
      /**
       * Separator for parsing path strings.
       */
      splitSep = eitherSep;
      /**
       * Do not create new Path objects directly.  They should always be accessed
       * via the PathScurry class or other methods on the Path class.
       *
       * @internal
       */
      constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
      }
      /**
       * @internal
       */
      newChild(name, type = UNKNOWN, opts = {}) {
        return new _PathWin32(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
      }
      /**
       * @internal
       */
      getRootString(path) {
        return node_path_1.win32.parse(path).root;
      }
      /**
       * @internal
       */
      getRoot(rootPath) {
        rootPath = uncToDrive(rootPath.toUpperCase());
        if (rootPath === this.root.name) {
          return this.root;
        }
        for (const [compare, root] of Object.entries(this.roots)) {
          if (this.sameRoot(rootPath, compare)) {
            return this.roots[rootPath] = root;
          }
        }
        return this.roots[rootPath] = new PathScurryWin32(rootPath, this).root;
      }
      /**
       * @internal
       */
      sameRoot(rootPath, compare = this.root.name) {
        rootPath = rootPath.toUpperCase().replace(/\//g, "\\").replace(uncDriveRegexp, "$1\\");
        return rootPath === compare;
      }
    };
    exports2.PathWin32 = PathWin32;
    var PathPosix = class _PathPosix extends PathBase {
      /**
       * separator for parsing path strings
       */
      splitSep = "/";
      /**
       * separator for generating path strings
       */
      sep = "/";
      /**
       * Do not create new Path objects directly.  They should always be accessed
       * via the PathScurry class or other methods on the Path class.
       *
       * @internal
       */
      constructor(name, type = UNKNOWN, root, roots, nocase, children, opts) {
        super(name, type, root, roots, nocase, children, opts);
      }
      /**
       * @internal
       */
      getRootString(path) {
        return path.startsWith("/") ? "/" : "";
      }
      /**
       * @internal
       */
      getRoot(_rootPath) {
        return this.root;
      }
      /**
       * @internal
       */
      newChild(name, type = UNKNOWN, opts = {}) {
        return new _PathPosix(name, type, this.root, this.roots, this.nocase, this.childrenCache(), opts);
      }
    };
    exports2.PathPosix = PathPosix;
    var PathScurryBase = class {
      /**
       * The root Path entry for the current working directory of this Scurry
       */
      root;
      /**
       * The string path for the root of this Scurry's current working directory
       */
      rootPath;
      /**
       * A collection of all roots encountered, referenced by rootPath
       */
      roots;
      /**
       * The Path entry corresponding to this PathScurry's current working directory.
       */
      cwd;
      #resolveCache;
      #resolvePosixCache;
      #children;
      /**
       * Perform path comparisons case-insensitively.
       *
       * Defaults true on Darwin and Windows systems, false elsewhere.
       */
      nocase;
      #fs;
      /**
       * This class should not be instantiated directly.
       *
       * Use PathScurryWin32, PathScurryDarwin, PathScurryPosix, or PathScurry
       *
       * @internal
       */
      constructor(cwd = process.cwd(), pathImpl, sep2, { nocase, childrenCacheSize = 16 * 1024, fs = defaultFS } = {}) {
        this.#fs = fsFromOption(fs);
        if (cwd instanceof URL || cwd.startsWith("file://")) {
          cwd = (0, node_url_1.fileURLToPath)(cwd);
        }
        const cwdPath = pathImpl.resolve(cwd);
        this.roots = /* @__PURE__ */ Object.create(null);
        this.rootPath = this.parseRootPath(cwdPath);
        this.#resolveCache = new ResolveCache();
        this.#resolvePosixCache = new ResolveCache();
        this.#children = new ChildrenCache(childrenCacheSize);
        const split = cwdPath.substring(this.rootPath.length).split(sep2);
        if (split.length === 1 && !split[0]) {
          split.pop();
        }
        if (nocase === void 0) {
          throw new TypeError("must provide nocase setting to PathScurryBase ctor");
        }
        this.nocase = nocase;
        this.root = this.newRoot(this.#fs);
        this.roots[this.rootPath] = this.root;
        let prev = this.root;
        let len = split.length - 1;
        const joinSep = pathImpl.sep;
        let abs = this.rootPath;
        let sawFirst = false;
        for (const part of split) {
          const l = len--;
          prev = prev.child(part, {
            relative: new Array(l).fill("..").join(joinSep),
            relativePosix: new Array(l).fill("..").join("/"),
            fullpath: abs += (sawFirst ? "" : joinSep) + part
          });
          sawFirst = true;
        }
        this.cwd = prev;
      }
      /**
       * Get the depth of a provided path, string, or the cwd
       */
      depth(path = this.cwd) {
        if (typeof path === "string") {
          path = this.cwd.resolve(path);
        }
        return path.depth();
      }
      /**
       * Return the cache of child entries.  Exposed so subclasses can create
       * child Path objects in a platform-specific way.
       *
       * @internal
       */
      childrenCache() {
        return this.#children;
      }
      /**
       * Resolve one or more path strings to a resolved string
       *
       * Same interface as require('path').resolve.
       *
       * Much faster than path.resolve() when called multiple times for the same
       * path, because the resolved Path objects are cached.  Much slower
       * otherwise.
       */
      resolve(...paths) {
        let r = "";
        for (let i = paths.length - 1; i >= 0; i--) {
          const p = paths[i];
          if (!p || p === ".")
            continue;
          r = r ? `${p}/${r}` : p;
          if (this.isAbsolute(p)) {
            break;
          }
        }
        const cached = this.#resolveCache.get(r);
        if (cached !== void 0) {
          return cached;
        }
        const result = this.cwd.resolve(r).fullpath();
        this.#resolveCache.set(r, result);
        return result;
      }
      /**
       * Resolve one or more path strings to a resolved string, returning
       * the posix path.  Identical to .resolve() on posix systems, but on
       * windows will return a forward-slash separated UNC path.
       *
       * Same interface as require('path').resolve.
       *
       * Much faster than path.resolve() when called multiple times for the same
       * path, because the resolved Path objects are cached.  Much slower
       * otherwise.
       */
      resolvePosix(...paths) {
        let r = "";
        for (let i = paths.length - 1; i >= 0; i--) {
          const p = paths[i];
          if (!p || p === ".")
            continue;
          r = r ? `${p}/${r}` : p;
          if (this.isAbsolute(p)) {
            break;
          }
        }
        const cached = this.#resolvePosixCache.get(r);
        if (cached !== void 0) {
          return cached;
        }
        const result = this.cwd.resolve(r).fullpathPosix();
        this.#resolvePosixCache.set(r, result);
        return result;
      }
      /**
       * find the relative path from the cwd to the supplied path string or entry
       */
      relative(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.relative();
      }
      /**
       * find the relative path from the cwd to the supplied path string or
       * entry, using / as the path delimiter, even on Windows.
       */
      relativePosix(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.relativePosix();
      }
      /**
       * Return the basename for the provided string or Path object
       */
      basename(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.name;
      }
      /**
       * Return the dirname for the provided string or Path object
       */
      dirname(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return (entry.parent || entry).fullpath();
      }
      async readdir(entry = this.cwd, opts = {
        withFileTypes: true
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes } = opts;
        if (!entry.canReaddir()) {
          return [];
        } else {
          const p = await entry.readdir();
          return withFileTypes ? p : p.map((e) => e.name);
        }
      }
      readdirSync(entry = this.cwd, opts = {
        withFileTypes: true
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true } = opts;
        if (!entry.canReaddir()) {
          return [];
        } else if (withFileTypes) {
          return entry.readdirSync();
        } else {
          return entry.readdirSync().map((e) => e.name);
        }
      }
      /**
       * Call lstat() on the string or Path object, and update all known
       * information that can be determined.
       *
       * Note that unlike `fs.lstat()`, the returned value does not contain some
       * information, such as `mode`, `dev`, `nlink`, and `ino`.  If that
       * information is required, you will need to call `fs.lstat` yourself.
       *
       * If the Path refers to a nonexistent file, or if the lstat call fails for
       * any reason, `undefined` is returned.  Otherwise the updated Path object is
       * returned.
       *
       * Results are cached, and thus may be out of date if the filesystem is
       * mutated.
       */
      async lstat(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.lstat();
      }
      /**
       * synchronous {@link PathScurryBase.lstat}
       */
      lstatSync(entry = this.cwd) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        }
        return entry.lstatSync();
      }
      async readlink(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = await entry.readlink();
        return withFileTypes ? e : e?.fullpath();
      }
      readlinkSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = entry.readlinkSync();
        return withFileTypes ? e : e?.fullpath();
      }
      async realpath(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = await entry.realpath();
        return withFileTypes ? e : e?.fullpath();
      }
      realpathSync(entry = this.cwd, { withFileTypes } = {
        withFileTypes: false
      }) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          withFileTypes = entry.withFileTypes;
          entry = this.cwd;
        }
        const e = entry.realpathSync();
        return withFileTypes ? e : e?.fullpath();
      }
      async walk(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = [];
        if (!filter || filter(entry)) {
          results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = /* @__PURE__ */ new Set();
        const walk = (dir, cb) => {
          dirs.add(dir);
          dir.readdirCB((er, entries) => {
            if (er) {
              return cb(er);
            }
            let len = entries.length;
            if (!len)
              return cb();
            const next = () => {
              if (--len === 0) {
                cb();
              }
            };
            for (const e of entries) {
              if (!filter || filter(e)) {
                results.push(withFileTypes ? e : e.fullpath());
              }
              if (follow && e.isSymbolicLink()) {
                e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r).then((r) => r?.shouldWalk(dirs, walkFilter) ? walk(r, next) : next());
              } else {
                if (e.shouldWalk(dirs, walkFilter)) {
                  walk(e, next);
                } else {
                  next();
                }
              }
            }
          }, true);
        };
        const start = entry;
        return new Promise((res, rej) => {
          walk(start, (er) => {
            if (er)
              return rej(er);
            res(results);
          });
        });
      }
      walkSync(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = [];
        if (!filter || filter(entry)) {
          results.push(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = /* @__PURE__ */ new Set([entry]);
        for (const dir of dirs) {
          const entries = dir.readdirSync();
          for (const e of entries) {
            if (!filter || filter(e)) {
              results.push(withFileTypes ? e : e.fullpath());
            }
            let r = e;
            if (e.isSymbolicLink()) {
              if (!(follow && (r = e.realpathSync())))
                continue;
              if (r.isUnknown())
                r.lstatSync();
            }
            if (r.shouldWalk(dirs, walkFilter)) {
              dirs.add(r);
            }
          }
        }
        return results;
      }
      /**
       * Support for `for await`
       *
       * Alias for {@link PathScurryBase.iterate}
       *
       * Note: As of Node 19, this is very slow, compared to other methods of
       * walking.  Consider using {@link PathScurryBase.stream} if memory overhead
       * and backpressure are concerns, or {@link PathScurryBase.walk} if not.
       */
      [Symbol.asyncIterator]() {
        return this.iterate();
      }
      iterate(entry = this.cwd, options = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          options = entry;
          entry = this.cwd;
        }
        return this.stream(entry, options)[Symbol.asyncIterator]();
      }
      /**
       * Iterating over a PathScurry performs a synchronous walk.
       *
       * Alias for {@link PathScurryBase.iterateSync}
       */
      [Symbol.iterator]() {
        return this.iterateSync();
      }
      *iterateSync(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        if (!filter || filter(entry)) {
          yield withFileTypes ? entry : entry.fullpath();
        }
        const dirs = /* @__PURE__ */ new Set([entry]);
        for (const dir of dirs) {
          const entries = dir.readdirSync();
          for (const e of entries) {
            if (!filter || filter(e)) {
              yield withFileTypes ? e : e.fullpath();
            }
            let r = e;
            if (e.isSymbolicLink()) {
              if (!(follow && (r = e.realpathSync())))
                continue;
              if (r.isUnknown())
                r.lstatSync();
            }
            if (r.shouldWalk(dirs, walkFilter)) {
              dirs.add(r);
            }
          }
        }
      }
      stream(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        if (!filter || filter(entry)) {
          results.write(withFileTypes ? entry : entry.fullpath());
        }
        const dirs = /* @__PURE__ */ new Set();
        const queue = [entry];
        let processing = 0;
        const process2 = () => {
          let paused = false;
          while (!paused) {
            const dir = queue.shift();
            if (!dir) {
              if (processing === 0)
                results.end();
              return;
            }
            processing++;
            dirs.add(dir);
            const onReaddir = (er, entries, didRealpaths = false) => {
              if (er)
                return results.emit("error", er);
              if (follow && !didRealpaths) {
                const promises = [];
                for (const e of entries) {
                  if (e.isSymbolicLink()) {
                    promises.push(e.realpath().then((r) => r?.isUnknown() ? r.lstat() : r));
                  }
                }
                if (promises.length) {
                  Promise.all(promises).then(() => onReaddir(null, entries, true));
                  return;
                }
              }
              for (const e of entries) {
                if (e && (!filter || filter(e))) {
                  if (!results.write(withFileTypes ? e : e.fullpath())) {
                    paused = true;
                  }
                }
              }
              processing--;
              for (const e of entries) {
                const r = e.realpathCached() || e;
                if (r.shouldWalk(dirs, walkFilter)) {
                  queue.push(r);
                }
              }
              if (paused && !results.flowing) {
                results.once("drain", process2);
              } else if (!sync) {
                process2();
              }
            };
            let sync = true;
            dir.readdirCB(onReaddir, true);
            sync = false;
          }
        };
        process2();
        return results;
      }
      streamSync(entry = this.cwd, opts = {}) {
        if (typeof entry === "string") {
          entry = this.cwd.resolve(entry);
        } else if (!(entry instanceof PathBase)) {
          opts = entry;
          entry = this.cwd;
        }
        const { withFileTypes = true, follow = false, filter, walkFilter } = opts;
        const results = new minipass_1.Minipass({ objectMode: true });
        const dirs = /* @__PURE__ */ new Set();
        if (!filter || filter(entry)) {
          results.write(withFileTypes ? entry : entry.fullpath());
        }
        const queue = [entry];
        let processing = 0;
        const process2 = () => {
          let paused = false;
          while (!paused) {
            const dir = queue.shift();
            if (!dir) {
              if (processing === 0)
                results.end();
              return;
            }
            processing++;
            dirs.add(dir);
            const entries = dir.readdirSync();
            for (const e of entries) {
              if (!filter || filter(e)) {
                if (!results.write(withFileTypes ? e : e.fullpath())) {
                  paused = true;
                }
              }
            }
            processing--;
            for (const e of entries) {
              let r = e;
              if (e.isSymbolicLink()) {
                if (!(follow && (r = e.realpathSync())))
                  continue;
                if (r.isUnknown())
                  r.lstatSync();
              }
              if (r.shouldWalk(dirs, walkFilter)) {
                queue.push(r);
              }
            }
          }
          if (paused && !results.flowing)
            results.once("drain", process2);
        };
        process2();
        return results;
      }
      chdir(path = this.cwd) {
        const oldCwd = this.cwd;
        this.cwd = typeof path === "string" ? this.cwd.resolve(path) : path;
        this.cwd[setAsCwd](oldCwd);
      }
    };
    exports2.PathScurryBase = PathScurryBase;
    var PathScurryWin32 = class extends PathScurryBase {
      /**
       * separator for generating path strings
       */
      sep = "\\";
      constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, node_path_1.win32, "\\", { ...opts, nocase });
        this.nocase = nocase;
        for (let p = this.cwd; p; p = p.parent) {
          p.nocase = this.nocase;
        }
      }
      /**
       * @internal
       */
      parseRootPath(dir) {
        return node_path_1.win32.parse(dir).root.toUpperCase();
      }
      /**
       * @internal
       */
      newRoot(fs) {
        return new PathWin32(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs });
      }
      /**
       * Return true if the provided path string is an absolute path
       */
      isAbsolute(p) {
        return p.startsWith("/") || p.startsWith("\\") || /^[a-z]:(\/|\\)/i.test(p);
      }
    };
    exports2.PathScurryWin32 = PathScurryWin32;
    var PathScurryPosix = class extends PathScurryBase {
      /**
       * separator for generating path strings
       */
      sep = "/";
      constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = false } = opts;
        super(cwd, node_path_1.posix, "/", { ...opts, nocase });
        this.nocase = nocase;
      }
      /**
       * @internal
       */
      parseRootPath(_dir) {
        return "/";
      }
      /**
       * @internal
       */
      newRoot(fs) {
        return new PathPosix(this.rootPath, IFDIR, void 0, this.roots, this.nocase, this.childrenCache(), { fs });
      }
      /**
       * Return true if the provided path string is an absolute path
       */
      isAbsolute(p) {
        return p.startsWith("/");
      }
    };
    exports2.PathScurryPosix = PathScurryPosix;
    var PathScurryDarwin = class extends PathScurryPosix {
      constructor(cwd = process.cwd(), opts = {}) {
        const { nocase = true } = opts;
        super(cwd, { ...opts, nocase });
      }
    };
    exports2.PathScurryDarwin = PathScurryDarwin;
    exports2.Path = process.platform === "win32" ? PathWin32 : PathPosix;
    exports2.PathScurry = process.platform === "win32" ? PathScurryWin32 : process.platform === "darwin" ? PathScurryDarwin : PathScurryPosix;
  }
});

// node_modules/glob/dist/commonjs/pattern.js
var require_pattern = __commonJS({
  "node_modules/glob/dist/commonjs/pattern.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Pattern = void 0;
    var minimatch_1 = require_commonjs();
    var isPatternList = (pl) => pl.length >= 1;
    var isGlobList = (gl) => gl.length >= 1;
    var Pattern = class _Pattern {
      #patternList;
      #globList;
      #index;
      length;
      #platform;
      #rest;
      #globString;
      #isDrive;
      #isUNC;
      #isAbsolute;
      #followGlobstar = true;
      constructor(patternList, globList, index, platform) {
        if (!isPatternList(patternList)) {
          throw new TypeError("empty pattern list");
        }
        if (!isGlobList(globList)) {
          throw new TypeError("empty glob list");
        }
        if (globList.length !== patternList.length) {
          throw new TypeError("mismatched pattern list and glob list lengths");
        }
        this.length = patternList.length;
        if (index < 0 || index >= this.length) {
          throw new TypeError("index out of range");
        }
        this.#patternList = patternList;
        this.#globList = globList;
        this.#index = index;
        this.#platform = platform;
        if (this.#index === 0) {
          if (this.isUNC()) {
            const [p0, p1, p2, p3, ...prest] = this.#patternList;
            const [g0, g1, g2, g3, ...grest] = this.#globList;
            if (prest[0] === "") {
              prest.shift();
              grest.shift();
            }
            const p = [p0, p1, p2, p3, ""].join("/");
            const g = [g0, g1, g2, g3, ""].join("/");
            this.#patternList = [p, ...prest];
            this.#globList = [g, ...grest];
            this.length = this.#patternList.length;
          } else if (this.isDrive() || this.isAbsolute()) {
            const [p1, ...prest] = this.#patternList;
            const [g1, ...grest] = this.#globList;
            if (prest[0] === "") {
              prest.shift();
              grest.shift();
            }
            const p = p1 + "/";
            const g = g1 + "/";
            this.#patternList = [p, ...prest];
            this.#globList = [g, ...grest];
            this.length = this.#patternList.length;
          }
        }
      }
      /**
       * The first entry in the parsed list of patterns
       */
      pattern() {
        return this.#patternList[this.#index];
      }
      /**
       * true of if pattern() returns a string
       */
      isString() {
        return typeof this.#patternList[this.#index] === "string";
      }
      /**
       * true of if pattern() returns GLOBSTAR
       */
      isGlobstar() {
        return this.#patternList[this.#index] === minimatch_1.GLOBSTAR;
      }
      /**
       * true if pattern() returns a regexp
       */
      isRegExp() {
        return this.#patternList[this.#index] instanceof RegExp;
      }
      /**
       * The /-joined set of glob parts that make up this pattern
       */
      globString() {
        return this.#globString = this.#globString || (this.#index === 0 ? this.isAbsolute() ? this.#globList[0] + this.#globList.slice(1).join("/") : this.#globList.join("/") : this.#globList.slice(this.#index).join("/"));
      }
      /**
       * true if there are more pattern parts after this one
       */
      hasMore() {
        return this.length > this.#index + 1;
      }
      /**
       * The rest of the pattern after this part, or null if this is the end
       */
      rest() {
        if (this.#rest !== void 0)
          return this.#rest;
        if (!this.hasMore())
          return this.#rest = null;
        this.#rest = new _Pattern(this.#patternList, this.#globList, this.#index + 1, this.#platform);
        this.#rest.#isAbsolute = this.#isAbsolute;
        this.#rest.#isUNC = this.#isUNC;
        this.#rest.#isDrive = this.#isDrive;
        return this.#rest;
      }
      /**
       * true if the pattern represents a //unc/path/ on windows
       */
      isUNC() {
        const pl = this.#patternList;
        return this.#isUNC !== void 0 ? this.#isUNC : this.#isUNC = this.#platform === "win32" && this.#index === 0 && pl[0] === "" && pl[1] === "" && typeof pl[2] === "string" && !!pl[2] && typeof pl[3] === "string" && !!pl[3];
      }
      // pattern like C:/...
      // split = ['C:', ...]
      // XXX: would be nice to handle patterns like `c:*` to test the cwd
      // in c: for *, but I don't know of a way to even figure out what that
      // cwd is without actually chdir'ing into it?
      /**
       * True if the pattern starts with a drive letter on Windows
       */
      isDrive() {
        const pl = this.#patternList;
        return this.#isDrive !== void 0 ? this.#isDrive : this.#isDrive = this.#platform === "win32" && this.#index === 0 && this.length > 1 && typeof pl[0] === "string" && /^[a-z]:$/i.test(pl[0]);
      }
      // pattern = '/' or '/...' or '/x/...'
      // split = ['', ''] or ['', ...] or ['', 'x', ...]
      // Drive and UNC both considered absolute on windows
      /**
       * True if the pattern is rooted on an absolute path
       */
      isAbsolute() {
        const pl = this.#patternList;
        return this.#isAbsolute !== void 0 ? this.#isAbsolute : this.#isAbsolute = pl[0] === "" && pl.length > 1 || this.isDrive() || this.isUNC();
      }
      /**
       * consume the root of the pattern, and return it
       */
      root() {
        const p = this.#patternList[0];
        return typeof p === "string" && this.isAbsolute() && this.#index === 0 ? p : "";
      }
      /**
       * Check to see if the current globstar pattern is allowed to follow
       * a symbolic link.
       */
      checkFollowGlobstar() {
        return !(this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar);
      }
      /**
       * Mark that the current globstar pattern is following a symbolic link
       */
      markFollowGlobstar() {
        if (this.#index === 0 || !this.isGlobstar() || !this.#followGlobstar)
          return false;
        this.#followGlobstar = false;
        return true;
      }
    };
    exports2.Pattern = Pattern;
  }
});

// node_modules/glob/dist/commonjs/ignore.js
var require_ignore2 = __commonJS({
  "node_modules/glob/dist/commonjs/ignore.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Ignore = void 0;
    var minimatch_1 = require_commonjs();
    var pattern_js_1 = require_pattern();
    var defaultPlatform = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
    var Ignore = class {
      relative;
      relativeChildren;
      absolute;
      absoluteChildren;
      platform;
      mmopts;
      constructor(ignored, { nobrace, nocase, noext, noglobstar, platform = defaultPlatform }) {
        this.relative = [];
        this.absolute = [];
        this.relativeChildren = [];
        this.absoluteChildren = [];
        this.platform = platform;
        this.mmopts = {
          dot: true,
          nobrace,
          nocase,
          noext,
          noglobstar,
          optimizationLevel: 2,
          platform,
          nocomment: true,
          nonegate: true
        };
        for (const ign of ignored)
          this.add(ign);
      }
      add(ign) {
        const mm = new minimatch_1.Minimatch(ign, this.mmopts);
        for (let i = 0; i < mm.set.length; i++) {
          const parsed = mm.set[i];
          const globParts = mm.globParts[i];
          if (!parsed || !globParts) {
            throw new Error("invalid pattern object");
          }
          while (parsed[0] === "." && globParts[0] === ".") {
            parsed.shift();
            globParts.shift();
          }
          const p = new pattern_js_1.Pattern(parsed, globParts, 0, this.platform);
          const m = new minimatch_1.Minimatch(p.globString(), this.mmopts);
          const children = globParts[globParts.length - 1] === "**";
          const absolute = p.isAbsolute();
          if (absolute)
            this.absolute.push(m);
          else
            this.relative.push(m);
          if (children) {
            if (absolute)
              this.absoluteChildren.push(m);
            else
              this.relativeChildren.push(m);
          }
        }
      }
      ignored(p) {
        const fullpath = p.fullpath();
        const fullpaths = `${fullpath}/`;
        const relative3 = p.relative() || ".";
        const relatives = `${relative3}/`;
        for (const m of this.relative) {
          if (m.match(relative3) || m.match(relatives))
            return true;
        }
        for (const m of this.absolute) {
          if (m.match(fullpath) || m.match(fullpaths))
            return true;
        }
        return false;
      }
      childrenIgnored(p) {
        const fullpath = p.fullpath() + "/";
        const relative3 = (p.relative() || ".") + "/";
        for (const m of this.relativeChildren) {
          if (m.match(relative3))
            return true;
        }
        for (const m of this.absoluteChildren) {
          if (m.match(fullpath))
            return true;
        }
        return false;
      }
    };
    exports2.Ignore = Ignore;
  }
});

// node_modules/glob/dist/commonjs/processor.js
var require_processor = __commonJS({
  "node_modules/glob/dist/commonjs/processor.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Processor = exports2.SubWalks = exports2.MatchRecord = exports2.HasWalkedCache = void 0;
    var minimatch_1 = require_commonjs();
    var HasWalkedCache = class _HasWalkedCache {
      store;
      constructor(store = /* @__PURE__ */ new Map()) {
        this.store = store;
      }
      copy() {
        return new _HasWalkedCache(new Map(this.store));
      }
      hasWalked(target, pattern2) {
        return this.store.get(target.fullpath())?.has(pattern2.globString());
      }
      storeWalked(target, pattern2) {
        const fullpath = target.fullpath();
        const cached = this.store.get(fullpath);
        if (cached)
          cached.add(pattern2.globString());
        else
          this.store.set(fullpath, /* @__PURE__ */ new Set([pattern2.globString()]));
      }
    };
    exports2.HasWalkedCache = HasWalkedCache;
    var MatchRecord = class {
      store = /* @__PURE__ */ new Map();
      add(target, absolute, ifDir) {
        const n = (absolute ? 2 : 0) | (ifDir ? 1 : 0);
        const current = this.store.get(target);
        this.store.set(target, current === void 0 ? n : n & current);
      }
      // match, absolute, ifdir
      entries() {
        return [...this.store.entries()].map(([path, n]) => [
          path,
          !!(n & 2),
          !!(n & 1)
        ]);
      }
    };
    exports2.MatchRecord = MatchRecord;
    var SubWalks = class {
      store = /* @__PURE__ */ new Map();
      add(target, pattern2) {
        if (!target.canReaddir()) {
          return;
        }
        const subs = this.store.get(target);
        if (subs) {
          if (!subs.find((p) => p.globString() === pattern2.globString())) {
            subs.push(pattern2);
          }
        } else
          this.store.set(target, [pattern2]);
      }
      get(target) {
        const subs = this.store.get(target);
        if (!subs) {
          throw new Error("attempting to walk unknown path");
        }
        return subs;
      }
      entries() {
        return this.keys().map((k) => [k, this.store.get(k)]);
      }
      keys() {
        return [...this.store.keys()].filter((t) => t.canReaddir());
      }
    };
    exports2.SubWalks = SubWalks;
    var Processor = class _Processor {
      hasWalkedCache;
      matches = new MatchRecord();
      subwalks = new SubWalks();
      patterns;
      follow;
      dot;
      opts;
      constructor(opts, hasWalkedCache) {
        this.opts = opts;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.hasWalkedCache = hasWalkedCache ? hasWalkedCache.copy() : new HasWalkedCache();
      }
      processPatterns(target, patterns) {
        this.patterns = patterns;
        const processingSet = patterns.map((p) => [target, p]);
        for (let [t, pattern2] of processingSet) {
          this.hasWalkedCache.storeWalked(t, pattern2);
          const root = pattern2.root();
          const absolute = pattern2.isAbsolute() && this.opts.absolute !== false;
          if (root) {
            t = t.resolve(root === "/" && this.opts.root !== void 0 ? this.opts.root : root);
            const rest2 = pattern2.rest();
            if (!rest2) {
              this.matches.add(t, true, false);
              continue;
            } else {
              pattern2 = rest2;
            }
          }
          if (t.isENOENT())
            continue;
          let p;
          let rest;
          let changed = false;
          while (typeof (p = pattern2.pattern()) === "string" && (rest = pattern2.rest())) {
            const c = t.resolve(p);
            t = c;
            pattern2 = rest;
            changed = true;
          }
          p = pattern2.pattern();
          rest = pattern2.rest();
          if (changed) {
            if (this.hasWalkedCache.hasWalked(t, pattern2))
              continue;
            this.hasWalkedCache.storeWalked(t, pattern2);
          }
          if (typeof p === "string") {
            const ifDir = p === ".." || p === "" || p === ".";
            this.matches.add(t.resolve(p), absolute, ifDir);
            continue;
          } else if (p === minimatch_1.GLOBSTAR) {
            if (!t.isSymbolicLink() || this.follow || pattern2.checkFollowGlobstar()) {
              this.subwalks.add(t, pattern2);
            }
            const rp = rest?.pattern();
            const rrest = rest?.rest();
            if (!rest || (rp === "" || rp === ".") && !rrest) {
              this.matches.add(t, absolute, rp === "" || rp === ".");
            } else {
              if (rp === "..") {
                const tp = t.parent || t;
                if (!rrest)
                  this.matches.add(tp, absolute, true);
                else if (!this.hasWalkedCache.hasWalked(tp, rrest)) {
                  this.subwalks.add(tp, rrest);
                }
              }
            }
          } else if (p instanceof RegExp) {
            this.subwalks.add(t, pattern2);
          }
        }
        return this;
      }
      subwalkTargets() {
        return this.subwalks.keys();
      }
      child() {
        return new _Processor(this.opts, this.hasWalkedCache);
      }
      // return a new Processor containing the subwalks for each
      // child entry, and a set of matches, and
      // a hasWalkedCache that's a copy of this one
      // then we're going to call
      filterEntries(parent, entries) {
        const patterns = this.subwalks.get(parent);
        const results = this.child();
        for (const e of entries) {
          for (const pattern2 of patterns) {
            const absolute = pattern2.isAbsolute();
            const p = pattern2.pattern();
            const rest = pattern2.rest();
            if (p === minimatch_1.GLOBSTAR) {
              results.testGlobstar(e, pattern2, rest, absolute);
            } else if (p instanceof RegExp) {
              results.testRegExp(e, p, rest, absolute);
            } else {
              results.testString(e, p, rest, absolute);
            }
          }
        }
        return results;
      }
      testGlobstar(e, pattern2, rest, absolute) {
        if (this.dot || !e.name.startsWith(".")) {
          if (!pattern2.hasMore()) {
            this.matches.add(e, absolute, false);
          }
          if (e.canReaddir()) {
            if (this.follow || !e.isSymbolicLink()) {
              this.subwalks.add(e, pattern2);
            } else if (e.isSymbolicLink()) {
              if (rest && pattern2.checkFollowGlobstar()) {
                this.subwalks.add(e, rest);
              } else if (pattern2.markFollowGlobstar()) {
                this.subwalks.add(e, pattern2);
              }
            }
          }
        }
        if (rest) {
          const rp = rest.pattern();
          if (typeof rp === "string" && // dots and empty were handled already
          rp !== ".." && rp !== "" && rp !== ".") {
            this.testString(e, rp, rest.rest(), absolute);
          } else if (rp === "..") {
            const ep = e.parent || e;
            this.subwalks.add(ep, rest);
          } else if (rp instanceof RegExp) {
            this.testRegExp(e, rp, rest.rest(), absolute);
          }
        }
      }
      testRegExp(e, p, rest, absolute) {
        if (!p.test(e.name))
          return;
        if (!rest) {
          this.matches.add(e, absolute, false);
        } else {
          this.subwalks.add(e, rest);
        }
      }
      testString(e, p, rest, absolute) {
        if (!e.isNamed(p))
          return;
        if (!rest) {
          this.matches.add(e, absolute, false);
        } else {
          this.subwalks.add(e, rest);
        }
      }
    };
    exports2.Processor = Processor;
  }
});

// node_modules/glob/dist/commonjs/walker.js
var require_walker = __commonJS({
  "node_modules/glob/dist/commonjs/walker.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GlobStream = exports2.GlobWalker = exports2.GlobUtil = void 0;
    var minipass_1 = require_commonjs3();
    var ignore_js_1 = require_ignore2();
    var processor_js_1 = require_processor();
    var makeIgnore = (ignore2, opts) => typeof ignore2 === "string" ? new ignore_js_1.Ignore([ignore2], opts) : Array.isArray(ignore2) ? new ignore_js_1.Ignore(ignore2, opts) : ignore2;
    var GlobUtil = class {
      path;
      patterns;
      opts;
      seen = /* @__PURE__ */ new Set();
      paused = false;
      aborted = false;
      #onResume = [];
      #ignore;
      #sep;
      signal;
      maxDepth;
      includeChildMatches;
      constructor(patterns, path, opts) {
        this.patterns = patterns;
        this.path = path;
        this.opts = opts;
        this.#sep = !opts.posix && opts.platform === "win32" ? "\\" : "/";
        this.includeChildMatches = opts.includeChildMatches !== false;
        if (opts.ignore || !this.includeChildMatches) {
          this.#ignore = makeIgnore(opts.ignore ?? [], opts);
          if (!this.includeChildMatches && typeof this.#ignore.add !== "function") {
            const m = "cannot ignore child matches, ignore lacks add() method.";
            throw new Error(m);
          }
        }
        this.maxDepth = opts.maxDepth || Infinity;
        if (opts.signal) {
          this.signal = opts.signal;
          this.signal.addEventListener("abort", () => {
            this.#onResume.length = 0;
          });
        }
      }
      #ignored(path) {
        return this.seen.has(path) || !!this.#ignore?.ignored?.(path);
      }
      #childrenIgnored(path) {
        return !!this.#ignore?.childrenIgnored?.(path);
      }
      // backpressure mechanism
      pause() {
        this.paused = true;
      }
      resume() {
        if (this.signal?.aborted)
          return;
        this.paused = false;
        let fn = void 0;
        while (!this.paused && (fn = this.#onResume.shift())) {
          fn();
        }
      }
      onResume(fn) {
        if (this.signal?.aborted)
          return;
        if (!this.paused) {
          fn();
        } else {
          this.#onResume.push(fn);
        }
      }
      // do the requisite realpath/stat checking, and return the path
      // to add or undefined to filter it out.
      async matchCheck(e, ifDir) {
        if (ifDir && this.opts.nodir)
          return void 0;
        let rpc;
        if (this.opts.realpath) {
          rpc = e.realpathCached() || await e.realpath();
          if (!rpc)
            return void 0;
          e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        const s = needStat ? await e.lstat() : e;
        if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
          const target = await s.realpath();
          if (target && (target.isUnknown() || this.opts.stat)) {
            await target.lstat();
          }
        }
        return this.matchCheckTest(s, ifDir);
      }
      matchCheckTest(e, ifDir) {
        return e && (this.maxDepth === Infinity || e.depth() <= this.maxDepth) && (!ifDir || e.canReaddir()) && (!this.opts.nodir || !e.isDirectory()) && (!this.opts.nodir || !this.opts.follow || !e.isSymbolicLink() || !e.realpathCached()?.isDirectory()) && !this.#ignored(e) ? e : void 0;
      }
      matchCheckSync(e, ifDir) {
        if (ifDir && this.opts.nodir)
          return void 0;
        let rpc;
        if (this.opts.realpath) {
          rpc = e.realpathCached() || e.realpathSync();
          if (!rpc)
            return void 0;
          e = rpc;
        }
        const needStat = e.isUnknown() || this.opts.stat;
        const s = needStat ? e.lstatSync() : e;
        if (this.opts.follow && this.opts.nodir && s?.isSymbolicLink()) {
          const target = s.realpathSync();
          if (target && (target?.isUnknown() || this.opts.stat)) {
            target.lstatSync();
          }
        }
        return this.matchCheckTest(s, ifDir);
      }
      matchFinish(e, absolute) {
        if (this.#ignored(e))
          return;
        if (!this.includeChildMatches && this.#ignore?.add) {
          const ign = `${e.relativePosix()}/**`;
          this.#ignore.add(ign);
        }
        const abs = this.opts.absolute === void 0 ? absolute : this.opts.absolute;
        this.seen.add(e);
        const mark = this.opts.mark && e.isDirectory() ? this.#sep : "";
        if (this.opts.withFileTypes) {
          this.matchEmit(e);
        } else if (abs) {
          const abs2 = this.opts.posix ? e.fullpathPosix() : e.fullpath();
          this.matchEmit(abs2 + mark);
        } else {
          const rel = this.opts.posix ? e.relativePosix() : e.relative();
          const pre = this.opts.dotRelative && !rel.startsWith(".." + this.#sep) ? "." + this.#sep : "";
          this.matchEmit(!rel ? "." + mark : pre + rel + mark);
        }
      }
      async match(e, absolute, ifDir) {
        const p = await this.matchCheck(e, ifDir);
        if (p)
          this.matchFinish(p, absolute);
      }
      matchSync(e, absolute, ifDir) {
        const p = this.matchCheckSync(e, ifDir);
        if (p)
          this.matchFinish(p, absolute);
      }
      walkCB(target, patterns, cb) {
        if (this.signal?.aborted)
          cb();
        this.walkCB2(target, patterns, new processor_js_1.Processor(this.opts), cb);
      }
      walkCB2(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
          return cb();
        if (this.signal?.aborted)
          cb();
        if (this.paused) {
          this.onResume(() => this.walkCB2(target, patterns, processor, cb));
          return;
        }
        processor.processPatterns(target, patterns);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          tasks++;
          this.match(m, absolute, ifDir).then(() => next());
        }
        for (const t of processor.subwalkTargets()) {
          if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
            continue;
          }
          tasks++;
          const childrenCached = t.readdirCached();
          if (t.calledReaddir())
            this.walkCB3(t, childrenCached, processor, next);
          else {
            t.readdirCB((_, entries) => this.walkCB3(t, entries, processor, next), true);
          }
        }
        next();
      }
      walkCB3(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          tasks++;
          this.match(m, absolute, ifDir).then(() => next());
        }
        for (const [target2, patterns] of processor.subwalks.entries()) {
          tasks++;
          this.walkCB2(target2, patterns, processor.child(), next);
        }
        next();
      }
      walkCBSync(target, patterns, cb) {
        if (this.signal?.aborted)
          cb();
        this.walkCB2Sync(target, patterns, new processor_js_1.Processor(this.opts), cb);
      }
      walkCB2Sync(target, patterns, processor, cb) {
        if (this.#childrenIgnored(target))
          return cb();
        if (this.signal?.aborted)
          cb();
        if (this.paused) {
          this.onResume(() => this.walkCB2Sync(target, patterns, processor, cb));
          return;
        }
        processor.processPatterns(target, patterns);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          this.matchSync(m, absolute, ifDir);
        }
        for (const t of processor.subwalkTargets()) {
          if (this.maxDepth !== Infinity && t.depth() >= this.maxDepth) {
            continue;
          }
          tasks++;
          const children = t.readdirSync();
          this.walkCB3Sync(t, children, processor, next);
        }
        next();
      }
      walkCB3Sync(target, entries, processor, cb) {
        processor = processor.filterEntries(target, entries);
        let tasks = 1;
        const next = () => {
          if (--tasks === 0)
            cb();
        };
        for (const [m, absolute, ifDir] of processor.matches.entries()) {
          if (this.#ignored(m))
            continue;
          this.matchSync(m, absolute, ifDir);
        }
        for (const [target2, patterns] of processor.subwalks.entries()) {
          tasks++;
          this.walkCB2Sync(target2, patterns, processor.child(), next);
        }
        next();
      }
    };
    exports2.GlobUtil = GlobUtil;
    var GlobWalker = class extends GlobUtil {
      matches = /* @__PURE__ */ new Set();
      constructor(patterns, path, opts) {
        super(patterns, path, opts);
      }
      matchEmit(e) {
        this.matches.add(e);
      }
      async walk() {
        if (this.signal?.aborted)
          throw this.signal.reason;
        if (this.path.isUnknown()) {
          await this.path.lstat();
        }
        await new Promise((res, rej) => {
          this.walkCB(this.path, this.patterns, () => {
            if (this.signal?.aborted) {
              rej(this.signal.reason);
            } else {
              res(this.matches);
            }
          });
        });
        return this.matches;
      }
      walkSync() {
        if (this.signal?.aborted)
          throw this.signal.reason;
        if (this.path.isUnknown()) {
          this.path.lstatSync();
        }
        this.walkCBSync(this.path, this.patterns, () => {
          if (this.signal?.aborted)
            throw this.signal.reason;
        });
        return this.matches;
      }
    };
    exports2.GlobWalker = GlobWalker;
    var GlobStream = class extends GlobUtil {
      results;
      constructor(patterns, path, opts) {
        super(patterns, path, opts);
        this.results = new minipass_1.Minipass({
          signal: this.signal,
          objectMode: true
        });
        this.results.on("drain", () => this.resume());
        this.results.on("resume", () => this.resume());
      }
      matchEmit(e) {
        this.results.write(e);
        if (!this.results.flowing)
          this.pause();
      }
      stream() {
        const target = this.path;
        if (target.isUnknown()) {
          target.lstat().then(() => {
            this.walkCB(target, this.patterns, () => this.results.end());
          });
        } else {
          this.walkCB(target, this.patterns, () => this.results.end());
        }
        return this.results;
      }
      streamSync() {
        if (this.path.isUnknown()) {
          this.path.lstatSync();
        }
        this.walkCBSync(this.path, this.patterns, () => this.results.end());
        return this.results;
      }
    };
    exports2.GlobStream = GlobStream;
  }
});

// node_modules/glob/dist/commonjs/glob.js
var require_glob = __commonJS({
  "node_modules/glob/dist/commonjs/glob.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Glob = void 0;
    var minimatch_1 = require_commonjs();
    var node_url_1 = require("node:url");
    var path_scurry_1 = require_commonjs4();
    var pattern_js_1 = require_pattern();
    var walker_js_1 = require_walker();
    var defaultPlatform = typeof process === "object" && process && typeof process.platform === "string" ? process.platform : "linux";
    var Glob = class {
      absolute;
      cwd;
      root;
      dot;
      dotRelative;
      follow;
      ignore;
      magicalBraces;
      mark;
      matchBase;
      maxDepth;
      nobrace;
      nocase;
      nodir;
      noext;
      noglobstar;
      pattern;
      platform;
      realpath;
      scurry;
      stat;
      signal;
      windowsPathsNoEscape;
      withFileTypes;
      includeChildMatches;
      /**
       * The options provided to the constructor.
       */
      opts;
      /**
       * An array of parsed immutable {@link Pattern} objects.
       */
      patterns;
      /**
       * All options are stored as properties on the `Glob` object.
       *
       * See {@link GlobOptions} for full options descriptions.
       *
       * Note that a previous `Glob` object can be passed as the
       * `GlobOptions` to another `Glob` instantiation to re-use settings
       * and caches with a new pattern.
       *
       * Traversal functions can be called multiple times to run the walk
       * again.
       */
      constructor(pattern2, opts) {
        if (!opts)
          throw new TypeError("glob options required");
        this.withFileTypes = !!opts.withFileTypes;
        this.signal = opts.signal;
        this.follow = !!opts.follow;
        this.dot = !!opts.dot;
        this.dotRelative = !!opts.dotRelative;
        this.nodir = !!opts.nodir;
        this.mark = !!opts.mark;
        if (!opts.cwd) {
          this.cwd = "";
        } else if (opts.cwd instanceof URL || opts.cwd.startsWith("file://")) {
          opts.cwd = (0, node_url_1.fileURLToPath)(opts.cwd);
        }
        this.cwd = opts.cwd || "";
        this.root = opts.root;
        this.magicalBraces = !!opts.magicalBraces;
        this.nobrace = !!opts.nobrace;
        this.noext = !!opts.noext;
        this.realpath = !!opts.realpath;
        this.absolute = opts.absolute;
        this.includeChildMatches = opts.includeChildMatches !== false;
        this.noglobstar = !!opts.noglobstar;
        this.matchBase = !!opts.matchBase;
        this.maxDepth = typeof opts.maxDepth === "number" ? opts.maxDepth : Infinity;
        this.stat = !!opts.stat;
        this.ignore = opts.ignore;
        if (this.withFileTypes && this.absolute !== void 0) {
          throw new Error("cannot set absolute and withFileTypes:true");
        }
        if (typeof pattern2 === "string") {
          pattern2 = [pattern2];
        }
        this.windowsPathsNoEscape = !!opts.windowsPathsNoEscape || opts.allowWindowsEscape === false;
        if (this.windowsPathsNoEscape) {
          pattern2 = pattern2.map((p) => p.replace(/\\/g, "/"));
        }
        if (this.matchBase) {
          if (opts.noglobstar) {
            throw new TypeError("base matching requires globstar");
          }
          pattern2 = pattern2.map((p) => p.includes("/") ? p : `./**/${p}`);
        }
        this.pattern = pattern2;
        this.platform = opts.platform || defaultPlatform;
        this.opts = { ...opts, platform: this.platform };
        if (opts.scurry) {
          this.scurry = opts.scurry;
          if (opts.nocase !== void 0 && opts.nocase !== opts.scurry.nocase) {
            throw new Error("nocase option contradicts provided scurry option");
          }
        } else {
          const Scurry = opts.platform === "win32" ? path_scurry_1.PathScurryWin32 : opts.platform === "darwin" ? path_scurry_1.PathScurryDarwin : opts.platform ? path_scurry_1.PathScurryPosix : path_scurry_1.PathScurry;
          this.scurry = new Scurry(this.cwd, {
            nocase: opts.nocase,
            fs: opts.fs
          });
        }
        this.nocase = this.scurry.nocase;
        const nocaseMagicOnly = this.platform === "darwin" || this.platform === "win32";
        const mmo = {
          // default nocase based on platform
          ...opts,
          dot: this.dot,
          matchBase: this.matchBase,
          nobrace: this.nobrace,
          nocase: this.nocase,
          nocaseMagicOnly,
          nocomment: true,
          noext: this.noext,
          nonegate: true,
          optimizationLevel: 2,
          platform: this.platform,
          windowsPathsNoEscape: this.windowsPathsNoEscape,
          debug: !!this.opts.debug
        };
        const mms = this.pattern.map((p) => new minimatch_1.Minimatch(p, mmo));
        const [matchSet, globParts] = mms.reduce((set, m) => {
          set[0].push(...m.set);
          set[1].push(...m.globParts);
          return set;
        }, [[], []]);
        this.patterns = matchSet.map((set, i) => {
          const g = globParts[i];
          if (!g)
            throw new Error("invalid pattern object");
          return new pattern_js_1.Pattern(set, g, 0, this.platform);
        });
      }
      async walk() {
        return [
          ...await new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
            platform: this.platform,
            nocase: this.nocase,
            includeChildMatches: this.includeChildMatches
          }).walk()
        ];
      }
      walkSync() {
        return [
          ...new walker_js_1.GlobWalker(this.patterns, this.scurry.cwd, {
            ...this.opts,
            maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
            platform: this.platform,
            nocase: this.nocase,
            includeChildMatches: this.includeChildMatches
          }).walkSync()
        ];
      }
      stream() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
          platform: this.platform,
          nocase: this.nocase,
          includeChildMatches: this.includeChildMatches
        }).stream();
      }
      streamSync() {
        return new walker_js_1.GlobStream(this.patterns, this.scurry.cwd, {
          ...this.opts,
          maxDepth: this.maxDepth !== Infinity ? this.maxDepth + this.scurry.cwd.depth() : Infinity,
          platform: this.platform,
          nocase: this.nocase,
          includeChildMatches: this.includeChildMatches
        }).streamSync();
      }
      /**
       * Default sync iteration function. Returns a Generator that
       * iterates over the results.
       */
      iterateSync() {
        return this.streamSync()[Symbol.iterator]();
      }
      [Symbol.iterator]() {
        return this.iterateSync();
      }
      /**
       * Default async iteration function. Returns an AsyncGenerator that
       * iterates over the results.
       */
      iterate() {
        return this.stream()[Symbol.asyncIterator]();
      }
      [Symbol.asyncIterator]() {
        return this.iterate();
      }
    };
    exports2.Glob = Glob;
  }
});

// node_modules/glob/dist/commonjs/has-magic.js
var require_has_magic = __commonJS({
  "node_modules/glob/dist/commonjs/has-magic.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.hasMagic = void 0;
    var minimatch_1 = require_commonjs();
    var hasMagic2 = (pattern2, options = {}) => {
      if (!Array.isArray(pattern2)) {
        pattern2 = [pattern2];
      }
      for (const p of pattern2) {
        if (new minimatch_1.Minimatch(p, options).hasMagic())
          return true;
      }
      return false;
    };
    exports2.hasMagic = hasMagic2;
  }
});

// node_modules/glob/dist/commonjs/index.js
var require_commonjs5 = __commonJS({
  "node_modules/glob/dist/commonjs/index.js"(exports2) {
    "use strict";
    init_define_LATEXLINT_DEFAULTS();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.glob = exports2.sync = exports2.iterate = exports2.iterateSync = exports2.stream = exports2.streamSync = exports2.Ignore = exports2.hasMagic = exports2.Glob = exports2.unescape = exports2.escape = void 0;
    exports2.globStreamSync = globStreamSync;
    exports2.globStream = globStream;
    exports2.globSync = globSync2;
    exports2.globIterateSync = globIterateSync;
    exports2.globIterate = globIterate;
    var minimatch_1 = require_commonjs();
    var glob_js_1 = require_glob();
    var has_magic_js_1 = require_has_magic();
    var minimatch_2 = require_commonjs();
    Object.defineProperty(exports2, "escape", { enumerable: true, get: function() {
      return minimatch_2.escape;
    } });
    Object.defineProperty(exports2, "unescape", { enumerable: true, get: function() {
      return minimatch_2.unescape;
    } });
    var glob_js_2 = require_glob();
    Object.defineProperty(exports2, "Glob", { enumerable: true, get: function() {
      return glob_js_2.Glob;
    } });
    var has_magic_js_2 = require_has_magic();
    Object.defineProperty(exports2, "hasMagic", { enumerable: true, get: function() {
      return has_magic_js_2.hasMagic;
    } });
    var ignore_js_1 = require_ignore2();
    Object.defineProperty(exports2, "Ignore", { enumerable: true, get: function() {
      return ignore_js_1.Ignore;
    } });
    function globStreamSync(pattern2, options = {}) {
      return new glob_js_1.Glob(pattern2, options).streamSync();
    }
    function globStream(pattern2, options = {}) {
      return new glob_js_1.Glob(pattern2, options).stream();
    }
    function globSync2(pattern2, options = {}) {
      return new glob_js_1.Glob(pattern2, options).walkSync();
    }
    async function glob_(pattern2, options = {}) {
      return new glob_js_1.Glob(pattern2, options).walk();
    }
    function globIterateSync(pattern2, options = {}) {
      return new glob_js_1.Glob(pattern2, options).iterateSync();
    }
    function globIterate(pattern2, options = {}) {
      return new glob_js_1.Glob(pattern2, options).iterate();
    }
    exports2.streamSync = globStreamSync;
    exports2.stream = Object.assign(globStream, { sync: globStreamSync });
    exports2.iterateSync = globIterateSync;
    exports2.iterate = Object.assign(globIterate, {
      sync: globIterateSync
    });
    exports2.sync = Object.assign(globSync2, {
      stream: globStreamSync,
      iterate: globIterateSync
    });
    exports2.glob = Object.assign(glob_, {
      glob: glob_,
      globSync: globSync2,
      sync: exports2.sync,
      globStream,
      stream: exports2.stream,
      globStreamSync,
      streamSync: exports2.streamSync,
      globIterate,
      iterate: exports2.iterate,
      globIterateSync,
      iterateSync: exports2.iterateSync,
      Glob: glob_js_1.Glob,
      hasMagic: has_magic_js_1.hasMagic,
      escape: minimatch_1.escape,
      unescape: minimatch_1.unescape
    });
    exports2.glob.glob = exports2.glob;
  }
});

// src/cli/main.ts
var main_exports = {};
__export(main_exports, {
  main: () => main
});
module.exports = __toCommonJS(main_exports);
init_define_LATEXLINT_DEFAULTS();
var import_node_fs3 = require("node:fs");
var import_node_path3 = require("node:path");
var import_node_util = require("node:util");

// src/cli/config.ts
init_define_LATEXLINT_DEFAULTS();
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");

// src/util/constants.ts
init_define_LATEXLINT_DEFAULTS();

// src/cli/vscode.ts
init_define_LATEXLINT_DEFAULTS();
var Position = class _Position {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
  line;
  character;
  translate(lineDelta = 0, characterDelta = 0) {
    return new _Position(this.line + lineDelta, this.character + characterDelta);
  }
};
var Range = class {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  start;
  end;
};
var Uri = class _Uri {
  constructor(value) {
    this.value = value;
  }
  value;
  static parse(value) {
    return new _Uri(value);
  }
  toString() {
    return this.value;
  }
};
var window = {
  // Invalid user rules must fail the CLI instead of disappearing into a UI notice.
  showErrorMessage(message) {
    throw new Error(message);
  }
};
var TextCoordinates = class {
  constructor(text) {
    this.text = text;
    for (const match of text.matchAll(/\r\n|\r|\n/g))
      this.starts.push(match.index + match[0].length);
    this.lines = text.split(/\r\n|\r|\n/);
  }
  text;
  starts = [0];
  lines;
  offsetAt(position) {
    if (position.line < 0) return 0;
    if (position.line >= this.lines.length) return this.text.length;
    return this.starts[position.line] + Math.max(0, Math.min(position.character, this.lines[position.line].length));
  }
  positionAt(offset) {
    offset = Math.max(0, Math.min(offset, this.text.length));
    let low = 0;
    let high = this.starts.length;
    while (low + 1 < high) {
      const middle = Math.floor((low + high) / 2);
      if (this.starts[middle] > offset) high = middle;
      else low = middle;
    }
    return { line: low, character: Math.min(offset - this.starts[low], this.lines[low].length) };
  }
};
function createDocument(text, languageId) {
  const coordinates = new TextCoordinates(text);
  const offsetAt = (position) => coordinates.offsetAt(position);
  const positionAt = (offset) => {
    const pos = coordinates.positionAt(offset);
    return new Position(pos.line, pos.character);
  };
  return {
    languageId,
    offsetAt,
    positionAt,
    getText: (range) => range ? text.slice(offsetAt(range.start), offsetAt(range.end)) : text,
    lineCount: coordinates.lines.length,
    lineAt: (line) => {
      const lineNumber = typeof line === "number" ? line : line.line;
      const content = coordinates.lines[lineNumber];
      if (content === void 0) throw new Error(`Invalid line: ${lineNumber}`);
      const start = new Position(lineNumber, 0);
      const end = new Position(lineNumber, content.length);
      return {
        lineNumber,
        text: content,
        range: new Range(start, end),
        rangeIncludingLineBreak: new Range(start, lineNumber + 1 < coordinates.lines.length ? new Position(lineNumber + 1, 0) : end),
        firstNonWhitespaceCharacterIndex: content.search(/\S/) < 0 ? content.length : content.search(/\S/),
        isEmptyOrWhitespace: content.trim().length === 0
      };
    }
  };
}

// src/util/constants.ts
var extensionDisplayName = "LaTeX Lint";
var LLCodeStrings = [
  "LLAlignAnd",
  "LLAlignEnd",
  "LLAlignSingleLine",
  "LLArticle",
  "LLBig",
  "LLBracketCurly",
  "LLBracketMissing",
  "LLBracketRound",
  "LLColonEqq",
  "LLColonForMapping",
  "LLCref",
  "LLDots",
  "LLDoubleQuotes",
  "LLENDash",
  "LLEqnarray",
  "LLErrCompOps",
  "LLFootnote",
  "LLHeading",
  "LLLlGg",
  "LLMathPunctuation",
  "LLNonASCII",
  "LLNonstandard",
  "LLOperator",
  "LLPeriod",
  "LLRefEq",
  "LLSharp",
  "LLSI",
  "LLSortedCites",
  "LLSpaceEnglish",
  "LLSpaceJapanese",
  "LLT",
  "LLTextLint",
  "LLThousands",
  "LLTitle",
  "LLUnRef",
  "LLURL",
  "LLUserDefined"
];
var messages = {
  LLAlignAnd: "Use &%1 or %1{}& instead of %1& to avoid spacing issues in align-like environments.",
  LLAlignEnd: "\\\\ at the enf of align-like environments might be unnecessary.",
  LLAlignSingleLine: "For a single-line equation, the align-like environment can cause extra spacing. Consider using the equation environment instead.",
  LLArticle: 'Before "%1", "%2" might be more appropriate than "%3".',
  LLBig: "Consider using \\big%1 for subscripts and superscripts.",
  LLBracketCurly: 'Did you mean "%1(...)" instead of "%1{...}"? Add a space if intentional.',
  LLBracketMissing: 'Did you mean "%1{...}"? For example, write "x%1{23}" or "x%12 3" instead of "x%123".',
  LLBracketRound: 'Did you mean "%1{...}" instead of "%1(...)"?',
  LLColonEqq: "Consider using %1 instead of %2. %1 is more appropriate in this context and different from %2.",
  LLColonForMapping: "If this : is for a mapping, consider using \\colon instead. It is often used for ratios, and spacing around : is different from \\colon.",
  LLCref: "Consider using \\cref instead of \\ref. \\cref automatically adds suffixes and handles multiple references more gracefully.",
  LLDots: "Consider using an ellipsis command such as \\dots, \\ldots, \\cdots, or \\textellipsis instead of ... to avoid spacing issues.",
  LLDoubleQuotes: "For double quotes, use ``...''.",
  LLENDash: "If these are names, en-dash (--) might be appropriate. Otherwise, register as an exception to suppress this warning.",
  LLEqnarray: "Eqnarray is not recommended. Use align or gather instead.",
  LLErrCompOps: "These comparison operators seem to be incorrect.",
  LLFootnote: "The footnote marker will appear after unnecessary space.",
  LLHeading: "Found \\%1 without a preceding \\%2.",
  LLLlGg: "Consider using %1 instead of %2.",
  LLMathPunctuation: "The punctuation or the following sentence's capitalization seems to be wrong.",
  LLNonASCII: "This is a non-ASCII character. Is this intentional?",
  LLNonstandard: "This notation might be nonstandard in formal academic writing. Refer to the link for more details.",
  LLOperator: "For operators, use \\operatorname{...} or define a command with \\DeclareMathOperator to avoid spacing issues.",
  LLPeriod: 'Use "%1\\ " (backslash space) to avoid spacing issues.',
  LLRefEq: "Consider using \\eqref instead of \\ref for equations.",
  LLSharp: "If this sharp is for a number sign, consider using \\#.",
  LLSI: "If this is a unit, consider using the siunitx(\\SI{number}{unit}). It provides better spacing and formatting for units.",
  LLSortedCites: "Consider automatically sorting citations. See the link for details.",
  LLSpaceEnglish: "Consider adding a space at here.",
  LLSpaceJapanese: "Consider adding a space at here.",
  LLT: "Write ^\\top or ^\\mathsf{T} instead of ^T. If this is a power of T, write as ^{T}.",
  LLTextLint: "NO MESSAGE. SET EACH MESSAGE IN LL FILE.",
  LLThousands: 'Consider using "%1{,}%2" instead of "%1,%2". This can help avoid spacing issues and improve readability.',
  LLTitle: 'Should this be "%1"? Follow your preferred style guide and register as an exception if necessary.',
  LLUnRef: 'The label "%1" in the %2 environment is defined but unused in this file (possibly elsewhere).',
  LLURL: 'Query parameter "?%1=" might be unnecessary and could be removed for cleaner URLs.',
  LLUserDefined: "This violates your defined rule: %1"
};
var INFO = 2 /* Information */;
var WARN = 1 /* Warning */;
var severity = {
  LLAlignAnd: WARN,
  LLAlignEnd: WARN,
  LLAlignSingleLine: INFO,
  LLArticle: WARN,
  LLBig: WARN,
  LLBracketCurly: WARN,
  LLBracketMissing: INFO,
  LLBracketRound: WARN,
  LLColonEqq: WARN,
  LLColonForMapping: WARN,
  LLCref: INFO,
  LLDots: WARN,
  LLDoubleQuotes: WARN,
  LLENDash: INFO,
  LLEqnarray: WARN,
  LLErrCompOps: WARN,
  LLFootnote: WARN,
  LLHeading: WARN,
  LLLlGg: WARN,
  LLMathPunctuation: WARN,
  LLNonASCII: INFO,
  LLNonstandard: INFO,
  LLOperator: WARN,
  LLPeriod: WARN,
  LLRefEq: WARN,
  LLSharp: INFO,
  LLSI: WARN,
  LLSortedCites: INFO,
  LLSpaceEnglish: INFO,
  LLSpaceJapanese: INFO,
  LLT: INFO,
  LLTextLint: INFO,
  LLThousands: WARN,
  LLTitle: INFO,
  LLUnRef: INFO,
  LLURL: WARN,
  LLUserDefined: WARN
};

// src/cli/config.ts
var defaults = define_LATEXLINT_DEFAULTS_default;
var version = "2.0.2";
function stringArray(value, key) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string"))
    throw new Error(`${key} must be an array of strings`);
  return value;
}
function validateRule(name) {
  if (!LLCodeStrings.includes(name)) throw new Error(`Unknown rule: ${name}`);
}
function readConfiguration(cwd, filename, enable = [], disable = []) {
  const config = {
    disabledRules: [...defaults.disabledRules],
    exceptions: [...defaults.exceptions],
    LLCrefExceptions: [...defaults.LLCrefExceptions],
    userDefinedRules: [...defaults.userDefinedRules]
  };
  const configPath = (0, import_node_path.resolve)(cwd, filename ?? ".latexlint.json");
  let data = {};
  if (filename !== void 0 || (0, import_node_fs.existsSync)(configPath)) {
    const parsed = JSON.parse((0, import_node_fs.readFileSync)(configPath, "utf8").replace(/^\uFEFF/, ""));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("Configuration must be a JSON object");
    data = parsed;
  }
  let disabled = new Set(config.disabledRules);
  if ("default" in data) {
    if (typeof data.default !== "boolean") throw new Error("default must be true or false");
    disabled = new Set(data.default ? [] : LLCodeStrings);
  }
  for (const [key, value] of Object.entries(data)) {
    if (key === "default") continue;
    if (key === "exceptions" || key === "LLCrefExceptions" || key === "userDefinedRules") {
      config[key] = stringArray(value, key);
      continue;
    }
    validateRule(key);
    if (typeof value !== "boolean") throw new Error(`${key} must be true or false`);
    if (value) disabled.delete(key);
    else disabled.add(key);
  }
  for (const name of enable) {
    validateRule(name);
    disabled.delete(name);
  }
  for (const name of disable) {
    validateRule(name);
    disabled.add(name);
  }
  for (const pattern2 of config.userDefinedRules)
    try {
      new RegExp(pattern2, "g");
    } catch {
      throw new Error(`Invalid regular expression in userDefinedRules: ${pattern2}`);
    }
  config.disabledRules = [...disabled];
  return config;
}

// src/cli/files.ts
init_define_LATEXLINT_DEFAULTS();
var import_node_fs2 = require("node:fs");
var import_node_path2 = require("node:path");
var import_ignore = __toESM(require_ignore());
var { globSync, hasMagic } = require_commonjs5();
var posix = (path) => path.split(import_node_path2.sep).join("/");
function collectFiles(inputs, options) {
  const { cwd, dot = false } = options;
  const globOptions = { cwd, dot, nodir: true, absolute: true, windowsPathsNoEscape: true };
  const expand = (input, exclusions = false) => {
    const absolute = (0, import_node_path2.resolve)(cwd, input);
    if ((0, import_node_fs2.existsSync)(absolute)) {
      if ((0, import_node_fs2.statSync)(absolute).isDirectory())
        return globSync("**/*.{tex,md}", { ...globOptions, cwd: absolute });
      return [absolute];
    }
    if (hasMagic(input, { magicalBraces: true, windowsPathsNoEscape: true })) return globSync(input, globOptions);
    return exclusions ? [] : [absolute];
  };
  const ignored = new Set((options.ignore ?? []).flatMap((input) => expand(input, true)));
  const ignorePath = (0, import_node_path2.resolve)(cwd, options["ignore-path"] ?? ".latexlintignore");
  const matcher = (0, import_ignore.default)();
  if (options["ignore-path"] !== void 0 || (0, import_node_fs2.existsSync)(ignorePath))
    matcher.add((0, import_node_fs2.readFileSync)(ignorePath, "utf8"));
  return [...new Set(inputs.flatMap((input) => expand(input)))].filter((filename) => {
    if (ignored.has(filename)) return false;
    const fromCwd = posix((0, import_node_path2.relative)(cwd, filename));
    return (0, import_node_path2.isAbsolute)(fromCwd) || fromCwd === ".." || fromCwd.startsWith("../") || !matcher.ignores(fromCwd);
  }).sort();
}

// src/cli/engine.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/lintWithPerformanceTracking.ts
init_define_LATEXLINT_DEFAULTS();

// src/LLText/createLLTextVSCode.ts
init_define_LATEXLINT_DEFAULTS();

// src/LLText/createLLText.ts
init_define_LATEXLINT_DEFAULTS();

// src/LLText/computeValidRanges.ts
init_define_LATEXLINT_DEFAULTS();
function computeValidRanges(text, languageId) {
  let invalidRanges = [];
  if (languageId === "latex")
    invalidRanges = computeLaTeXInvalidRanges(text, invalidRanges);
  else if (languageId === "markdown")
    invalidRanges = computeMarkdownCodeBlockRanges(text);
  else console.warn(`Unknown languageId ${languageId} in computeValidRanges.`);
  const mergedInvalidRanges = mergeRanges(invalidRanges);
  const validRanges = invertRanges(mergedInvalidRanges, text.length);
  return validRanges.filter(([start, end]) => end - start > 0);
}
function computeLaTeXInvalidRanges(text, verbatimRanges = []) {
  const verbatimLikeEnvs = [
    "verbatim",
    "lstlisting",
    // source code listing, provided by listings package
    "tikzpicture",
    // TikZ graphics, provided by TikZ package
    "CCSXML",
    // ACM CCS concepts XML block
    "comment",
    // comment package (In Pattern interface, not comment type)
    "filecontents",
    // filecontents / filecontents* environment
    "minted",
    "Verbatim",
    // fancyvrb package
    "BVerbatim",
    "LVerbatim",
    "SaveVerbatim",
    "VerbatimOut",
    "thebibliography"
    // bibliography environment
  ];
  const ifFalseRanges = mergeRanges(computeIfFalseInvalidRanges(text));
  const isInsideIfFalseRange = (index) => ifFalseRanges.some(([start, end]) => start <= index && index < end);
  const patterns = [];
  const escapedVerbatimLikeEnvs = verbatimLikeEnvs.map(
    (env) => env.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const envAlternation = escapedVerbatimLikeEnvs.join("|");
  const envCommandRegex2 = new RegExp(
    `\\\\(begin|end)\\{(${envAlternation})\\*?\\}`,
    "g"
  );
  let match;
  while ((match = envCommandRegex2.exec(text)) !== null)
    if (!isInsideIfFalseRange(match.index))
      patterns.push({
        type: match[1] === "begin" ? "verbsBegin" : "verbsEnd",
        index: match.index,
        env: match[2],
        length: match[0].length
      });
  const verbRegex = /\\verb(?![a-zA-Z])/g;
  while ((match = verbRegex.exec(text)) !== null)
    if (!isInsideIfFalseRange(match.index))
      patterns.push({ type: "verbsInline", index: match.index });
  const commentRegex = /%/g;
  while ((match = commentRegex.exec(text)) !== null)
    if (!isInsideIfFalseRange(match.index))
      patterns.push({ type: "comment", index: match.index });
  patterns.sort((a, b) => a.index - b.index);
  const invalidRanges = [...verbatimRanges, ...ifFalseRanges];
  let i = 0;
  while (i < patterns.length) {
    const pattern2 = patterns[i];
    if (pattern2.type === "verbsBegin") {
      const env = pattern2.env;
      const beginPos = pattern2.index;
      let endPos = -1;
      for (let j = i + 1; j < patterns.length; j++)
        if (patterns[j].type === "verbsEnd" && patterns[j].env === env) {
          endPos = patterns[j].index + (patterns[j].length ?? 0);
          patterns.splice(i + 1, j - i);
          break;
        }
      if (endPos !== -1) invalidRanges.push([beginPos, endPos]);
      i++;
    } else if (pattern2.type === "verbsInline") {
      const verbPos = pattern2.index;
      const afterVerb = verbPos + 5;
      if (afterVerb < text.length) {
        const delimiter = text[afterVerb];
        const restOfLine = text.substring(afterVerb + 1);
        const newlinePos = restOfLine.indexOf("\n");
        const delimiterPos = restOfLine.indexOf(delimiter);
        if (delimiterPos !== -1 && (newlinePos === -1 || delimiterPos < newlinePos)) {
          const endPos = afterVerb + 1 + delimiterPos + 1;
          invalidRanges.push([verbPos, endPos]);
          let j = i + 1;
          while (j < patterns.length && patterns[j].index < endPos)
            patterns.splice(j, 1);
        } else {
          const lineEnd = newlinePos === -1 ? text.length : afterVerb + 1 + newlinePos;
          invalidRanges.push([verbPos, lineEnd]);
          console.warn(
            `\\verb delimiter '${delimiter}' not closed before line end at position ${verbPos}`
          );
          let j = i + 1;
          while (j < patterns.length && patterns[j].index < lineEnd)
            patterns.splice(j, 1);
        }
      }
      i++;
    } else if (pattern2.type === "comment") {
      const commentPos = pattern2.index;
      let backslashCount = 0;
      for (let pos = commentPos - 1; pos >= 0 && text[pos] === "\\"; pos--)
        backslashCount++;
      if (backslashCount % 2 === 1) {
        i++;
        continue;
      }
      const restOfText = text.substring(commentPos + 1);
      const newlinePos = restOfText.indexOf("\n");
      const lineEnd = newlinePos === -1 ? text.length : commentPos + 1 + newlinePos;
      invalidRanges.push([commentPos, lineEnd]);
      let j = i + 1;
      while (j < patterns.length && patterns[j].index < lineEnd)
        patterns.splice(j, 1);
      i++;
    } else i++;
  }
  return invalidRanges;
}
function computeIfFalseInvalidRanges(text) {
  const ifFalseBeginRegex = /\\if0(?![a-zA-Z])|\\iffalse(?![a-zA-Z])/g;
  const ifTrueBeginRegex = /\\if1(?![a-zA-Z])|\\iftrue(?![a-zA-Z])/g;
  const ifEndRegex = /\\fi(?![a-zA-Z])/g;
  const tokens = [];
  let match;
  while ((match = ifFalseBeginRegex.exec(text)) !== null)
    tokens.push({ type: "ifFalseBegin", index: match.index });
  while ((match = ifTrueBeginRegex.exec(text)) !== null)
    tokens.push({ type: "ifTrueBegin", index: match.index });
  while ((match = ifEndRegex.exec(text)) !== null)
    tokens.push({ type: "ifEnd", index: match.index });
  tokens.sort((a, b) => a.index - b.index);
  const stack = [];
  const ranges = [];
  for (const token of tokens) {
    if (token.type === "ifFalseBegin" || token.type === "ifTrueBegin") {
      stack.push({ type: token.type, index: token.index });
      continue;
    }
    const beginToken = stack.pop();
    if (!beginToken) continue;
    if (beginToken.type === "ifFalseBegin")
      ranges.push([beginToken.index, token.index + 3]);
  }
  return ranges;
}
function computeMarkdownCodeBlockRanges(text) {
  const patterns = [];
  const commentBeginRegex = /<!--/g;
  const commentEndRegex = /-->/g;
  let match;
  while ((match = commentBeginRegex.exec(text)) !== null)
    patterns.push({ type: "commentBegin", index: match.index });
  while ((match = commentEndRegex.exec(text)) !== null)
    patterns.push({ type: "commentEnd", index: match.index });
  const codeBlockRegex = /^```/gm;
  while ((match = codeBlockRegex.exec(text)) !== null)
    patterns.push({ type: "codeBlockFence", index: match.index });
  patterns.sort((a, b) => a.index - b.index);
  const invalidRanges = [];
  let i = 0;
  while (i < patterns.length) {
    const pattern2 = patterns[i];
    if (pattern2.type === "commentBegin") {
      const beginPos = pattern2.index;
      let endPos = -1;
      for (let j = i + 1; j < patterns.length; j++)
        if (patterns[j].type === "commentEnd") {
          endPos = patterns[j].index + 3;
          patterns.splice(i + 1, j - i);
          break;
        }
      if (endPos !== -1) invalidRanges.push([beginPos, endPos]);
      i++;
    } else if (pattern2.type === "codeBlockFence") {
      const beginPos = pattern2.index;
      let endPos = -1;
      for (let j = i + 1; j < patterns.length; j++)
        if (patterns[j].type === "codeBlockFence") {
          const fencePos = patterns[j].index;
          const restOfText = text.substring(fencePos);
          const newlinePos = restOfText.indexOf("\n");
          endPos = newlinePos === -1 ? text.length : fencePos + newlinePos + 1;
          patterns.splice(i + 1, j - i);
          break;
        }
      if (endPos !== -1) invalidRanges.push([beginPos, endPos]);
      i++;
    } else i++;
  }
  return invalidRanges;
}
function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  const sorted = ranges.sort((a, b) => {
    return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];
  });
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];
    if (current[0] <= lastMerged[1])
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    else merged.push(current);
  }
  return merged;
}
function invertRanges(invalidRanges, textLength) {
  if (invalidRanges.length === 0) return [[0, textLength]];
  const validRanges = [];
  let currentPos = 0;
  for (const [start, end] of invalidRanges) {
    if (currentPos < start) validRanges.push([currentPos, start]);
    currentPos = Math.max(currentPos, end);
  }
  if (currentPos < textLength) validRanges.push([currentPos, textLength]);
  return validRanges;
}

// src/LLText/createLLText.ts
function createLLText(text, languageId, diagnostics, computeLinePos) {
  const validRanges = computeValidRanges(text, languageId);
  const disabledLines = computeDisabledLines(text, languageId);
  const alignLikeEnvs2 = enumAlignEnvs(
    text,
    diagnostics,
    validRanges,
    computeLinePos
  );
  const idxOfBeginDocument = text.indexOf("\\begin{document}");
  return {
    text,
    disabledLines,
    alignLikeEnvs: alignLikeEnvs2,
    validRanges,
    idxOfBeginDocument,
    isValid: (idx) => isPositionValid(idx, validRanges),
    isPreamble: (idx) => idxOfBeginDocument !== -1 && idx < idxOfBeginDocument
  };
}
function computeDisabledLines(text, languageId) {
  const lines = text.split(/\r?\n/);
  const disabledLines = [];
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++)
    if (isDisableDirectiveLine(lines[lineNumber], languageId)) disabledLines.push(lineNumber);
  return disabledLines;
}
function isDisableDirectiveLine(line, languageId) {
  if (languageId === "latex") return /%\s*LLDisable/.test(line);
  if (languageId === "markdown") return /<!--\s*LLDisable/.test(line);
  return false;
}
function isPositionValid(idx, validRanges) {
  for (const [start, end] of validRanges) {
    if (end < idx) continue;
    if (start <= idx && idx <= end) return true;
    if (idx < start) return false;
  }
  return false;
}
var alignLikeEnvs = [
  "align",
  "alignat",
  "aligned",
  "split",
  // No problem with LLAlignEnd
  "gather"
  // ignore `eqnarray` because we have LLEqnarray
];
var alignLikeEnvCommandRegexSource = "\\\\(begin|end)\\{(" + alignLikeEnvs.slice().sort((a, b) => b.length - a.length).join("|") + ")(\\*?)\\}";
var envCommandRegex = new RegExp(alignLikeEnvCommandRegexSource, "g");
var alignLikeEnvDeltas = {};
for (let i = 0; i < alignLikeEnvs.length; i++)
  alignLikeEnvDeltas[alignLikeEnvs[i]] = 2 * i + 1;
function enumAlignEnvs(txt, diagnostics, validRanges, computeLinePos) {
  const cmdPairs = [];
  for (const match of txt.matchAll(envCommandRegex)) {
    if (match.index === void 0) continue;
    if (!isPositionValid(match.index, validRanges)) continue;
    const env = match[2];
    const deltaBase = alignLikeEnvDeltas[env];
    const delta = (match[1] === "begin" ? 1 : -1) * (deltaBase + (match[3] === "*" ? 1 : 0));
    cmdPairs.push({ index: match.index, delta, depth: 0 });
  }
  cmdPairs.sort((a, b) => a.index - b.index);
  const STs = [];
  const stack = [];
  let isMatched = -1;
  for (const pair of cmdPairs)
    if (pair.delta > 0) stack.push(pair);
    else {
      const top = stack.pop();
      if (top === void 0 || top.delta + pair.delta !== 0) {
        isMatched = pair.index;
        break;
      } else STs.push([top.index, pair.index]);
    }
  if (isMatched !== -1 || stack.length !== 0) {
    const errorIndex = isMatched !== -1 ? isMatched : stack[0].index;
    const { line, character } = computeLinePos(errorIndex);
    const position = new Position(line, character);
    const range = new Range(position, position);
    diagnostics.push({
      message: `Unmatched alignment environment commands at Line ${line + 1}, Character ${character + 1}. Are the commands properly paired?`,
      range,
      severity: 0 /* Error */,
      source: extensionDisplayName
    });
    return [];
  }
  return STs;
}

// src/LLText/createLLTextVSCode.ts
function createLLTextVSCode(doc) {
  const diagnostics = [];
  const txt = createLLText(doc.getText(), doc.languageId, diagnostics, doc.positionAt);
  const ret = [txt, diagnostics];
  return ret;
}

// src/util/rules.ts
init_define_LATEXLINT_DEFAULTS();

// src/LL/LLAlignAnd.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/match2range.ts
init_define_LATEXLINT_DEFAULTS();
function match2range(doc, match, delta) {
  const startPos = doc.positionAt((delta || 0) + match.index);
  const endPos = doc.positionAt((delta || 0) + match.index + match[0].length);
  return new Range(startPos, endPos);
}

// src/util/ranges2diagnostics.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/getCodeWithURI.ts
init_define_LATEXLINT_DEFAULTS();
function getCodeWithURI(code) {
  return {
    value: code,
    target: Uri.parse(`https://github.com/HirokiHamaguchi/latexlint?tab=readme-ov-file#${code.toLowerCase()}`)
  };
}

// src/util/ranges2diagnostics.ts
function ranges2diagnostics(code, messages2, ranges) {
  if (typeof messages2 === "string")
    messages2 = [messages2];
  else
    console.assert(messages2.length === ranges.length);
  return ranges.map((range, i) => ({
    code: getCodeWithURI(code),
    message: messages2[messages2.length === 1 ? 0 : i],
    range,
    severity: severity[code],
    source: extensionDisplayName
  }));
}

// src/LL/LLAlignAnd.ts
var ALIGN_OPERATOR_BEFORE_AMPERSAND_PATTERN = /(=|<|>|\\neq|\\leq|\\geq|\\le|\\ge|\\succ|\\prec|\\succeq|\\preceq|\\approx|\\asymp|\\iff|\\implies|\\impliedby)\s*&/g;
function LLAlignAnd(doc, txt) {
  const code = "LLAlignAnd";
  const message = messages[code];
  const replacedMessages = [];
  const ranges = [];
  for (const [s, t] of txt.alignLikeEnvs) {
    const match = txt.text.slice(s, t).matchAll(ALIGN_OPERATOR_BEFORE_AMPERSAND_PATTERN);
    for (const m of match) {
      const range = match2range(doc, m, s);
      if (!txt.isValid(doc.offsetAt(range.start))) continue;
      ranges.push(range);
      replacedMessages.push(message.replaceAll("%1", m[1]));
    }
  }
  return ranges2diagnostics(code, replacedMessages, ranges);
}

// src/LL/LLAlignEnd.ts
init_define_LATEXLINT_DEFAULTS();
function LLAlignEnd(doc, txt) {
  const code = "LLAlignEnd";
  const message = messages[code];
  const ranges = [];
  for (const [s, t] of txt.alignLikeEnvs) {
    const txt2 = txt.text.slice(s, t);
    if (txt2.startsWith("\\begin{split")) continue;
    let i = txt2.length - 1;
    while (i >= 0 && /\s/.test(txt2[i])) i--;
    if (i >= 1 && txt2[i] === "\\" && txt2[i - 1] === "\\") {
      const startPos = doc.positionAt(s + i - 1);
      const endPos = startPos.translate(0, 2);
      ranges.push(new Range(startPos, endPos));
    }
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLAlignSingleLine.ts
init_define_LATEXLINT_DEFAULTS();
function LLAlignSingleLine(doc, txt) {
  const code = "LLAlignSingleLine";
  const message = messages[code];
  const ranges = [];
  for (const [s, t] of txt.alignLikeEnvs)
    if (!txt.text.slice(s, t).includes("\\\\")) {
      const startPos = doc.positionAt(s);
      console.assert(txt.text.slice(s, s + 7) === "\\begin{");
      let endPosIdx = s + 7;
      while (txt.text[endPosIdx] !== "}" && endPosIdx < t) endPosIdx++;
      ranges.push(new Range(startPos, doc.positionAt(endPosIdx + 1)));
    }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLArticle.ts
init_define_LATEXLINT_DEFAULTS();
var LETTERS_WITH_VOWEL_SOUND = /* @__PURE__ */ new Set([
  "a",
  "e",
  "f",
  "h",
  "i",
  "l",
  "m",
  "n",
  "o",
  "r",
  "s",
  "x"
]);
function isWrongArticle(article, content) {
  const normalizedArticle = article.toLowerCase();
  const match = content.match(/^([^_^]*)([_^].*)?$/);
  if (!match) return false;
  let main2 = match[1];
  const suffix = match[2];
  if (suffix) {
    const rest = suffix.slice(1);
    if (!/^.$/.test(rest) && // single character
    !/^\\[a-zA-Z]+$/.test(rest) && // command like \alpha
    !/^\{[^}]*\}$/.test(rest))
      return false;
  }
  let target = null;
  if (main2.length === 1)
    target = main2.toLowerCase();
  if (main2 === "\\ell")
    target = "l";
  const fontMatch = main2.match(
    /^\\(mathbb|mathcal|mathrm|mathbf)\{([^}]+)\}$/
  );
  if (fontMatch) {
    const inner = fontMatch[2];
    if (inner.length !== 1 && inner !== "\\ell") return false;
    target = inner === "\\ell" ? "l" : inner.toLowerCase();
  }
  if (!target) return false;
  if (LETTERS_WITH_VOWEL_SOUND.has(target))
    return normalizedArticle === "a";
  else if ("a" <= target && target <= "z" || "A" <= target && target <= "Z")
    return normalizedArticle === "an";
  return false;
}
var ABBREVIATION_SET = /* @__PURE__ */ new Set([
  "EM",
  "EVD",
  "FFT",
  "NP",
  "LSTM",
  "LTI",
  "MLE",
  "MSE",
  "ODE",
  "RNN",
  "RKHS",
  "SDE",
  "SVD",
  "SVM",
  "XOR"
]);
var ARTICLE_TARGET_REGEX = /\b([Aa](?:n)?) (\$|\\\(|[A-Z])/g;
function LLArticle(doc, txt) {
  const code = "LLArticle";
  const messageTemplate = messages[code];
  const message = [];
  const ranges = [];
  for (const match of txt.text.matchAll(ARTICLE_TARGET_REGEX)) {
    if (!txt.isValid(match.index)) continue;
    const article = match[1];
    const target = match[2];
    const startIdx = match.index + article.length + 1;
    let wordEndIdx = -1;
    if (target === "$" || target === "\\(") {
      const endIdx = txt.text.indexOf(target === "$" ? "$" : "\\)", startIdx + target.length);
      if (endIdx === -1) continue;
      const content = txt.text.substring(startIdx + target.length, endIdx);
      if (!isWrongArticle(article, content)) continue;
      wordEndIdx = endIdx + target.length;
    } else {
      if (!LETTERS_WITH_VOWEL_SOUND.has(target.toLowerCase())) continue;
      if (article !== "a" && article !== "A") continue;
      let endIdx = startIdx + 1;
      while (endIdx < txt.text.length && "A" <= txt.text[endIdx] && txt.text[endIdx] <= "Z")
        endIdx++;
      const content = txt.text.substring(startIdx, endIdx);
      if (!ABBREVIATION_SET.has(content)) continue;
      wordEndIdx = endIdx;
    }
    const word = txt.text.substring(startIdx, wordEndIdx);
    let correctArticle = "a";
    if (article === "a")
      correctArticle = "an";
    else if (article === "an")
      correctArticle = "a";
    else if (article === "A")
      correctArticle = "An";
    else if (article === "An")
      correctArticle = "A";
    else {
      console.error(`Unexpected article: ${article}`);
      continue;
    }
    message.push(messageTemplate.replace("%1", word).replace("%2", correctArticle).replace("%3", article));
    const startPos = doc.positionAt(match.index);
    const endPos = doc.positionAt(wordEndIdx);
    ranges.push(new Range(startPos, endPos));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLBig.ts
init_define_LATEXLINT_DEFAULTS();
function getBracedArgument(text, openBraceIndex) {
  let depth = 0;
  if (text[openBraceIndex] !== "{") return text[openBraceIndex];
  for (let i = openBraceIndex; i < text.length; i++)
    if (text[i] === "{")
      depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return text.slice(openBraceIndex + 1, i);
    }
  return void 0;
}
function LLBig(doc, txt) {
  const code = "LLBig";
  let message = [];
  let ranges = [];
  for (const match of txt.text.matchAll(/\\(cap|cup|odot|oplus|otimes|sqcup|uplus|vee|wedge)_/g)) {
    if (!txt.isValid(match.index)) continue;
    const subscript = getBracedArgument(txt.text, match.index + match[0].length);
    if (!subscript) continue;
    let ok = false;
    if (/(,|:|=|<|>|\\(?:leq?|geq?|in|mid)\b)/.test(subscript)) ok = true;
    if (subscript.length === 1 && "ijklmn".includes(subscript)) ok = true;
    if (!ok) continue;
    message.push(messages[code].replaceAll("%1", match[1]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLBracketCurly.ts
init_define_LATEXLINT_DEFAULTS();
function LLBracketCurly(doc, txt) {
  const code = "LLBracketCurly";
  let message = [];
  let ranges = [];
  for (const match of txt.text.matchAll(/\\(min|max)\{/g)) {
    if (!txt.isValid(match.index)) continue;
    message.push(messages[code].replaceAll("%1", match[1]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLBracketMissing.ts
init_define_LATEXLINT_DEFAULTS();

// src/LLText/isLabelOrURL.ts
init_define_LATEXLINT_DEFAULTS();
var labelKeywords = [
  "fig",
  "tab",
  "ref",
  "cite",
  "cref",
  "eqref",
  "label",
  "input",
  "include",
  "bibitem",
  "bibliography",
  "begin",
  "end"
];
var regexFileExt = /\.(?:png|pdf|jpg|jpeg|gif|bmp|eps|svg|tiff|tex|py|cpp|ts|js|bib)/;
function isLabelOrURL(txt, match) {
  let i = match.index;
  let j = match.index + match[0].length;
  while (i > 1 && !/\s/.test(txt[i - 1])) i--;
  while (j < txt.length - 1 && !/\s/.test(txt[j])) j++;
  const wordShort = txt.slice(i, j);
  if (wordShort.includes("http")) return true;
  if (/[a-zA-Z]+_[a-zA-Z]+_[a-zA-Z]+/.test(wordShort)) return true;
  while (i > 1 && !/(\n|\$|\\)/.test(txt[i])) i--;
  const word = txt.slice(i, j);
  const tokens = word.match(/[a-zA-Z]+|[^a-zA-Z]+/g) || [];
  if (tokens.some((token) => isLabelToken(token))) return true;
  if (regexFileExt.test(word)) return true;
  return false;
}
function isLabelToken(token) {
  return token.length > 0 && /[a-zA-Z]/.test(token[0]) && labelKeywords.some(
    (kw) => token.toLowerCase().startsWith(kw) || token.toLowerCase().endsWith(kw)
  );
}

// src/LL/LLBracketMissing.ts
function LLBracketMissing(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const code = "LLBracketMissing";
  const message = [];
  const ranges = [];
  for (const match of txt.text.matchAll(/(?<![\\\[])[\^_](?:[0-9]{2}|[a-zA-Z]{2}|[+\-][0-9])/g)) {
    if (txt.isPreamble(match.index)) continue;
    if (isLabelOrURL(txt.text, match)) continue;
    if (!txt.isValid(match.index)) continue;
    message.push(messages[code].replaceAll("%1", match[0][0]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLBracketRound.ts
init_define_LATEXLINT_DEFAULTS();
function LLBracketRound(doc, txt) {
  const code = "LLBracketRound";
  const message = [];
  const ranges = [];
  for (const match of txt.text.matchAll(/(?:\\sqrt|\^|_)\(/g)) {
    if (!txt.isValid(match.index)) continue;
    if (match[0] === "\\sqrt(")
      message.push(messages[code].replaceAll("%1", "\\sqrt"));
    else {
      if (isLabelOrURL(txt.text, match)) continue;
      if (match.index > 0 && txt.text[match.index - 1] === "\\") continue;
      message.push(messages[code].replaceAll("%1", txt.text[match.index]));
    }
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLColonEqq.ts
init_define_LATEXLINT_DEFAULTS();
var correctCommandsColonEqq = {
  "::=": "\\Coloneqq",
  "=::": "\\Eqqcolon",
  ":=": "\\coloneqq",
  "=:": "\\eqqcolon"
};
function LLColonEqq(doc, txt) {
  const code = "LLColonEqq";
  let message = [];
  let ranges = [];
  for (const match of txt.text.matchAll(/::=|=::|:=|=:/g)) {
    if (!txt.isValid(match.index)) continue;
    message.push(messages[code].replaceAll("%1", correctCommandsColonEqq[match[0]]).replaceAll("%2", match[0]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLColonForMapping.ts
init_define_LATEXLINT_DEFAULTS();
function isCorrectBraces(str) {
  let count = 0;
  for (const c of str) {
    if (c === "{") count++;
    else if (c === "}") count--;
    if (count < 0) return false;
  }
  return count === 0;
}
var REGEXPS = [
  /\\to(?![a-zA-Z])/g,
  /\\mapsto(?![a-zA-Z])/g,
  /\\rightarrow(?![a-zA-Z])/g
];
function LLColonForMapping(doc, txt) {
  const ranges = [];
  for (const regexp of REGEXPS)
    for (const match of txt.text.matchAll(regexp)) {
      if (!txt.isValid(match.index)) continue;
      let i = match.index - 1;
      for (let wordCount = 0; wordCount < 10; wordCount++) {
        while (i >= 0 && /\s/.test(txt.text[i])) i--;
        if (i < 0) break;
        while (i >= 0 && txt.text[i] !== ":" && txt.text[i] !== "$" && /\S/.test(txt.text[i])) i--;
        if (i < 0) break;
        if (txt.text[i] === "$") break;
        if (txt.text[i] === ":") {
          const strColon2Arrow = txt.text.slice(i + 1, match.index);
          if (!strColon2Arrow.includes("\\(") && !strColon2Arrow.includes("\\[") && !strColon2Arrow.includes("\\begin{") && isCorrectBraces(strColon2Arrow)) {
            const startPos = doc.positionAt(i);
            const endPos = startPos.translate(0, 1);
            ranges.push(new Range(startPos, endPos));
          }
          break;
        }
      }
    }
  const code = "LLColonForMapping";
  const message = messages[code];
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLCref.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/findLatexCommandMatches.ts
init_define_LATEXLINT_DEFAULTS();
function findLatexCommandMatches(text, commandRegex) {
  const flags = commandRegex.flags.includes("g") ? commandRegex.flags : commandRegex.flags + "g";
  const regex = new RegExp(commandRegex.source, flags);
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index === void 0) continue;
    const openBraceIndex = match.index + match[0].length - 1;
    if (text[openBraceIndex] !== "{") continue;
    const closeBraceIndex = findClosingBrace(text, openBraceIndex);
    if (closeBraceIndex === void 0) continue;
    matches.push({
      index: match.index,
      fullEnd: closeBraceIndex + 1,
      content: text.slice(openBraceIndex + 1, closeBraceIndex)
    });
    regex.lastIndex = closeBraceIndex + 1;
  }
  return matches;
}
function findClosingBrace(text, openBraceIndex) {
  let depth = 1;
  for (let i = openBraceIndex + 1; i < text.length; i++) {
    if (text[i] === "\\") {
      i++;
      continue;
    }
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return void 0;
}

// src/LL/LLCref.ts
function LLCref(doc, txt, exceptions) {
  if (doc.languageId !== "latex") return [];
  const code = "LLCref";
  const message = [];
  const ranges = [];
  for (const match of findLatexCommandMatches(txt.text, /\\ref\{/g)) {
    if (txt.isPreamble(match.index)) continue;
    if (!txt.isValid(match.index)) continue;
    const refContent = match.content;
    if (exceptions.some((exception) => refContent.startsWith(exception))) continue;
    message.push(messages[code]);
    ranges.push(new Range(
      doc.positionAt(match.index),
      doc.positionAt(match.fullEnd)
    ));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLDots.ts
init_define_LATEXLINT_DEFAULTS();
var PATTERNS = [
  /\W[ \t]*\.[ \t]*\.[ \t]*\.[ \t]*\W/g,
  /[0-9]\.?[0-9]\.[ \t]*\.[ \t]*\./g
];
var DOTS_PATTERN = /\.[ \t]*\.[ \t]*\./;
function LLDots(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const ranges = [];
  for (const pattern2 of PATTERNS)
    for (const match of txt.text.matchAll(pattern2)) {
      if (!txt.isValid(match.index)) continue;
      const dots = DOTS_PATTERN.exec(match[0]);
      console.assert(dots !== null);
      const dotsIndex = dots.index;
      const startPos = doc.positionAt(match.index + dotsIndex);
      const endPos = doc.positionAt(match.index + dotsIndex + dots[0].length);
      const range = new Range(startPos, endPos);
      ranges.push(range);
    }
  const code = "LLDots";
  const message = messages[code];
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLDoubleQuotes.ts
init_define_LATEXLINT_DEFAULTS();
function LLDoubleQuotes(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const code = "LLDoubleQuotes";
  const ranges = [];
  for (const match of txt.text.matchAll(/(?<!\\)"/g)) {
    if (!txt.isValid(match.index)) continue;
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, messages[code], ranges);
}

// src/LL/LLENDash.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/wordSet.ts
init_define_LATEXLINT_DEFAULTS();
var wordSet = /* @__PURE__ */ new Set([
  "a",
  "aa",
  "aaa",
  "aac",
  "aaliyah",
  "aaron",
  "ab",
  "aba",
  "abandon",
  "abandoned",
  "abatement",
  "abba",
  "abbey",
  "abbott",
  "abbreviation",
  "abbreviations",
  "abby",
  "abc",
  "abdominal",
  "abdul",
  "abe",
  "aberdeen",
  "abi",
  "abide",
  "abigail",
  "abilities",
  "ability",
  "abit",
  "able",
  "abn",
  "abnormal",
  "abnormalities",
  "aboard",
  "aboriginal",
  "abortion",
  "about",
  "above",
  "abraham",
  "abramoff",
  "abroad",
  "abs",
  "absence",
  "absent",
  "absolute",
  "absolutely",
  "absorb",
  "absorbed",
  "absorbing",
  "absorption",
  "abstract",
  "abstraction",
  "abstracts",
  "absurd",
  "abt",
  "abu",
  "abundance",
  "abundant",
  "abuse",
  "abused",
  "abuses",
  "abusive",
  "ac",
  "aca",
  "acad",
  "academia",
  "academic",
  "academics",
  "academies",
  "academy",
  "acapulco",
  "acc",
  "accelerate",
  "accelerated",
  "acceleration",
  "accelerator",
  "accent",
  "accents",
  "accept",
  "acceptable",
  "acceptance",
  "accepted",
  "accepting",
  "accepts",
  "access",
  "accessed",
  "accesses",
  "accessibility",
  "accessible",
  "accessing",
  "accession",
  "accessories",
  "accessory",
  "accident",
  "accidental",
  "accidentally",
  "accidents",
  "acclaim",
  "acclaimed",
  "accolades",
  "accommodate",
  "accommodation",
  "accommodations",
  "accomodation",
  "accompanied",
  "accompany",
  "accompanying",
  "accomplish",
  "accomplished",
  "accomplishment",
  "accomplishments",
  "accord",
  "accordance",
  "according",
  "accordingly",
  "account",
  "accountability",
  "accountable",
  "accountancy",
  "accountant",
  "accountants",
  "accounted",
  "accounting",
  "accounts",
  "accreditation",
  "accredited",
  "accrued",
  "acct",
  "accumulate",
  "accumulated",
  "accumulation",
  "accuracy",
  "accurate",
  "accurately",
  "accused",
  "accustomed",
  "acdbentity",
  "acdbline",
  "ace",
  "acer",
  "aces",
  "acetate",
  "achieve",
  "achieved",
  "achievement",
  "achievements",
  "achieves",
  "achieving",
  "acid",
  "acids",
  "ack",
  "acknowledge",
  "acknowledged",
  "acknowledgement",
  "acknowledgements",
  "acknowledges",
  "acknowledgments",
  "acl",
  "aclu",
  "acm",
  "acme",
  "acne",
  "acorn",
  "acoustic",
  "acoustics",
  "acp",
  "acquire",
  "acquired",
  "acquires",
  "acquiring",
  "acquisition",
  "acquisitions",
  "acre",
  "acreage",
  "acres",
  "acrobat",
  "acronym",
  "acronyms",
  "across",
  "acrylic",
  "acs",
  "act",
  "acta",
  "acted",
  "acting",
  "action",
  "actions",
  "activate",
  "activated",
  "activation",
  "active",
  "actively",
  "activex",
  "activism",
  "activist",
  "activists",
  "activities",
  "activity",
  "actor",
  "actors",
  "actress",
  "actresses",
  "acts",
  "actual",
  "actually",
  "actuarial",
  "acupuncture",
  "acura",
  "acute",
  "acxiom",
  "ad",
  "ada",
  "adam",
  "adams",
  "adapt",
  "adaptation",
  "adaptec",
  "adapted",
  "adapter",
  "adapters",
  "adaptive",
  "adaptor",
  "adaptors",
  "adc",
  "add",
  "added",
  "addendum",
  "addict",
  "addicted",
  "addiction",
  "addictive",
  "adding",
  "addison",
  "addition",
  "additional",
  "additionally",
  "additions",
  "additive",
  "additives",
  "addr",
  "address",
  "addressed",
  "addresses",
  "addressing",
  "adds",
  "adelaide",
  "adequacy",
  "adequate",
  "adequately",
  "adhd",
  "adhere",
  "adherence",
  "adhesion",
  "adhesive",
  "adhesives",
  "adidas",
  "adipex",
  "adj",
  "adjacent",
  "adjoining",
  "adjourned",
  "adjunct",
  "adjust",
  "adjustable",
  "adjusted",
  "adjusting",
  "adjustment",
  "adjustments",
  "adler",
  "adm",
  "admin",
  "administer",
  "administered",
  "administering",
  "administration",
  "administrative",
  "administrator",
  "administrators",
  "admins",
  "admiral",
  "admire",
  "admission",
  "admissions",
  "admit",
  "admits",
  "admitted",
  "adobe",
  "adolescent",
  "adolescents",
  "adopt",
  "adopted",
  "adopting",
  "adoption",
  "adorable",
  "adp",
  "adr",
  "adrenaline",
  "adrian",
  "ads",
  "adsense",
  "adsl",
  "adult",
  "adults",
  "adv",
  "advance",
  "advanced",
  "advancement",
  "advances",
  "advancing",
  "advantage",
  "advantages",
  "advent",
  "adventure",
  "adventures",
  "adverse",
  "adversely",
  "advert",
  "advertise",
  "advertised",
  "advertisement",
  "advertisements",
  "advertiser",
  "advertisers",
  "advertising",
  "adverts",
  "advice",
  "advise",
  "advised",
  "adviser",
  "advisers",
  "advises",
  "advising",
  "advisor",
  "advisories",
  "advisors",
  "advisory",
  "advocacy",
  "advocate",
  "advocates",
  "adware",
  "ae",
  "aerial",
  "aero",
  "aerobic",
  "aerosmith",
  "aerosol",
  "aerospace",
  "aes",
  "aest",
  "aesthetic",
  "aesthetics",
  "af",
  "afb",
  "afc",
  "aff",
  "affair",
  "affairs",
  "affect",
  "affected",
  "affecting",
  "affection",
  "affects",
  "affidavit",
  "affiliate",
  "affiliated",
  "affiliates",
  "affiliation",
  "affiliations",
  "affinity",
  "affirm",
  "affirmative",
  "affirmed",
  "afford",
  "affordable",
  "afforded",
  "afghan",
  "afghanistan",
  "afl",
  "aforementioned",
  "afp",
  "afraid",
  "africa",
  "african",
  "afro",
  "aft",
  "after",
  "aftermarket",
  "aftermath",
  "afternoon",
  "afterwards",
  "ag",
  "again",
  "against",
  "age",
  "aged",
  "ageing",
  "agencies",
  "agency",
  "agenda",
  "agendas",
  "agent",
  "agents",
  "ages",
  "aggregate",
  "aggregation",
  "aggregator",
  "aggression",
  "aggressive",
  "agile",
  "agility",
  "aging",
  "agnes",
  "ago",
  "agp",
  "agree",
  "agreed",
  "agreeing",
  "agreement",
  "agreements",
  "agrees",
  "agri",
  "agricultural",
  "agriculture",
  "aguilera",
  "ah",
  "ahead",
  "ahmad",
  "ahmed",
  "ai",
  "aid",
  "aide",
  "aided",
  "aides",
  "aids",
  "aim",
  "aimed",
  "aiming",
  "aims",
  "air",
  "airborne",
  "aircraft",
  "aired",
  "aires",
  "airfare",
  "airfares",
  "airline",
  "airlines",
  "airmail",
  "airplane",
  "airplanes",
  "airport",
  "airports",
  "airsoft",
  "airways",
  "aisle",
  "aix",
  "aj",
  "ajax",
  "ak",
  "aka",
  "akin",
  "akon",
  "akron",
  "al",
  "ala",
  "alabama",
  "aladdin",
  "alain",
  "alameda",
  "alamo",
  "alan",
  "alarm",
  "alarms",
  "alas",
  "alaska",
  "alaskan",
  "alba",
  "albania",
  "albanian",
  "albany",
  "albeit",
  "albert",
  "alberta",
  "alberto",
  "albion",
  "album",
  "albums",
  "albuquerque",
  "alcatel",
  "alchemy",
  "alcohol",
  "alcoholic",
  "alcoholism",
  "ale",
  "alec",
  "alert",
  "alerts",
  "alex",
  "alexa",
  "alexander",
  "alexandra",
  "alexandre",
  "alexandria",
  "alexis",
  "alfa",
  "alfred",
  "algae",
  "algebra",
  "algebraic",
  "algeria",
  "algorithm",
  "algorithms",
  "ali",
  "alias",
  "aliases",
  "alibaba",
  "alibris",
  "alicante",
  "alice",
  "alicia",
  "alien",
  "aliens",
  "alienware",
  "align",
  "aligned",
  "alignment",
  "alike",
  "alison",
  "alito",
  "alive",
  "alkaline",
  "all",
  "alla",
  "allah",
  "allan",
  "alle",
  "allegations",
  "alleged",
  "allegedly",
  "allegiance",
  "allegra",
  "allegro",
  "allen",
  "allergic",
  "allergies",
  "allergy",
  "alleviate",
  "alley",
  "alliance",
  "alliances",
  "allied",
  "allies",
  "allison",
  "allocate",
  "allocated",
  "allocation",
  "allocations",
  "allow",
  "allowable",
  "allowance",
  "allowances",
  "allowed",
  "allowing",
  "allows",
  "alloy",
  "alloys",
  "ally",
  "alma",
  "almanac",
  "almighty",
  "almond",
  "almost",
  "aloe",
  "aloha",
  "alone",
  "along",
  "alongside",
  "alot",
  "aloud",
  "alpha",
  "alphabet",
  "alphabetical",
  "alphabetically",
  "alpine",
  "alprazolam",
  "alps",
  "alr",
  "already",
  "alright",
  "als",
  "also",
  "alt",
  "alta",
  "altar",
  "altavista",
  "alter",
  "alteration",
  "alterations",
  "altered",
  "altering",
  "alternate",
  "alternating",
  "alternative",
  "alternatively",
  "alternatives",
  "although",
  "altitude",
  "alto",
  "altogether",
  "alton",
  "aluminium",
  "aluminum",
  "alumni",
  "alvin",
  "always",
  "alzheimer",
  "am",
  "ama",
  "amanda",
  "amarillo",
  "amateur",
  "amateurs",
  "amatuer",
  "amature",
  "amazed",
  "amazing",
  "amazingly",
  "amazon",
  "ambassador",
  "amber",
  "ambien",
  "ambient",
  "ambiguous",
  "ambition",
  "ambitious",
  "ambulance",
  "amc",
  "amd",
  "amelia",
  "amen",
  "amend",
  "amended",
  "amending",
  "amendment",
  "amendments",
  "amenities",
  "amer",
  "america",
  "american",
  "americana",
  "americans",
  "americas",
  "ames",
  "amethyst",
  "amex",
  "amg",
  "amherst",
  "ami",
  "amid",
  "amiga",
  "amino",
  "ammo",
  "ammonia",
  "ammunition",
  "amnesty",
  "among",
  "amongst",
  "amor",
  "amortization",
  "amos",
  "amount",
  "amounts",
  "amp",
  "ampland",
  "ample",
  "amplification",
  "amplified",
  "amplifier",
  "amplifiers",
  "amplitude",
  "amps",
  "ams",
  "amsterdam",
  "amt",
  "amusement",
  "amusing",
  "amy",
  "an",
  "ana",
  "anabolic",
  "anaheim",
  "anal",
  "analog",
  "analogous",
  "analogue",
  "analogy",
  "analyse",
  "analysed",
  "analyses",
  "analysis",
  "analyst",
  "analysts",
  "analytic",
  "analytical",
  "analytics",
  "analyze",
  "analyzed",
  "analyzer",
  "analyzes",
  "analyzing",
  "anarchy",
  "anatomy",
  "ancestor",
  "ancestors",
  "ancestry",
  "anchor",
  "anchorage",
  "anchors",
  "ancient",
  "ancillary",
  "and",
  "andale",
  "anders",
  "andersen",
  "anderson",
  "andorra",
  "andover",
  "andre",
  "andrea",
  "andreas",
  "andrew",
  "andrews",
  "andy",
  "anemia",
  "anesthesia",
  "ang",
  "angel",
  "angela",
  "angeles",
  "angelina",
  "angelo",
  "angels",
  "anger",
  "angie",
  "angle",
  "angles",
  "anglican",
  "anglo",
  "angola",
  "angry",
  "anguilla",
  "angular",
  "angus",
  "animal",
  "animals",
  "animalsex",
  "animated",
  "animation",
  "animations",
  "anime",
  "aniston",
  "anita",
  "ankle",
  "ann",
  "anna",
  "annals",
  "annapolis",
  "anne",
  "annette",
  "annex",
  "annie",
  "anniversary",
  "annotate",
  "annotated",
  "annotation",
  "annotations",
  "announce",
  "announced",
  "announcement",
  "announcements",
  "announces",
  "announcing",
  "annoyed",
  "annoying",
  "annual",
  "annually",
  "annuity",
  "annum",
  "anomalies",
  "anomaly",
  "anon",
  "anonymous",
  "another",
  "ans",
  "ansi",
  "answer",
  "answered",
  "answering",
  "answers",
  "ant",
  "antarctic",
  "antarctica",
  "ante",
  "antenna",
  "antennas",
  "anterior",
  "anthem",
  "anthology",
  "anthony",
  "anthrax",
  "anthropology",
  "anti",
  "antibiotic",
  "antibiotics",
  "antibodies",
  "antibody",
  "anticipate",
  "anticipated",
  "anticipation",
  "antigen",
  "antigens",
  "antigua",
  "antilles",
  "antique",
  "antiques",
  "antitrust",
  "antivirus",
  "anton",
  "antonio",
  "antony",
  "ants",
  "anxiety",
  "anxious",
  "any",
  "anybody",
  "anymore",
  "anyone",
  "anything",
  "anytime",
  "anyway",
  "anyways",
  "anywhere",
  "ao",
  "aol",
  "ap",
  "apa",
  "apache",
  "apart",
  "apartment",
  "apartments",
  "apc",
  "ape",
  "aperture",
  "apex",
  "aphrodite",
  "api",
  "apis",
  "apnic",
  "apo",
  "apocalypse",
  "apollo",
  "apologies",
  "apologize",
  "apology",
  "apoptosis",
  "apostle",
  "apostles",
  "app",
  "appalachian",
  "apparatus",
  "apparel",
  "apparent",
  "apparently",
  "appeal",
  "appealed",
  "appealing",
  "appeals",
  "appear",
  "appearance",
  "appearances",
  "appeared",
  "appearing",
  "appears",
  "appellant",
  "appellate",
  "append",
  "appendices",
  "appendix",
  "appetite",
  "appetizers",
  "appl",
  "applause",
  "apple",
  "applegate",
  "apples",
  "applet",
  "appleton",
  "applets",
  "appliance",
  "appliances",
  "applicability",
  "applicable",
  "applicant",
  "applicants",
  "application",
  "applications",
  "applied",
  "applies",
  "apply",
  "applying",
  "appoint",
  "appointed",
  "appointment",
  "appointments",
  "appraisal",
  "appraisals",
  "appraiser",
  "appreciate",
  "appreciated",
  "appreciation",
  "apprentice",
  "apprenticeship",
  "approach",
  "approached",
  "approaches",
  "approaching",
  "appropriate",
  "appropriated",
  "appropriately",
  "appropriation",
  "appropriations",
  "approval",
  "approvals",
  "approve",
  "approved",
  "approves",
  "approving",
  "approx",
  "approximate",
  "approximately",
  "approximation",
  "apps",
  "apr",
  "april",
  "apron",
  "aps",
  "apt",
  "aq",
  "aqua",
  "aquaculture",
  "aquarium",
  "aquatic",
  "aqueous",
  "ar",
  "arab",
  "arabia",
  "arabian",
  "arabic",
  "arabidopsis",
  "arabs",
  "arafat",
  "arbitrary",
  "arbitration",
  "arbor",
  "arc",
  "arcade",
  "arcadia",
  "arch",
  "archaeological",
  "archaeology",
  "archbishop",
  "archer",
  "archery",
  "architect",
  "architects",
  "architectural",
  "architecture",
  "architectures",
  "archival",
  "archive",
  "archived",
  "archives",
  "archiving",
  "arctic",
  "arden",
  "are",
  "area",
  "areas",
  "arena",
  "ares",
  "arg",
  "argentina",
  "argentine",
  "argos",
  "args",
  "arguably",
  "argue",
  "argued",
  "argues",
  "arguing",
  "argument",
  "arguments",
  "argus",
  "argv",
  "ari",
  "aria",
  "arial",
  "arid",
  "ariel",
  "aries",
  "arin",
  "arise",
  "arises",
  "arising",
  "aristotle",
  "arithmetic",
  "arizona",
  "ark",
  "arkansas",
  "arlington",
  "arm",
  "armada",
  "armani",
  "armed",
  "armenia",
  "armenian",
  "armies",
  "armor",
  "armored",
  "armour",
  "arms",
  "armstrong",
  "army",
  "arnold",
  "aroma",
  "aromatherapy",
  "aromatic",
  "arose",
  "around",
  "arp",
  "arr",
  "arrange",
  "arranged",
  "arrangement",
  "arrangements",
  "arranging",
  "array",
  "arrays",
  "arrest",
  "arrested",
  "arrests",
  "arrival",
  "arrivals",
  "arrive",
  "arrived",
  "arrives",
  "arriving",
  "arrow",
  "arrows",
  "ars",
  "arsenal",
  "arsenic",
  "art",
  "arte",
  "arterial",
  "arteries",
  "artery",
  "arthritis",
  "arthur",
  "article",
  "articles",
  "articulate",
  "articulated",
  "artifacts",
  "artificial",
  "artillery",
  "artisan",
  "artist",
  "artistic",
  "artists",
  "arts",
  "artwork",
  "aruba",
  "arxiv",
  "as",
  "asa",
  "asap",
  "asbestos",
  "asc",
  "ascending",
  "ascension",
  "ascertain",
  "ascii",
  "asean",
  "asf",
  "ash",
  "ashamed",
  "ashanti",
  "ashcroft",
  "ashes",
  "asheville",
  "ashford",
  "ashland",
  "ashlee",
  "ashley",
  "ashton",
  "asi",
  "asia",
  "asian",
  "asians",
  "aside",
  "asin",
  "ask",
  "asked",
  "asking",
  "asks",
  "asleep",
  "asm",
  "asn",
  "asnblock",
  "asp",
  "aspect",
  "aspects",
  "aspen",
  "asphalt",
  "aspirations",
  "aspire",
  "aspirin",
  "ass",
  "assassination",
  "assault",
  "assay",
  "assays",
  "assemble",
  "assembled",
  "assembler",
  "assemblies",
  "assembly",
  "assert",
  "asserted",
  "assertion",
  "asserts",
  "asses",
  "assess",
  "assessed",
  "assessing",
  "assessment",
  "assessments",
  "assessor",
  "asset",
  "assets",
  "asshole",
  "assign",
  "assigned",
  "assigning",
  "assignment",
  "assignments",
  "assigns",
  "assist",
  "assistance",
  "assistant",
  "assistants",
  "assisted",
  "assisting",
  "assists",
  "assoc",
  "associate",
  "associated",
  "associates",
  "association",
  "associations",
  "assorted",
  "assortment",
  "asst",
  "assume",
  "assumed",
  "assumes",
  "assuming",
  "assumption",
  "assumptions",
  "assurance",
  "assure",
  "assured",
  "ast",
  "asterisk",
  "asthma",
  "astm",
  "aston",
  "astoria",
  "astra",
  "astro",
  "astrology",
  "astronomical",
  "astronomy",
  "astrophysics",
  "astros",
  "asu",
  "asus",
  "asylum",
  "asynchronous",
  "at",
  "ata",
  "atari",
  "atc",
  "ate",
  "atheist",
  "athena",
  "athens",
  "athlete",
  "athletes",
  "athletic",
  "athletics",
  "athlon",
  "ati",
  "ativan",
  "atk",
  "atkins",
  "atkinson",
  "atl",
  "atlanta",
  "atlantic",
  "atlantis",
  "atlas",
  "atm",
  "atmosphere",
  "atmospheric",
  "atom",
  "atomic",
  "atoms",
  "atp",
  "atreyu",
  "ats",
  "att",
  "attach",
  "attached",
  "attachment",
  "attachments",
  "attack",
  "attacked",
  "attacker",
  "attacking",
  "attacks",
  "attain",
  "attained",
  "attainment",
  "attempt",
  "attempted",
  "attempting",
  "attempts",
  "attend",
  "attendance",
  "attendant",
  "attended",
  "attendees",
  "attending",
  "attention",
  "attic",
  "attitude",
  "attitudes",
  "attn",
  "attorney",
  "attorneys",
  "attr",
  "attract",
  "attracted",
  "attracting",
  "attraction",
  "attractions",
  "attractive",
  "attracts",
  "attributable",
  "attribute",
  "attributed",
  "attributes",
  "attribution",
  "atv",
  "atx",
  "au",
  "auburn",
  "auch",
  "auckland",
  "auction",
  "auctions",
  "aud",
  "audi",
  "audible",
  "audience",
  "audiences",
  "audio",
  "audiobooks",
  "audioslave",
  "audiovox",
  "audit",
  "audited",
  "auditing",
  "audition",
  "auditions",
  "auditor",
  "auditorium",
  "auditors",
  "auditory",
  "audits",
  "audrey",
  "audubon",
  "auf",
  "aug",
  "augmentation",
  "august",
  "augusta",
  "augustine",
  "augustus",
  "aunt",
  "aura",
  "aurora",
  "aus",
  "aussie",
  "aust",
  "austin",
  "australasia",
  "australia",
  "australian",
  "australians",
  "austria",
  "austrian",
  "aut",
  "auth",
  "authentic",
  "authenticated",
  "authentication",
  "authenticity",
  "author",
  "authored",
  "authoring",
  "authorisation",
  "authorised",
  "authoritative",
  "authorities",
  "authority",
  "authorization",
  "authorize",
  "authorized",
  "authorizes",
  "authorizing",
  "authors",
  "autism",
  "auto",
  "autobiography",
  "autocad",
  "autodesk",
  "autograph",
  "autographed",
  "autographs",
  "automate",
  "automated",
  "automatic",
  "automatically",
  "automation",
  "automobile",
  "automobiles",
  "automotive",
  "autonomous",
  "autonomy",
  "autos",
  "autumn",
  "aux",
  "auxiliary",
  "av",
  "avail",
  "availability",
  "available",
  "avalanche",
  "avalon",
  "avant",
  "avatar",
  "avatars",
  "avaya",
  "ave",
  "avec",
  "avenue",
  "avenues",
  "average",
  "averaged",
  "averages",
  "averaging",
  "avery",
  "avg",
  "avi",
  "avian",
  "aviation",
  "avid",
  "avis",
  "aviv",
  "avoid",
  "avoidance",
  "avoided",
  "avoiding",
  "avoids",
  "avon",
  "avr",
  "avril",
  "avs",
  "aw",
  "await",
  "awaited",
  "awaiting",
  "awake",
  "awakening",
  "awakenings",
  "award",
  "awarded",
  "awards",
  "aware",
  "awareness",
  "away",
  "awe",
  "awesome",
  "awful",
  "awhile",
  "awkward",
  "ax",
  "axe",
  "axel",
  "axes",
  "axial",
  "axis",
  "axle",
  "ay",
  "aye",
  "az",
  "azerbaijan",
  "b",
  "ba",
  "babe",
  "babes",
  "babies",
  "baby",
  "babylon",
  "bac",
  "baccarat",
  "bach",
  "bachelor",
  "back",
  "backbone",
  "backdrop",
  "backed",
  "backend",
  "backgammon",
  "background",
  "backgrounds",
  "backing",
  "backpack",
  "backpacking",
  "backpacks",
  "backs",
  "backstage",
  "backstreet",
  "backup",
  "backups",
  "backward",
  "backwards",
  "backyard",
  "bacon",
  "bacteria",
  "bacterial",
  "bad",
  "badge",
  "badger",
  "badges",
  "badly",
  "badminton",
  "bag",
  "baggage",
  "baghdad",
  "bags",
  "bahamas",
  "bahrain",
  "baht",
  "bail",
  "bailey",
  "bait",
  "baja",
  "bake",
  "baked",
  "baker",
  "bakersfield",
  "bakery",
  "baking",
  "bal",
  "balance",
  "balanced",
  "balances",
  "balancing",
  "balcony",
  "bald",
  "baldwin",
  "bali",
  "ball",
  "ballad",
  "ballard",
  "ballet",
  "ballistic",
  "balloon",
  "balloons",
  "ballot",
  "ballots",
  "ballroom",
  "balls",
  "balm",
  "baltic",
  "baltimore",
  "bam",
  "bamboo",
  "ban",
  "banana",
  "bananas",
  "band",
  "bands",
  "bandwidth",
  "banff",
  "bang",
  "bangalore",
  "bangbus",
  "bangkok",
  "bangladesh",
  "bangor",
  "banjo",
  "bank",
  "banker",
  "bankers",
  "banking",
  "bankruptcies",
  "bankruptcy",
  "banks",
  "banned",
  "banner",
  "banners",
  "banning",
  "banquet",
  "bans",
  "baptism",
  "baptist",
  "bar",
  "barb",
  "barbados",
  "barbara",
  "barbecue",
  "barber",
  "barbie",
  "barbuda",
  "barcelona",
  "barcode",
  "bard",
  "bare",
  "barefoot",
  "barely",
  "bargain",
  "bargaining",
  "bargains",
  "bark",
  "barker",
  "barking",
  "barley",
  "barn",
  "barnes",
  "barnett",
  "barney",
  "baron",
  "baroque",
  "barr",
  "barre",
  "barred",
  "barrel",
  "barrels",
  "barrett",
  "barrie",
  "barrier",
  "barriers",
  "barron",
  "barrow",
  "barry",
  "bars",
  "bart",
  "bartlett",
  "barton",
  "bas",
  "basal",
  "base",
  "baseball",
  "based",
  "basel",
  "baseline",
  "basement",
  "basename",
  "bases",
  "bash",
  "basic",
  "basically",
  "basics",
  "basil",
  "basin",
  "basins",
  "basis",
  "basket",
  "basketball",
  "baskets",
  "basque",
  "bass",
  "bastard",
  "bat",
  "batch",
  "bates",
  "bath",
  "bathing",
  "bathroom",
  "bathrooms",
  "baths",
  "batman",
  "baton",
  "bats",
  "battalion",
  "batter",
  "batteries",
  "battery",
  "batting",
  "battle",
  "battlefield",
  "battles",
  "bauer",
  "baxter",
  "bay",
  "bayer",
  "baylor",
  "bays",
  "bazaar",
  "bb",
  "bbb",
  "bbbonline",
  "bbc",
  "bbq",
  "bbs",
  "bbw",
  "bc",
  "bd",
  "bdd",
  "bdsm",
  "be",
  "bea",
  "beach",
  "beaches",
  "beacon",
  "bead",
  "beaded",
  "beads",
  "beam",
  "beams",
  "bean",
  "beanie",
  "beans",
  "bear",
  "beard",
  "bearing",
  "bearings",
  "bears",
  "beast",
  "beastality",
  "beastiality",
  "beasts",
  "beat",
  "beaten",
  "beating",
  "beatles",
  "beats",
  "beau",
  "beaumont",
  "beautiful",
  "beautifully",
  "beauty",
  "beaver",
  "beavers",
  "became",
  "because",
  "beck",
  "becker",
  "becky",
  "become",
  "becomes",
  "becoming",
  "bed",
  "bedding",
  "bedford",
  "bedfordshire",
  "bedroom",
  "bedrooms",
  "beds",
  "bee",
  "beech",
  "beef",
  "been",
  "beer",
  "beers",
  "bees",
  "beethoven",
  "beetle",
  "before",
  "beg",
  "began",
  "begin",
  "beginner",
  "beginners",
  "beginning",
  "beginnings",
  "begins",
  "begun",
  "behalf",
  "behave",
  "behavior",
  "behavioral",
  "behaviors",
  "behaviour",
  "behavioural",
  "behind",
  "behold",
  "bei",
  "beige",
  "beijing",
  "being",
  "beings",
  "beirut",
  "bel",
  "belarus",
  "belfast",
  "belgian",
  "belgium",
  "belgrade",
  "belief",
  "beliefs",
  "believe",
  "believed",
  "believer",
  "believers",
  "believes",
  "believing",
  "belize",
  "belkin",
  "bell",
  "bella",
  "belle",
  "bellevue",
  "bells",
  "bellsouth",
  "belly",
  "belmont",
  "belong",
  "belonged",
  "belonging",
  "belongs",
  "beloved",
  "below",
  "belt",
  "belts",
  "bench",
  "benches",
  "benchmark",
  "benchmarking",
  "benchmarks",
  "bend",
  "bender",
  "bending",
  "beneath",
  "benedict",
  "beneficial",
  "beneficiaries",
  "beneficiary",
  "benefit",
  "benefited",
  "benefits",
  "bengal",
  "benign",
  "benin",
  "benjamin",
  "bennett",
  "benny",
  "benq",
  "benson",
  "bent",
  "bentley",
  "benton",
  "benz",
  "ber",
  "berg",
  "bergen",
  "berger",
  "berkeley",
  "berkshire",
  "berlin",
  "berlios",
  "bermuda",
  "bern",
  "bernard",
  "bernardino",
  "bernie",
  "bernstein",
  "berries",
  "berry",
  "bert",
  "beside",
  "besides",
  "best",
  "bestiality",
  "bestsellers",
  "bestselling",
  "bet",
  "beta",
  "beth",
  "bethany",
  "bethel",
  "bethesda",
  "bethlehem",
  "bets",
  "betsy",
  "better",
  "betting",
  "betty",
  "between",
  "beverage",
  "beverages",
  "beverly",
  "beware",
  "beyonce",
  "beyond",
  "bezel",
  "bf",
  "bg",
  "bh",
  "bhd",
  "bhutan",
  "bi",
  "bias",
  "biased",
  "bib",
  "bible",
  "bibles",
  "biblical",
  "bibliographic",
  "bibliography",
  "bibtex",
  "bicycle",
  "bicycles",
  "bid",
  "bidder",
  "bidders",
  "bidding",
  "bids",
  "bien",
  "big",
  "bigger",
  "biggest",
  "bike",
  "biker",
  "bikes",
  "biking",
  "bikini",
  "bilateral",
  "bild",
  "bilder",
  "bilingual",
  "billboard",
  "billed",
  "billiard",
  "billiards",
  "billie",
  "billing",
  "billings",
  "billion",
  "billions",
  "bills",
  "billy",
  "biloxi",
  "bin",
  "binaries",
  "binary",
  "bind",
  "binder",
  "binding",
  "bindings",
  "binds",
  "bingo",
  "binoculars",
  "bins",
  "bio",
  "biochem",
  "biochemical",
  "biochemistry",
  "biodiversity",
  "biographical",
  "biographies",
  "biography",
  "bioinformatics",
  "biol",
  "biological",
  "biology",
  "biomass",
  "biomedical",
  "biopsy",
  "bios",
  "biosynthesis",
  "biotech",
  "biotechnology",
  "bipolar",
  "birch",
  "bird",
  "birding",
  "birds",
  "birmingham",
  "birth",
  "birthday",
  "birthdays",
  "birthplace",
  "births",
  "bis",
  "biscuit",
  "biscuits",
  "bisexual",
  "bishop",
  "bishops",
  "bison",
  "bissau",
  "bistro",
  "bit",
  "bitch",
  "bitches",
  "bite",
  "bites",
  "biting",
  "bitmap",
  "bitpipe",
  "bits",
  "bitter",
  "bittorrent",
  "biz",
  "bizarre",
  "bizjournals",
  "bizjournalshire",
  "bizkit",
  "bizrate",
  "bj",
  "bk",
  "bl",
  "black",
  "blackberry",
  "blackboard",
  "blackburn",
  "blackjack",
  "blackpool",
  "blacks",
  "blackwell",
  "bladder",
  "blade",
  "blades",
  "blah",
  "blair",
  "blake",
  "blame",
  "blamed",
  "blanc",
  "blanca",
  "blanco",
  "bland",
  "blank",
  "blanket",
  "blankets",
  "blanks",
  "blast",
  "blaster",
  "blaze",
  "blazer",
  "bldg",
  "bleed",
  "bleeding",
  "blend",
  "blended",
  "blender",
  "blending",
  "blends",
  "bless",
  "blessed",
  "blessing",
  "blessings",
  "blew",
  "blind",
  "blindness",
  "blinds",
  "bling",
  "blink",
  "bliss",
  "blitz",
  "blizzard",
  "blk",
  "bloc",
  "block",
  "blockbuster",
  "blocked",
  "blocker",
  "blocking",
  "blocks",
  "blog",
  "blogger",
  "bloggers",
  "blogging",
  "bloglines",
  "blogosphere",
  "blogroll",
  "blogs",
  "blogshares",
  "blogthis",
  "blond",
  "blonde",
  "blondes",
  "blood",
  "bloodhound",
  "bloody",
  "bloom",
  "bloomberg",
  "bloomfield",
  "bloomington",
  "blooms",
  "blossom",
  "blow",
  "blower",
  "blowing",
  "blowjob",
  "blowjobs",
  "blown",
  "blowout",
  "blows",
  "blu",
  "blue",
  "bluegrass",
  "blueprint",
  "blues",
  "bluetooth",
  "bluff",
  "blunt",
  "blur",
  "blush",
  "blvd",
  "bm",
  "bmc",
  "bmg",
  "bmi",
  "bmp",
  "bmw",
  "bmx",
  "bn",
  "bnet",
  "bo",
  "boa",
  "board",
  "boarding",
  "boards",
  "boasts",
  "boat",
  "boating",
  "boats",
  "bob",
  "bobby",
  "boc",
  "boca",
  "bod",
  "bodies",
  "bodily",
  "body",
  "bodybuilding",
  "boeing",
  "bogus",
  "bohemian",
  "boil",
  "boiled",
  "boiler",
  "boiling",
  "boing",
  "boise",
  "bold",
  "bolivia",
  "bollywood",
  "bologna",
  "bolt",
  "bolton",
  "bolts",
  "bomb",
  "bombay",
  "bomber",
  "bombers",
  "bombing",
  "bombings",
  "bombs",
  "bon",
  "bond",
  "bondage",
  "bonded",
  "bonding",
  "bonds",
  "bone",
  "bones",
  "bonn",
  "bonnie",
  "bono",
  "bonsai",
  "bontril",
  "bonus",
  "bonuses",
  "boo",
  "boob",
  "boobs",
  "boogie",
  "book",
  "booked",
  "booking",
  "bookings",
  "booklet",
  "bookmark",
  "bookmarks",
  "books",
  "booksellers",
  "bookshelf",
  "bookshop",
  "bookstore",
  "bookstores",
  "bool",
  "boolean",
  "boom",
  "boone",
  "boost",
  "booster",
  "boot",
  "booth",
  "boots",
  "bootstrap",
  "booty",
  "bop",
  "bordeaux",
  "border",
  "borders",
  "bore",
  "bored",
  "boredom",
  "boring",
  "boris",
  "borland",
  "born",
  "borne",
  "borough",
  "borrow",
  "borrowed",
  "borrower",
  "borrowers",
  "borrowing",
  "bos",
  "bosch",
  "bose",
  "bosnia",
  "boss",
  "bosses",
  "boston",
  "bot",
  "botanical",
  "botany",
  "both",
  "bother",
  "bothered",
  "bots",
  "botswana",
  "bottle",
  "bottled",
  "bottles",
  "bottom",
  "bottoms",
  "bought",
  "boulder",
  "boulevard",
  "bounce",
  "bouncing",
  "bound",
  "boundaries",
  "boundary",
  "bounded",
  "bounds",
  "bounty",
  "bouquet",
  "bouquets",
  "bournemouth",
  "bout",
  "boutique",
  "bouvet",
  "bovine",
  "bow",
  "bowel",
  "bowen",
  "bowie",
  "bowl",
  "bowling",
  "bowls",
  "bowman",
  "bows",
  "box",
  "boxed",
  "boxer",
  "boxes",
  "boxing",
  "boy",
  "boycott",
  "boyd",
  "boyfriend",
  "boyle",
  "boys",
  "boyz",
  "bp",
  "bpm",
  "br",
  "bra",
  "brace",
  "bracelet",
  "bracelets",
  "braces",
  "bracket",
  "brackets",
  "brad",
  "bradford",
  "bradley",
  "brady",
  "braille",
  "brain",
  "brains",
  "brake",
  "brakes",
  "branch",
  "branches",
  "brand",
  "branded",
  "branding",
  "brandon",
  "brands",
  "brandy",
  "branson",
  "bras",
  "brasil",
  "brass",
  "braun",
  "brave",
  "braves",
  "bravo",
  "brazil",
  "brazilian",
  "breach",
  "bread",
  "breadth",
  "break",
  "breakdown",
  "breaker",
  "breakers",
  "breakfast",
  "breakfasts",
  "breaking",
  "breakout",
  "breaks",
  "breakthrough",
  "breast",
  "breastfeeding",
  "breasts",
  "breath",
  "breathe",
  "breathing",
  "breathtaking",
  "bred",
  "breed",
  "breeder",
  "breeders",
  "breeding",
  "breeds",
  "breeze",
  "bremen",
  "brenda",
  "brendan",
  "brennan",
  "brent",
  "brentwood",
  "brethren",
  "brett",
  "brew",
  "brewer",
  "brewers",
  "brewery",
  "brewing",
  "brian",
  "brick",
  "bricks",
  "bridal",
  "bride",
  "brides",
  "bridge",
  "bridgeport",
  "bridges",
  "bridget",
  "bridgewater",
  "bridging",
  "brief",
  "briefcase",
  "briefing",
  "briefings",
  "briefly",
  "briefs",
  "brigade",
  "briggs",
  "bright",
  "brighter",
  "brightness",
  "brighton",
  "brilliant",
  "bring",
  "bringing",
  "brings",
  "brisbane",
  "bristol",
  "brit",
  "britain",
  "britannica",
  "british",
  "britney",
  "brittany",
  "bro",
  "broad",
  "broadband",
  "broadcast",
  "broadcasters",
  "broadcasting",
  "broadcasts",
  "broader",
  "broadly",
  "broadway",
  "broccoli",
  "brochure",
  "brochures",
  "brock",
  "broke",
  "brokeback",
  "broken",
  "broker",
  "brokerage",
  "brokers",
  "broncos",
  "bronx",
  "bronze",
  "brook",
  "brooke",
  "brooklyn",
  "brooks",
  "bros",
  "brother",
  "brotherhood",
  "brothers",
  "brought",
  "brown",
  "browne",
  "browning",
  "browns",
  "browse",
  "browser",
  "browsers",
  "browsing",
  "bruce",
  "bruins",
  "brunch",
  "brunei",
  "brunette",
  "bruno",
  "brunswick",
  "brush",
  "brushed",
  "brushes",
  "brussels",
  "brutal",
  "bryan",
  "bryant",
  "bryce",
  "bs",
  "bsc",
  "bsd",
  "bse",
  "bst",
  "bt",
  "btw",
  "bu",
  "bubble",
  "bubbles",
  "buchanan",
  "buck",
  "bucket",
  "buckingham",
  "buckinghamshire",
  "buckle",
  "buckley",
  "bucks",
  "bud",
  "budapest",
  "buddha",
  "buddhism",
  "buddhist",
  "buddies",
  "buddy",
  "budget",
  "budgetary",
  "budgeting",
  "budgets",
  "buds",
  "buena",
  "buenos",
  "buf",
  "buff",
  "buffalo",
  "buffer",
  "buffers",
  "buffet",
  "buffy",
  "bufing",
  "bug",
  "buggy",
  "bugs",
  "bugzilla",
  "buick",
  "build",
  "builder",
  "builders",
  "building",
  "buildings",
  "builds",
  "built",
  "bukkake",
  "bulb",
  "bulbs",
  "bulgaria",
  "bulgarian",
  "bulk",
  "bull",
  "bulldog",
  "bulldogs",
  "bullet",
  "bulletin",
  "bulletins",
  "bullets",
  "bullock",
  "bulls",
  "bullshit",
  "bullying",
  "bump",
  "bumper",
  "bunch",
  "bundle",
  "bundled",
  "bundles",
  "bungalow",
  "bunk",
  "bunker",
  "bunny",
  "bur",
  "burbank",
  "burberry",
  "burden",
  "bureau",
  "bureaucracy",
  "burger",
  "burgers",
  "burgess",
  "burgundy",
  "burial",
  "buried",
  "burke",
  "burkina",
  "burlington",
  "burma",
  "burn",
  "burned",
  "burner",
  "burners",
  "burnett",
  "burning",
  "burns",
  "burnt",
  "burr",
  "burst",
  "burt",
  "burton",
  "burundi",
  "bury",
  "bus",
  "busch",
  "buses",
  "bush",
  "business",
  "businesses",
  "businessman",
  "bust",
  "busted",
  "buster",
  "busty",
  "busy",
  "but",
  "butcher",
  "butler",
  "butt",
  "butte",
  "butter",
  "butterflies",
  "butterfly",
  "button",
  "buttons",
  "butts",
  "buy",
  "buyer",
  "buyers",
  "buying",
  "buys",
  "buzz",
  "bv",
  "bw",
  "bx",
  "by",
  "bye",
  "bylaws",
  "bypass",
  "byrd",
  "byrne",
  "byron",
  "byte",
  "bytes",
  "c",
  "ca",
  "caa",
  "cab",
  "cabaret",
  "cabbage",
  "cabernet",
  "cabin",
  "cabinet",
  "cabinets",
  "cabins",
  "cable",
  "cables",
  "cabling",
  "cabo",
  "cac",
  "cache",
  "cached",
  "caching",
  "cactus",
  "cad",
  "cadet",
  "cadillac",
  "caesar",
  "cafe",
  "cafes",
  "cafeteria",
  "caffeine",
  "cage",
  "cages",
  "caicos",
  "cain",
  "cairns",
  "cairo",
  "cajun",
  "cake",
  "cakes",
  "cal",
  "calc",
  "calcium",
  "calculate",
  "calculated",
  "calculating",
  "calculation",
  "calculations",
  "calculator",
  "calculators",
  "calculus",
  "calcutta",
  "caldwell",
  "caledonia",
  "calendar",
  "calendars",
  "calf",
  "calgary",
  "calhoun",
  "caliber",
  "calibration",
  "california",
  "call",
  "callaway",
  "callback",
  "called",
  "caller",
  "calling",
  "calls",
  "calm",
  "calorie",
  "calories",
  "calvin",
  "cam",
  "camaro",
  "cambodia",
  "cambridge",
  "cambridgeshire",
  "camcorder",
  "camcorders",
  "camden",
  "came",
  "camel",
  "cameltoe",
  "camera",
  "cameras",
  "cameron",
  "cameroon",
  "camino",
  "camp",
  "campaign",
  "campaigns",
  "campbell",
  "camper",
  "campers",
  "campground",
  "campgrounds",
  "camping",
  "camps",
  "campus",
  "campuses",
  "cams",
  "can",
  "canada",
  "canadian",
  "canadians",
  "canal",
  "canary",
  "canberra",
  "cancel",
  "canceled",
  "cancellation",
  "cancellations",
  "cancelled",
  "cancer",
  "cancers",
  "cancun",
  "candid",
  "candidate",
  "candidates",
  "candle",
  "candles",
  "candy",
  "cane",
  "canine",
  "cannabis",
  "canned",
  "cannes",
  "cannon",
  "canoe",
  "canoeing",
  "canon",
  "canonical",
  "canopy",
  "cans",
  "cant",
  "canterbury",
  "canton",
  "canvas",
  "canyon",
  "cao",
  "cap",
  "capabilities",
  "capability",
  "capable",
  "capacities",
  "capacitor",
  "capacity",
  "cape",
  "capita",
  "capital",
  "capitalism",
  "capitalist",
  "capitals",
  "capitol",
  "capped",
  "capri",
  "caps",
  "capsule",
  "capsules",
  "captain",
  "caption",
  "captive",
  "capture",
  "captured",
  "captures",
  "capturing",
  "car",
  "carat",
  "caravan",
  "carb",
  "carbohydrate",
  "carbohydrates",
  "carbon",
  "carbonate",
  "carbs",
  "carcinoma",
  "card",
  "cardboard",
  "cardiac",
  "cardiff",
  "cardinal",
  "cardinals",
  "cardio",
  "cardiology",
  "cardiovascular",
  "cards",
  "care",
  "cared",
  "career",
  "careers",
  "careful",
  "carefully",
  "caregivers",
  "carers",
  "cares",
  "carey",
  "cargo",
  "caribbean",
  "caring",
  "carisoprodol",
  "carl",
  "carla",
  "carleton",
  "carlisle",
  "carlo",
  "carlos",
  "carlsbad",
  "carlson",
  "carlton",
  "carmel",
  "carmen",
  "carnegie",
  "carnival",
  "carol",
  "carole",
  "carolina",
  "caroline",
  "carolyn",
  "carp",
  "carpenter",
  "carpet",
  "carpets",
  "carr",
  "carrera",
  "carriage",
  "carrie",
  "carried",
  "carrier",
  "carriers",
  "carries",
  "carroll",
  "carrot",
  "carrots",
  "carry",
  "carrying",
  "cars",
  "carson",
  "cart",
  "carte",
  "carter",
  "cartier",
  "carton",
  "cartoon",
  "cartoons",
  "cartridge",
  "cartridges",
  "carts",
  "carved",
  "carver",
  "carving",
  "cary",
  "cas",
  "casa",
  "cascade",
  "case",
  "cases",
  "casey",
  "cash",
  "cashier",
  "cashiers",
  "cashmere",
  "casino",
  "casinos",
  "casio",
  "casper",
  "cass",
  "casserole",
  "cassette",
  "cassettes",
  "cassidy",
  "cast",
  "casting",
  "castle",
  "castles",
  "castro",
  "casts",
  "casual",
  "casualties",
  "casualty",
  "cat",
  "catalan",
  "catalog",
  "catalogs",
  "catalogue",
  "catalogues",
  "catalyst",
  "catalytic",
  "catastrophic",
  "catch",
  "catcher",
  "catches",
  "catching",
  "catchment",
  "categories",
  "categorized",
  "category",
  "cater",
  "catering",
  "caterpillar",
  "cathedral",
  "catherine",
  "catholic",
  "catholics",
  "cathy",
  "cation",
  "cats",
  "cattle",
  "caucasian",
  "caucus",
  "caught",
  "causal",
  "cause",
  "caused",
  "causes",
  "causing",
  "caution",
  "cautious",
  "cavalier",
  "cavaliers",
  "cavalry",
  "cave",
  "caves",
  "cavity",
  "cayman",
  "cb",
  "cbc",
  "cbd",
  "cbs",
  "cc",
  "cca",
  "ccc",
  "ccd",
  "ccm",
  "cctv",
  "cd",
  "cdc",
  "cdma",
  "cdn",
  "cdna",
  "cdp",
  "cdr",
  "cdrom",
  "cdrw",
  "cds",
  "cdt",
  "ce",
  "cease",
  "ceased",
  "cecil",
  "cedar",
  "ceiling",
  "ceilings",
  "celeb",
  "celebrate",
  "celebrated",
  "celebrates",
  "celebrating",
  "celebration",
  "celebrations",
  "celebrex",
  "celebrities",
  "celebrity",
  "celebs",
  "celeron",
  "celestial",
  "celexa",
  "celine",
  "cell",
  "cellar",
  "cello",
  "cellphone",
  "cells",
  "cellular",
  "celtic",
  "cement",
  "cemeteries",
  "cemetery",
  "cen",
  "censorship",
  "census",
  "cent",
  "centennial",
  "center",
  "centered",
  "centers",
  "central",
  "centralized",
  "centrally",
  "centre",
  "centred",
  "centres",
  "centric",
  "centro",
  "cents",
  "centuries",
  "century",
  "ceo",
  "ceramic",
  "ceramics",
  "cereal",
  "cerebral",
  "ceremonies",
  "ceremony",
  "cerevisiae",
  "cern",
  "cert",
  "certain",
  "certainly",
  "certainty",
  "certificate",
  "certificates",
  "certification",
  "certifications",
  "certified",
  "certify",
  "cervical",
  "ces",
  "cessation",
  "cest",
  "cet",
  "cette",
  "cf",
  "cfa",
  "cfo",
  "cfr",
  "cfs",
  "cg",
  "cgi",
  "ch",
  "cha",
  "chad",
  "chain",
  "chains",
  "chair",
  "chaired",
  "chairman",
  "chairperson",
  "chairs",
  "chalet",
  "chalk",
  "challenge",
  "challenged",
  "challenger",
  "challenges",
  "challenging",
  "chamber",
  "chambers",
  "champ",
  "champagne",
  "champaign",
  "champion",
  "champions",
  "championship",
  "championships",
  "champs",
  "chan",
  "chance",
  "chancellor",
  "chances",
  "chandelier",
  "chandler",
  "chanel",
  "chang",
  "change",
  "changed",
  "changelog",
  "changer",
  "changes",
  "changing",
  "channel",
  "channels",
  "chaos",
  "chaotic",
  "chap",
  "chapel",
  "chapman",
  "chapter",
  "chapters",
  "char",
  "character",
  "characteristic",
  "characteristics",
  "characterization",
  "characterize",
  "characterized",
  "characters",
  "charcoal",
  "charge",
  "charged",
  "charger",
  "chargers",
  "charges",
  "charging",
  "charitable",
  "charities",
  "charity",
  "charles",
  "charleston",
  "charlie",
  "charlotte",
  "charlottesville",
  "charlton",
  "charm",
  "charmed",
  "charming",
  "charms",
  "chars",
  "charset",
  "chart",
  "charter",
  "chartered",
  "charters",
  "charts",
  "chase",
  "chaser",
  "chasing",
  "chassis",
  "chat",
  "chateau",
  "chatham",
  "chats",
  "chattanooga",
  "chatter",
  "chatting",
  "chavez",
  "che",
  "cheap",
  "cheaper",
  "cheapest",
  "cheat",
  "cheating",
  "cheats",
  "check",
  "checkboxes",
  "checked",
  "checker",
  "checking",
  "checklist",
  "checkout",
  "checkpoint",
  "checks",
  "checksum",
  "cheek",
  "cheeks",
  "cheer",
  "cheerful",
  "cheerleader",
  "cheerleaders",
  "cheers",
  "cheese",
  "chef",
  "chefs",
  "chelsea",
  "cheltenham",
  "chem",
  "chemical",
  "chemically",
  "chemicals",
  "chemist",
  "chemistry",
  "chemotherapy",
  "chen",
  "cheney",
  "cheng",
  "chennai",
  "cheque",
  "cheques",
  "cher",
  "cherokee",
  "cherries",
  "cherry",
  "cheryl",
  "chesapeake",
  "cheshire",
  "chess",
  "chest",
  "chester",
  "chesterfield",
  "chestnut",
  "chevelle",
  "chevrolet",
  "chevy",
  "chew",
  "cheyenne",
  "chf",
  "chi",
  "chiang",
  "chic",
  "chicago",
  "chick",
  "chicken",
  "chickens",
  "chicks",
  "chico",
  "chief",
  "chiefs",
  "child",
  "childbirth",
  "childcare",
  "childhood",
  "children",
  "childrens",
  "childs",
  "chile",
  "chilean",
  "chili",
  "chill",
  "chimney",
  "chin",
  "china",
  "chinatown",
  "chinese",
  "ching",
  "chip",
  "chips",
  "chipset",
  "chiropractic",
  "chit",
  "chloe",
  "chloride",
  "chlorine",
  "cho",
  "chocolate",
  "chocolates",
  "choice",
  "choices",
  "choir",
  "cholesterol",
  "choose",
  "chooses",
  "choosing",
  "chop",
  "chopped",
  "chopper",
  "choral",
  "chord",
  "chords",
  "chorus",
  "chose",
  "chosen",
  "chow",
  "chr",
  "chris",
  "christ",
  "christchurch",
  "christensen",
  "christi",
  "christian",
  "christianity",
  "christians",
  "christie",
  "christina",
  "christine",
  "christmas",
  "christopher",
  "christy",
  "chromatography",
  "chrome",
  "chromium",
  "chromosome",
  "chronic",
  "chronicle",
  "chronicles",
  "chronological",
  "chronology",
  "chrysler",
  "chu",
  "chubby",
  "chung",
  "chunk",
  "church",
  "churches",
  "churchill",
  "ci",
  "cia",
  "cialis",
  "ciao",
  "ciara",
  "cid",
  "cider",
  "cigar",
  "cigarette",
  "cigarettes",
  "cigars",
  "cimel",
  "cincinnati",
  "cinderella",
  "cindy",
  "cinema",
  "cinemas",
  "cingular",
  "cinnamon",
  "cio",
  "cir",
  "circa",
  "circle",
  "circles",
  "circuit",
  "circuits",
  "circular",
  "circulated",
  "circulating",
  "circulation",
  "circumstance",
  "circumstances",
  "circus",
  "cis",
  "cisco",
  "cit",
  "citation",
  "citations",
  "cite",
  "cited",
  "cites",
  "cities",
  "citing",
  "citizen",
  "citizens",
  "citizenship",
  "citrix",
  "citroen",
  "citrus",
  "city",
  "citysearch",
  "civic",
  "civil",
  "civilian",
  "civilians",
  "civilization",
  "cj",
  "ck",
  "cl",
  "clad",
  "claim",
  "claimant",
  "claimed",
  "claiming",
  "claims",
  "clair",
  "claire",
  "clam",
  "clamp",
  "clamps",
  "clan",
  "clancy",
  "clapton",
  "clara",
  "clare",
  "claremont",
  "clarence",
  "clarendon",
  "clarification",
  "clarified",
  "clarify",
  "clarinet",
  "clarion",
  "clarity",
  "clark",
  "clarke",
  "clarkson",
  "clash",
  "class",
  "classes",
  "classic",
  "classical",
  "classics",
  "classicvacations",
  "classification",
  "classifications",
  "classified",
  "classifieds",
  "classify",
  "classmates",
  "classroom",
  "classrooms",
  "classy",
  "claude",
  "claudia",
  "claus",
  "clause",
  "clauses",
  "claw",
  "clay",
  "clayton",
  "cle",
  "clean",
  "cleaned",
  "cleaner",
  "cleaners",
  "cleaning",
  "cleanliness",
  "cleansing",
  "cleanup",
  "clear",
  "clearance",
  "cleared",
  "clearer",
  "clearing",
  "clearinghouse",
  "clearly",
  "clears",
  "clearwater",
  "cleavage",
  "clement",
  "clemson",
  "clergy",
  "clerical",
  "clerk",
  "clerks",
  "cleveland",
  "clever",
  "cli",
  "clic",
  "click",
  "clicked",
  "clicking",
  "clicks",
  "client",
  "clients",
  "cliff",
  "clifford",
  "cliffs",
  "clifton",
  "climate",
  "climax",
  "climb",
  "climbed",
  "climbing",
  "clin",
  "clinic",
  "clinical",
  "clinically",
  "clinics",
  "clint",
  "clinton",
  "clip",
  "clipart",
  "clipboard",
  "clippers",
  "clips",
  "clit",
  "clive",
  "clock",
  "clocks",
  "clone",
  "clones",
  "cloning",
  "close",
  "closed",
  "closely",
  "closeout",
  "closeouts",
  "closer",
  "closes",
  "closest",
  "closet",
  "closing",
  "closure",
  "closures",
  "cloth",
  "clothes",
  "clothing",
  "cloud",
  "clouds",
  "cloudy",
  "clover",
  "clown",
  "clr",
  "club",
  "clubhouse",
  "clubs",
  "clue",
  "clues",
  "cluster",
  "clustering",
  "clusters",
  "clutch",
  "clutter",
  "clyde",
  "cm",
  "cmd",
  "cme",
  "cmos",
  "cmp",
  "cms",
  "cn",
  "cnc",
  "cnet",
  "cnn",
  "cns",
  "co",
  "coa",
  "coach",
  "coaches",
  "coaching",
  "coal",
  "coalition",
  "coarse",
  "coast",
  "coastal",
  "coaster",
  "coastline",
  "coat",
  "coated",
  "coating",
  "coatings",
  "coats",
  "coaxial",
  "cobalt",
  "cobb",
  "cobra",
  "coca",
  "cocaine",
  "cock",
  "cockpit",
  "cocks",
  "cocktail",
  "cocktails",
  "coco",
  "cocoa",
  "coconut",
  "cocos",
  "cod",
  "code",
  "codec",
  "coded",
  "codes",
  "coding",
  "cody",
  "coe",
  "coed",
  "coefficient",
  "coefficients",
  "coffee",
  "coffin",
  "cognition",
  "cognitive",
  "cohen",
  "coherence",
  "coherent",
  "cohort",
  "coil",
  "coin",
  "coincidence",
  "coins",
  "coke",
  "col",
  "cola",
  "colchester",
  "cold",
  "coldfusion",
  "coldplay",
  "cole",
  "coleman",
  "coli",
  "colin",
  "coll",
  "collaborate",
  "collaboration",
  "collaborations",
  "collaborative",
  "collage",
  "collagen",
  "collapse",
  "collapsed",
  "collar",
  "collars",
  "collateral",
  "colleague",
  "colleagues",
  "collect",
  "collectable",
  "collectables",
  "collected",
  "collectible",
  "collectibles",
  "collecting",
  "collection",
  "collections",
  "collective",
  "collectively",
  "collector",
  "collectors",
  "collects",
  "colleen",
  "college",
  "colleges",
  "collegiate",
  "collier",
  "collins",
  "collision",
  "collisions",
  "cologne",
  "colombia",
  "colombian",
  "colon",
  "colonel",
  "colonial",
  "colonies",
  "colony",
  "color",
  "colorado",
  "colored",
  "colorful",
  "coloring",
  "colors",
  "colour",
  "coloured",
  "colours",
  "colt",
  "colts",
  "columbia",
  "columbus",
  "column",
  "columnist",
  "columnists",
  "columns",
  "com",
  "coma",
  "comb",
  "combat",
  "combination",
  "combinations",
  "combine",
  "combined",
  "combines",
  "combining",
  "combo",
  "combustion",
  "comcast",
  "come",
  "comeback",
  "comedies",
  "comedy",
  "comes",
  "comet",
  "comfort",
  "comfortable",
  "comfortably",
  "comforter",
  "comic",
  "comics",
  "coming",
  "comm",
  "comma",
  "command",
  "commanded",
  "commander",
  "commanders",
  "commanding",
  "commandments",
  "commands",
  "commence",
  "commenced",
  "commencement",
  "commencing",
  "comment",
  "commentaries",
  "commentary",
  "commented",
  "commenting",
  "comments",
  "commentsblog",
  "commerce",
  "commercial",
  "commercially",
  "commercials",
  "commission",
  "commissioned",
  "commissioner",
  "commissioners",
  "commissioning",
  "commissions",
  "commit",
  "commitment",
  "commitments",
  "commits",
  "committed",
  "committee",
  "committees",
  "committing",
  "commodities",
  "commodity",
  "commodore",
  "common",
  "commonly",
  "commons",
  "commonwealth",
  "communal",
  "communicate",
  "communicated",
  "communicating",
  "communication",
  "communications",
  "communicator",
  "communion",
  "communism",
  "communist",
  "communities",
  "community",
  "commute",
  "commuter",
  "como",
  "comoros",
  "comp",
  "compact",
  "compactflash",
  "companies",
  "companion",
  "companions",
  "company",
  "compaq",
  "comparable",
  "comparative",
  "compare",
  "compared",
  "compares",
  "comparing",
  "comparison",
  "comparisons",
  "compartment",
  "compass",
  "compassion",
  "compassionate",
  "compatibility",
  "compatible",
  "compelled",
  "compelling",
  "compensate",
  "compensated",
  "compensation",
  "compete",
  "competence",
  "competencies",
  "competency",
  "competent",
  "competing",
  "competition",
  "competitions",
  "competitive",
  "competitiveness",
  "competitor",
  "competitors",
  "compilation",
  "compilations",
  "compile",
  "compiled",
  "compiler",
  "compilers",
  "compiling",
  "complain",
  "complainant",
  "complained",
  "complaining",
  "complaint",
  "complaints",
  "complement",
  "complementary",
  "complete",
  "completed",
  "completely",
  "completeness",
  "completes",
  "completing",
  "completion",
  "complex",
  "complexes",
  "complexity",
  "compliance",
  "compliant",
  "complicated",
  "complications",
  "complied",
  "complies",
  "compliment",
  "complimentary",
  "compliments",
  "comply",
  "complying",
  "component",
  "components",
  "compose",
  "composed",
  "composer",
  "composers",
  "composite",
  "composites",
  "composition",
  "compositions",
  "compost",
  "compound",
  "compounds",
  "comprehension",
  "comprehensive",
  "compress",
  "compressed",
  "compression",
  "compressor",
  "comprise",
  "comprised",
  "comprises",
  "comprising",
  "compromise",
  "compromised",
  "compton",
  "comptroller",
  "compulsory",
  "computation",
  "computational",
  "compute",
  "computed",
  "computer",
  "computerized",
  "computers",
  "computerworld",
  "computing",
  "comstock",
  "con",
  "conan",
  "concealed",
  "conceived",
  "concentrate",
  "concentrated",
  "concentrating",
  "concentration",
  "concentrations",
  "concept",
  "conception",
  "concepts",
  "conceptual",
  "concern",
  "concerned",
  "concerning",
  "concerns",
  "concert",
  "concerto",
  "concerts",
  "concession",
  "concessions",
  "concierge",
  "concise",
  "conclude",
  "concluded",
  "concludes",
  "concluding",
  "conclusion",
  "conclusions",
  "concord",
  "concordance",
  "concordia",
  "concrete",
  "concurrent",
  "cond",
  "condemned",
  "condensed",
  "condition",
  "conditional",
  "conditioned",
  "conditioner",
  "conditioners",
  "conditioning",
  "conditions",
  "condo",
  "condom",
  "condominium",
  "condominiums",
  "condoms",
  "condos",
  "condosaver",
  "conduct",
  "conducted",
  "conducting",
  "conductivity",
  "conductor",
  "conducts",
  "conduit",
  "cone",
  "conf",
  "confederate",
  "conference",
  "conferences",
  "conferencing",
  "conferred",
  "confess",
  "confession",
  "confessions",
  "confidence",
  "confident",
  "confidential",
  "confidentiality",
  "config",
  "configurable",
  "configuration",
  "configurations",
  "configure",
  "configured",
  "configuring",
  "confined",
  "confinement",
  "confirm",
  "confirmation",
  "confirmed",
  "confirming",
  "confirms",
  "conflict",
  "conflicting",
  "conflicts",
  "conform",
  "conformance",
  "conforming",
  "conformity",
  "confront",
  "confrontation",
  "confronted",
  "conftest",
  "confused",
  "confusing",
  "confusion",
  "congenital",
  "congestion",
  "congo",
  "congrats",
  "congratulations",
  "congregation",
  "congress",
  "congressional",
  "congressman",
  "conjunction",
  "conn",
  "connect",
  "connected",
  "connecticut",
  "connecting",
  "connection",
  "connections",
  "connectivity",
  "connector",
  "connectors",
  "connects",
  "connie",
  "connor",
  "conquer",
  "conquest",
  "conrad",
  "cons",
  "conscience",
  "conscious",
  "consciousness",
  "consecutive",
  "consensus",
  "consent",
  "consequence",
  "consequences",
  "consequential",
  "consequently",
  "conserv",
  "conservation",
  "conservative",
  "conservatives",
  "conservatory",
  "conserve",
  "conserved",
  "consider",
  "considerable",
  "considerably",
  "consideration",
  "considerations",
  "considered",
  "considering",
  "considers",
  "consist",
  "consisted",
  "consistency",
  "consistent",
  "consistently",
  "consisting",
  "consists",
  "console",
  "consoles",
  "consolidate",
  "consolidated",
  "consolidation",
  "consortium",
  "conspiracy",
  "const",
  "constant",
  "constantly",
  "constants",
  "constituency",
  "constituent",
  "constituents",
  "constitute",
  "constituted",
  "constitutes",
  "constitution",
  "constitutional",
  "constr",
  "constrained",
  "constraint",
  "constraints",
  "construct",
  "constructed",
  "constructing",
  "construction",
  "constructive",
  "constructor",
  "constructs",
  "construed",
  "consulate",
  "consult",
  "consultancy",
  "consultant",
  "consultants",
  "consultation",
  "consultations",
  "consulted",
  "consulting",
  "consumables",
  "consume",
  "consumed",
  "consumer",
  "consumers",
  "consuming",
  "consumption",
  "cont",
  "contact",
  "contacted",
  "contacting",
  "contacts",
  "contain",
  "contained",
  "container",
  "containers",
  "containing",
  "containment",
  "contains",
  "contaminants",
  "contaminated",
  "contamination",
  "contemporary",
  "contempt",
  "content",
  "contention",
  "contents",
  "contest",
  "contested",
  "contests",
  "context",
  "contexts",
  "contextual",
  "contiguous",
  "continent",
  "continental",
  "continents",
  "contingency",
  "contingent",
  "continual",
  "continually",
  "continuation",
  "continue",
  "continued",
  "continues",
  "continuing",
  "continuity",
  "continuous",
  "continuously",
  "continuum",
  "contour",
  "contra",
  "contraception",
  "contract",
  "contracted",
  "contracting",
  "contraction",
  "contractor",
  "contractors",
  "contracts",
  "contractual",
  "contradiction",
  "contrary",
  "contrast",
  "contrib",
  "contribute",
  "contributed",
  "contributes",
  "contributing",
  "contribution",
  "contributions",
  "contributor",
  "contributors",
  "control",
  "controlled",
  "controller",
  "controllers",
  "controlling",
  "controls",
  "controversial",
  "controversy",
  "convection",
  "convenience",
  "convenient",
  "conveniently",
  "convention",
  "conventional",
  "conventions",
  "convergence",
  "conversation",
  "conversations",
  "converse",
  "conversely",
  "conversion",
  "conversions",
  "convert",
  "converted",
  "converter",
  "converters",
  "convertible",
  "converting",
  "converts",
  "convex",
  "convey",
  "convicted",
  "conviction",
  "convictions",
  "convince",
  "convinced",
  "convincing",
  "conway",
  "cook",
  "cookbook",
  "cookbooks",
  "cooke",
  "cooked",
  "cooker",
  "cookers",
  "cookie",
  "cookies",
  "cooking",
  "cooks",
  "cookware",
  "cool",
  "cooled",
  "cooler",
  "coolers",
  "coolest",
  "cooling",
  "coolpix",
  "coop",
  "cooper",
  "cooperate",
  "cooperation",
  "cooperative",
  "coordinate",
  "coordinated",
  "coordinates",
  "coordinating",
  "coordination",
  "coordinator",
  "coordinators",
  "cop",
  "cope",
  "copenhagen",
  "copied",
  "copier",
  "copiers",
  "copies",
  "coping",
  "copper",
  "coppermine",
  "cops",
  "copy",
  "copying",
  "copyright",
  "copyrighted",
  "copyrights",
  "cor",
  "coral",
  "corba",
  "cord",
  "cordless",
  "cords",
  "core",
  "corel",
  "cores",
  "corey",
  "corinthians",
  "cork",
  "corn",
  "cornell",
  "corner",
  "corners",
  "cornerstone",
  "corning",
  "cornwall",
  "corona",
  "coronary",
  "corp",
  "corporate",
  "corporation",
  "corporations",
  "corps",
  "corpse",
  "corpus",
  "corr",
  "correct",
  "corrected",
  "correcting",
  "correction",
  "correctional",
  "corrections",
  "corrective",
  "correctly",
  "correctness",
  "correlated",
  "correlation",
  "correlations",
  "correspond",
  "correspondence",
  "correspondent",
  "corresponding",
  "corresponds",
  "corridor",
  "corridors",
  "corrosion",
  "corrupt",
  "corrupted",
  "corruption",
  "corsair",
  "cortex",
  "corvette",
  "cory",
  "cos",
  "cosmetic",
  "cosmetics",
  "cosmic",
  "cosmopolitan",
  "cosmos",
  "cosponsors",
  "cost",
  "costa",
  "costello",
  "costing",
  "costly",
  "costs",
  "costume",
  "costumes",
  "cot",
  "cote",
  "cottage",
  "cottages",
  "cotton",
  "couch",
  "cough",
  "could",
  "council",
  "councillor",
  "councillors",
  "councils",
  "counsel",
  "counseling",
  "counselling",
  "counselor",
  "counselors",
  "count",
  "countdown",
  "counted",
  "counter",
  "counterpart",
  "counterparts",
  "counters",
  "counties",
  "counting",
  "countless",
  "countries",
  "country",
  "countryside",
  "countrywide",
  "counts",
  "county",
  "coup",
  "coupe",
  "couple",
  "coupled",
  "couples",
  "coupling",
  "coupon",
  "coupons",
  "courage",
  "courier",
  "course",
  "courses",
  "coursework",
  "court",
  "courtesy",
  "courthouse",
  "courtney",
  "courtroom",
  "courts",
  "courtyard",
  "cousin",
  "cousins",
  "couture",
  "cove",
  "covenant",
  "coventry",
  "cover",
  "coverage",
  "covered",
  "covering",
  "covers",
  "covert",
  "covington",
  "cow",
  "coward",
  "cowboy",
  "cowboys",
  "cows",
  "cox",
  "coyote",
  "cozy",
  "cp",
  "cpa",
  "cpan",
  "cpc",
  "cpe",
  "cpg",
  "cpi",
  "cpl",
  "cpm",
  "cpp",
  "cpr",
  "cps",
  "cpt",
  "cpu",
  "cpus",
  "cq",
  "cr",
  "crab",
  "crack",
  "cracked",
  "cracker",
  "crackers",
  "cracking",
  "cracks",
  "cradle",
  "craft",
  "crafted",
  "crafts",
  "craftsman",
  "craig",
  "craigslist",
  "cramer",
  "cranberry",
  "crane",
  "crank",
  "crap",
  "craps",
  "crash",
  "crashed",
  "crashes",
  "crashing",
  "crate",
  "crater",
  "crawford",
  "crawl",
  "crazy",
  "crc",
  "cre",
  "cream",
  "creampie",
  "creamy",
  "create",
  "created",
  "creates",
  "creatine",
  "creating",
  "creation",
  "creations",
  "creative",
  "creativity",
  "creator",
  "creators",
  "creature",
  "creatures",
  "credentials",
  "credibility",
  "credible",
  "credit",
  "credited",
  "creditor",
  "creditors",
  "credits",
  "creed",
  "creek",
  "creep",
  "creepy",
  "creme",
  "creole",
  "crescent",
  "crest",
  "crete",
  "crew",
  "crews",
  "crib",
  "cricket",
  "cried",
  "cries",
  "crime",
  "crimes",
  "criminal",
  "criminals",
  "crimson",
  "crises",
  "crisis",
  "crisp",
  "criteria",
  "criterion",
  "critic",
  "critical",
  "critically",
  "criticism",
  "criticized",
  "critics",
  "critique",
  "critiques",
  "crm",
  "crn",
  "croatia",
  "croatian",
  "crochet",
  "crocodile",
  "croix",
  "cron",
  "crooked",
  "crop",
  "crops",
  "crosby",
  "cross",
  "crosse",
  "crossed",
  "crosses",
  "crossing",
  "crossover",
  "crossroads",
  "crossword",
  "crow",
  "crowd",
  "crowded",
  "crowds",
  "crown",
  "crowne",
  "croydon",
  "crs",
  "crt",
  "crucial",
  "crude",
  "cruel",
  "cruelty",
  "cruise",
  "cruiser",
  "cruises",
  "cruising",
  "crunch",
  "crusade",
  "crush",
  "crushed",
  "crust",
  "cruz",
  "cry",
  "crying",
  "crypt",
  "crypto",
  "cryptography",
  "crystal",
  "crystals",
  "cs",
  "csa",
  "csc",
  "csi",
  "csr",
  "css",
  "cst",
  "csu",
  "csv",
  "ct",
  "ctr",
  "ctrl",
  "cts",
  "ctx",
  "cu",
  "cub",
  "cuba",
  "cuban",
  "cube",
  "cubes",
  "cubic",
  "cubs",
  "cucumber",
  "cue",
  "cues",
  "cuff",
  "cuisine",
  "culinary",
  "cult",
  "cultivated",
  "cultivation",
  "cultural",
  "culturally",
  "culture",
  "cultured",
  "cultures",
  "cum",
  "cumberland",
  "cumbria",
  "cumfiesta",
  "cumming",
  "cummings",
  "cumshot",
  "cumshots",
  "cumulative",
  "cunningham",
  "cunt",
  "cup",
  "cups",
  "cur",
  "curb",
  "cure",
  "cured",
  "curiosity",
  "curious",
  "curl",
  "curling",
  "curly",
  "currencies",
  "currency",
  "current",
  "currently",
  "currents",
  "curricula",
  "curricular",
  "curriculum",
  "curry",
  "curse",
  "cursed",
  "cursor",
  "curtain",
  "curtains",
  "curtis",
  "curve",
  "curved",
  "curves",
  "cushion",
  "cushions",
  "custodian",
  "custody",
  "custom",
  "customary",
  "customer",
  "customers",
  "customise",
  "customised",
  "customizable",
  "customization",
  "customize",
  "customized",
  "customizing",
  "customs",
  "cut",
  "cute",
  "cutie",
  "cutlery",
  "cuts",
  "cutter",
  "cutters",
  "cutting",
  "cuz",
  "cv",
  "cvs",
  "cvsroot",
  "cw",
  "cx",
  "cy",
  "cyan",
  "cyber",
  "cyberspace",
  "cycle",
  "cycles",
  "cyclic",
  "cycling",
  "cyclone",
  "cygwin",
  "cylinder",
  "cylinders",
  "cymru",
  "cynthia",
  "cypress",
  "cyprus",
  "cyrus",
  "cz",
  "czech",
  "d",
  "da",
  "dab",
  "dac",
  "dad",
  "daddy",
  "dade",
  "dads",
  "daemon",
  "daewoo",
  "dag",
  "daily",
  "dairy",
  "daisy",
  "dakota",
  "dal",
  "dale",
  "dallas",
  "dalton",
  "daly",
  "dam",
  "damage",
  "damaged",
  "damages",
  "damaging",
  "dame",
  "damien",
  "damn",
  "damned",
  "damon",
  "damp",
  "dams",
  "dan",
  "dana",
  "dance",
  "dancer",
  "dancers",
  "dances",
  "dancing",
  "dane",
  "danger",
  "dangerous",
  "dangers",
  "daniel",
  "danielle",
  "daniels",
  "danish",
  "danny",
  "dans",
  "dansk",
  "dante",
  "danville",
  "dar",
  "darby",
  "dare",
  "darfur",
  "daring",
  "dark",
  "darker",
  "darkness",
  "darling",
  "darlington",
  "darn",
  "darren",
  "dart",
  "darth",
  "dartmouth",
  "darts",
  "darussalam",
  "darwin",
  "das",
  "dash",
  "dashboard",
  "dashed",
  "dat",
  "data",
  "database",
  "databases",
  "dataset",
  "datasets",
  "datasheet",
  "datatype",
  "date",
  "dated",
  "dates",
  "dating",
  "datum",
  "dau",
  "daughter",
  "daughters",
  "dave",
  "davenport",
  "david",
  "davidson",
  "davies",
  "davis",
  "dawn",
  "dawson",
  "day",
  "daycare",
  "daylight",
  "days",
  "daytime",
  "dayton",
  "daytona",
  "db",
  "dba",
  "dblp",
  "dbz",
  "dc",
  "dcp",
  "dcr",
  "dcs",
  "dd",
  "ddr",
  "dds",
  "de",
  "dea",
  "dead",
  "deadline",
  "deadlines",
  "deadly",
  "deaf",
  "deal",
  "dealer",
  "dealers",
  "dealership",
  "dealing",
  "dealings",
  "deals",
  "dealt",
  "dealtime",
  "dean",
  "dear",
  "death",
  "deaths",
  "deb",
  "debate",
  "debates",
  "debbie",
  "debian",
  "debit",
  "deborah",
  "debra",
  "debris",
  "debt",
  "debtor",
  "debts",
  "debug",
  "debugger",
  "debugging",
  "debuginfo",
  "debut",
  "dec",
  "decade",
  "decades",
  "decal",
  "decals",
  "decatur",
  "decay",
  "deceased",
  "december",
  "decent",
  "deception",
  "decide",
  "decided",
  "decides",
  "deciding",
  "decimal",
  "decision",
  "decisions",
  "decisive",
  "deck",
  "decker",
  "decks",
  "declaration",
  "declarations",
  "declare",
  "declared",
  "declares",
  "declaring",
  "decline",
  "declined",
  "declines",
  "declining",
  "deco",
  "decoder",
  "decoding",
  "decomposition",
  "decor",
  "decorate",
  "decorated",
  "decorating",
  "decoration",
  "decorations",
  "decorative",
  "decrease",
  "decreased",
  "decreases",
  "decreasing",
  "decree",
  "dedicated",
  "dedication",
  "deducted",
  "deductible",
  "deduction",
  "deductions",
  "dee",
  "deed",
  "deeds",
  "deemed",
  "deep",
  "deeper",
  "deepest",
  "deeply",
  "deepthroat",
  "deer",
  "deere",
  "def",
  "default",
  "defaults",
  "defeat",
  "defeated",
  "defect",
  "defective",
  "defects",
  "defence",
  "defend",
  "defendant",
  "defendants",
  "defended",
  "defender",
  "defenders",
  "defending",
  "defense",
  "defenses",
  "defensive",
  "deferred",
  "deficiencies",
  "deficiency",
  "deficient",
  "deficit",
  "deficits",
  "definately",
  "define",
  "defined",
  "defines",
  "defining",
  "definite",
  "definitely",
  "definition",
  "definitions",
  "definitive",
  "deformation",
  "deg",
  "degradation",
  "degree",
  "degrees",
  "dehydrogenase",
  "dei",
  "del",
  "delaware",
  "delay",
  "delayed",
  "delays",
  "delegate",
  "delegated",
  "delegates",
  "delegation",
  "delete",
  "deleted",
  "deleting",
  "deletion",
  "delhi",
  "deli",
  "deliberate",
  "deliberately",
  "delicate",
  "delicious",
  "delight",
  "delighted",
  "delightful",
  "delights",
  "deliver",
  "delivered",
  "deliveries",
  "delivering",
  "delivers",
  "delivery",
  "dell",
  "della",
  "delle",
  "delphi",
  "delta",
  "deluxe",
  "dem",
  "demand",
  "demanded",
  "demanding",
  "demands",
  "dementia",
  "demi",
  "demo",
  "democracy",
  "democrat",
  "democratic",
  "democrats",
  "demographic",
  "demographics",
  "demolition",
  "demon",
  "demons",
  "demonstrate",
  "demonstrated",
  "demonstrates",
  "demonstrating",
  "demonstration",
  "demonstrations",
  "demos",
  "dems",
  "demux",
  "den",
  "denial",
  "denied",
  "denies",
  "denim",
  "denis",
  "denise",
  "denmark",
  "dennis",
  "denny",
  "denon",
  "denote",
  "denoted",
  "denotes",
  "dense",
  "densities",
  "density",
  "dent",
  "dental",
  "dentist",
  "dentistry",
  "dentists",
  "denton",
  "denver",
  "deny",
  "denying",
  "dep",
  "depart",
  "departed",
  "departing",
  "department",
  "departmental",
  "departments",
  "departure",
  "departures",
  "depeche",
  "depend",
  "dependable",
  "dependence",
  "dependencies",
  "dependency",
  "dependent",
  "depending",
  "depends",
  "depicted",
  "depletion",
  "deploy",
  "deployed",
  "deploying",
  "deployment",
  "deposit",
  "deposited",
  "deposition",
  "deposits",
  "depot",
  "deprecated",
  "depreciation",
  "depressed",
  "depression",
  "deprivation",
  "deprived",
  "dept",
  "depth",
  "depths",
  "deputy",
  "der",
  "derby",
  "derbyshire",
  "derek",
  "derivative",
  "derivatives",
  "derive",
  "derived",
  "dermatology",
  "des",
  "desc",
  "descendants",
  "descending",
  "descent",
  "describe",
  "described",
  "describes",
  "describing",
  "description",
  "descriptions",
  "descriptive",
  "descriptor",
  "desert",
  "deserve",
  "deserved",
  "deserves",
  "design",
  "designate",
  "designated",
  "designation",
  "designed",
  "designer",
  "designers",
  "designing",
  "designs",
  "desirable",
  "desire",
  "desired",
  "desires",
  "desk",
  "deskjet",
  "desks",
  "desktop",
  "desktops",
  "despair",
  "desperate",
  "desperately",
  "despite",
  "dessert",
  "desserts",
  "destination",
  "destinations",
  "destined",
  "destiny",
  "destroy",
  "destroyed",
  "destroying",
  "destruction",
  "destructive",
  "det",
  "detached",
  "detail",
  "detailed",
  "detailing",
  "details",
  "detained",
  "detainees",
  "detect",
  "detected",
  "detecting",
  "detection",
  "detective",
  "detector",
  "detectors",
  "detects",
  "detention",
  "deter",
  "deterioration",
  "determinants",
  "determination",
  "determinations",
  "determine",
  "determined",
  "determines",
  "determining",
  "detox",
  "detroit",
  "deutsch",
  "deutsche",
  "deutschland",
  "dev",
  "devastating",
  "devel",
  "develop",
  "developed",
  "developer",
  "developers",
  "developing",
  "development",
  "developmental",
  "developments",
  "develops",
  "deviant",
  "deviantart",
  "deviation",
  "deviations",
  "device",
  "devices",
  "devil",
  "devils",
  "devised",
  "devon",
  "devoted",
  "devotion",
  "dew",
  "dewalt",
  "dewey",
  "dex",
  "dexter",
  "df",
  "dg",
  "dh",
  "dhcp",
  "dhs",
  "dhtml",
  "di",
  "dia",
  "diabetes",
  "diabetic",
  "diablo",
  "diagnose",
  "diagnosed",
  "diagnosis",
  "diagnostic",
  "diagnostics",
  "diagonal",
  "diagram",
  "diagrams",
  "dial",
  "dialing",
  "dialog",
  "dialogue",
  "dialup",
  "dialysis",
  "diameter",
  "diamond",
  "diamonds",
  "diana",
  "diane",
  "diaper",
  "diapers",
  "diaries",
  "diarrhea",
  "diary",
  "diaz",
  "diazepam",
  "dice",
  "dick",
  "dicke",
  "dickens",
  "dickinson",
  "dicks",
  "dickson",
  "dictionaries",
  "dictionary",
  "did",
  "didnt",
  "didrex",
  "die",
  "diecast",
  "died",
  "diego",
  "dies",
  "diesel",
  "diet",
  "dietary",
  "diets",
  "diff",
  "differ",
  "difference",
  "differences",
  "different",
  "differential",
  "differentiate",
  "differentiated",
  "differentiation",
  "differently",
  "differing",
  "differs",
  "difficult",
  "difficulties",
  "difficulty",
  "diffs",
  "diffuse",
  "diffusion",
  "dig",
  "digest",
  "digestion",
  "digestive",
  "digg",
  "digging",
  "diggs",
  "digi",
  "digimon",
  "digit",
  "digital",
  "digitally",
  "digits",
  "dignity",
  "dildo",
  "dildos",
  "dilemma",
  "diligence",
  "dillon",
  "diluted",
  "dim",
  "dimage",
  "dime",
  "dimension",
  "dimensional",
  "dimensions",
  "diminished",
  "dimm",
  "din",
  "dinar",
  "dine",
  "diner",
  "diners",
  "ding",
  "dining",
  "dinner",
  "dinners",
  "dinnerware",
  "dino",
  "dinosaur",
  "dinosaurs",
  "diocese",
  "diode",
  "dion",
  "dior",
  "dioxide",
  "dip",
  "diploma",
  "diplomacy",
  "diplomatic",
  "dir",
  "dire",
  "direct",
  "directed",
  "directing",
  "direction",
  "directional",
  "directions",
  "directive",
  "directives",
  "directly",
  "director",
  "directorate",
  "directories",
  "directors",
  "directory",
  "directs",
  "directv",
  "directx",
  "dirk",
  "dirt",
  "dirty",
  "dis",
  "disabilities",
  "disability",
  "disable",
  "disabled",
  "disadvantage",
  "disadvantaged",
  "disadvantages",
  "disagree",
  "disagreement",
  "disappear",
  "disappeared",
  "disappointed",
  "disappointing",
  "disappointment",
  "disaster",
  "disasters",
  "disc",
  "discard",
  "discarded",
  "discharge",
  "discharged",
  "discharges",
  "disciples",
  "disciplinary",
  "discipline",
  "disciplines",
  "disclaimer",
  "disclaimers",
  "disclaims",
  "disclose",
  "disclosed",
  "disclosure",
  "disclosures",
  "disco",
  "discography",
  "discomfort",
  "disconnect",
  "disconnected",
  "discontinued",
  "discount",
  "discounted",
  "discounts",
  "discourse",
  "discover",
  "discovered",
  "discoveries",
  "discovering",
  "discovers",
  "discovery",
  "discreet",
  "discrepancies",
  "discrete",
  "discretion",
  "discretionary",
  "discriminate",
  "discrimination",
  "discriminatory",
  "discs",
  "discuss",
  "discussed",
  "discusses",
  "discussing",
  "discussion",
  "discussions",
  "disease",
  "diseases",
  "dish",
  "dishes",
  "dishnetwork",
  "dishwasher",
  "disk",
  "disks",
  "dislike",
  "dismiss",
  "dismissal",
  "dismissed",
  "disney",
  "disneyland",
  "disorder",
  "disorders",
  "dispatch",
  "dispatched",
  "dispenser",
  "dispensing",
  "dispersed",
  "dispersion",
  "displaced",
  "displacement",
  "display",
  "displayed",
  "displaying",
  "displays",
  "disposable",
  "disposal",
  "dispose",
  "disposed",
  "disposition",
  "dispute",
  "disputed",
  "disputes",
  "disregard",
  "disruption",
  "dissemination",
  "dissent",
  "dissertation",
  "dissolution",
  "dissolved",
  "dist",
  "distance",
  "distances",
  "distant",
  "distinct",
  "distinction",
  "distinctive",
  "distinguish",
  "distinguished",
  "distinguishing",
  "distorted",
  "distortion",
  "distress",
  "distressed",
  "distribute",
  "distributed",
  "distributing",
  "distribution",
  "distributions",
  "distributor",
  "distributors",
  "district",
  "districts",
  "disturbance",
  "disturbances",
  "disturbed",
  "disturbing",
  "dit",
  "ditch",
  "div",
  "diva",
  "dive",
  "diver",
  "divers",
  "diverse",
  "diversified",
  "diversion",
  "diversity",
  "divide",
  "divided",
  "dividend",
  "dividends",
  "dividing",
  "divine",
  "diving",
  "division",
  "divisions",
  "divorce",
  "divorced",
  "divx",
  "dixie",
  "dixon",
  "diy",
  "dj",
  "djibouti",
  "djs",
  "dk",
  "dl",
  "dll",
  "dlp",
  "dm",
  "dma",
  "dmc",
  "dmoz",
  "dmx",
  "dn",
  "dna",
  "dns",
  "do",
  "doc",
  "docbook",
  "dock",
  "docket",
  "docking",
  "docs",
  "doctor",
  "doctoral",
  "doctorate",
  "doctors",
  "doctrine",
  "docume",
  "document",
  "documentaries",
  "documentary",
  "documentation",
  "documented",
  "documenting",
  "documents",
  "dod",
  "dodge",
  "dodgers",
  "doe",
  "does",
  "doesnt",
  "dog",
  "dogg",
  "dogs",
  "doi",
  "doing",
  "dolby",
  "dolce",
  "doll",
  "dollar",
  "dollars",
  "dolls",
  "dolly",
  "dolphin",
  "dolphins",
  "dom",
  "domain",
  "domains",
  "dome",
  "domestic",
  "dominance",
  "dominant",
  "dominate",
  "dominated",
  "domination",
  "dominic",
  "dominica",
  "dominican",
  "dominion",
  "domino",
  "don",
  "donald",
  "donate",
  "donated",
  "donation",
  "donations",
  "doncaster",
  "done",
  "dong",
  "donkey",
  "donna",
  "donor",
  "donors",
  "donovan",
  "dont",
  "doo",
  "doom",
  "doomed",
  "door",
  "doors",
  "dooyoo",
  "doppler",
  "dora",
  "dorado",
  "doris",
  "dorm",
  "dorothy",
  "dorset",
  "dos",
  "dosage",
  "dose",
  "doses",
  "dot",
  "dots",
  "dotted",
  "double",
  "doubled",
  "doubles",
  "doubt",
  "doubts",
  "doug",
  "dough",
  "doughty",
  "douglas",
  "dove",
  "dover",
  "dow",
  "down",
  "downhill",
  "downing",
  "download",
  "downloadable",
  "downloaded",
  "downloading",
  "downloads",
  "downs",
  "downstairs",
  "downstream",
  "downtime",
  "downtown",
  "downward",
  "doyle",
  "dozen",
  "dozens",
  "dp",
  "dpi",
  "dq",
  "dr",
  "draft",
  "drafted",
  "drafting",
  "drafts",
  "drag",
  "dragged",
  "dragging",
  "dragon",
  "dragonball",
  "dragonfly",
  "dragons",
  "drain",
  "drainage",
  "drained",
  "drake",
  "dram",
  "drama",
  "dramas",
  "dramatic",
  "dramatically",
  "drank",
  "draper",
  "draw",
  "drawer",
  "drawers",
  "drawing",
  "drawings",
  "drawn",
  "draws",
  "dread",
  "dream",
  "dreamcast",
  "dreamed",
  "dreaming",
  "dreams",
  "dreamweaver",
  "dreamy",
  "dresden",
  "dress",
  "dressed",
  "dresser",
  "dresses",
  "dressing",
  "drew",
  "dried",
  "drift",
  "drill",
  "drilled",
  "drilling",
  "drills",
  "drink",
  "drinking",
  "drinks",
  "drip",
  "drive",
  "driven",
  "driver",
  "drivers",
  "drives",
  "driveway",
  "driving",
  "drm",
  "drop",
  "dropped",
  "dropping",
  "drops",
  "drosophila",
  "drought",
  "drove",
  "drowning",
  "drug",
  "drugs",
  "drum",
  "drummer",
  "drums",
  "drunk",
  "drunken",
  "drupal",
  "dry",
  "dryer",
  "dryers",
  "drying",
  "ds",
  "dsa",
  "dsc",
  "dsl",
  "dsm",
  "dsp",
  "dss",
  "dst",
  "dt",
  "dtd",
  "dts",
  "du",
  "dual",
  "duane",
  "dub",
  "dubai",
  "dubbed",
  "dublin",
  "duck",
  "ducks",
  "duct",
  "dude",
  "dudley",
  "due",
  "duel",
  "dues",
  "duff",
  "dug",
  "dui",
  "duke",
  "dukes",
  "dull",
  "duluth",
  "duly",
  "dumb",
  "dummies",
  "dummy",
  "dump",
  "dumped",
  "dumping",
  "dun",
  "duncan",
  "dundee",
  "dune",
  "dunes",
  "dungeon",
  "dungeons",
  "dunlop",
  "dunn",
  "dunno",
  "duo",
  "duplex",
  "duplicate",
  "duplicated",
  "duplication",
  "dupont",
  "durability",
  "durable",
  "durango",
  "duration",
  "durban",
  "durham",
  "during",
  "dusk",
  "dust",
  "dustin",
  "dusty",
  "dutch",
  "duties",
  "duty",
  "dv",
  "dvb",
  "dvd",
  "dvds",
  "dvi",
  "dvr",
  "dw",
  "dwarf",
  "dwell",
  "dwelling",
  "dwellings",
  "dwi",
  "dwight",
  "dx",
  "dy",
  "dye",
  "dyer",
  "dyes",
  "dying",
  "dyke",
  "dylan",
  "dynamic",
  "dynamically",
  "dynamics",
  "dynamite",
  "dynasty",
  "dysfunction",
  "dyson",
  "dz",
  "e",
  "ea",
  "each",
  "eager",
  "eagle",
  "eagles",
  "ean",
  "ear",
  "earl",
  "earlier",
  "earliest",
  "early",
  "earn",
  "earned",
  "earnest",
  "earning",
  "earnings",
  "earns",
  "earring",
  "earrings",
  "ears",
  "earth",
  "earthquake",
  "earthquakes",
  "eas",
  "ease",
  "easier",
  "easiest",
  "easily",
  "east",
  "easter",
  "eastern",
  "eastman",
  "easton",
  "easy",
  "easyshare",
  "eat",
  "eaten",
  "eater",
  "eating",
  "eaton",
  "eats",
  "eau",
  "eb",
  "ebay",
  "ebony",
  "ebook",
  "ebooks",
  "ebusiness",
  "ec",
  "ecard",
  "ecards",
  "ecc",
  "echo",
  "echoes",
  "eclectic",
  "eclipse",
  "eco",
  "ecological",
  "ecology",
  "ecommerce",
  "econ",
  "econo",
  "economic",
  "economical",
  "economically",
  "economics",
  "economies",
  "economist",
  "economists",
  "economy",
  "econpapers",
  "ecosystem",
  "ecosystems",
  "ecs",
  "ecstasy",
  "ect",
  "ecuador",
  "ed",
  "eddy",
  "eden",
  "edgar",
  "edge",
  "edges",
  "edi",
  "edible",
  "edinburgh",
  "edison",
  "edit",
  "edited",
  "edith",
  "editing",
  "edition",
  "editions",
  "editor",
  "editorial",
  "editorials",
  "editors",
  "edits",
  "edmonton",
  "edmund",
  "eds",
  "edt",
  "edu",
  "educ",
  "educate",
  "educated",
  "educating",
  "education",
  "educational",
  "educator",
  "educators",
  "edward",
  "edwards",
  "edwin",
  "ee",
  "een",
  "ef",
  "eff",
  "effect",
  "effected",
  "effective",
  "effectively",
  "effectiveness",
  "effects",
  "efficacy",
  "efficiencies",
  "efficiency",
  "efficient",
  "efficiently",
  "effluent",
  "effort",
  "efforts",
  "eg",
  "egg",
  "eggs",
  "ego",
  "egypt",
  "egyptian",
  "eh",
  "ei",
  "eia",
  "eight",
  "eighteen",
  "eighth",
  "eighty",
  "eileen",
  "ein",
  "eine",
  "einstein",
  "eis",
  "either",
  "ej",
  "ejaculation",
  "ek",
  "el",
  "elaborate",
  "elaine",
  "elapsed",
  "elastic",
  "elbow",
  "elder",
  "elderly",
  "elders",
  "eleanor",
  "elec",
  "elect",
  "elected",
  "election",
  "elections",
  "elective",
  "electives",
  "electoral",
  "electra",
  "electric",
  "electrical",
  "electricity",
  "electro",
  "electrode",
  "electrodes",
  "electromagnetic",
  "electron",
  "electronic",
  "electronica",
  "electronically",
  "electronics",
  "electrons",
  "elegance",
  "elegant",
  "elem",
  "element",
  "elemental",
  "elementary",
  "elements",
  "elena",
  "elephant",
  "elephants",
  "elevated",
  "elevation",
  "elevator",
  "eleven",
  "elf",
  "elgin",
  "eli",
  "eligibility",
  "eligible",
  "elijah",
  "eliminate",
  "eliminated",
  "eliminates",
  "eliminating",
  "elimination",
  "eliot",
  "elisa",
  "elisabeth",
  "elite",
  "eliza",
  "elizabeth",
  "elk",
  "ella",
  "elle",
  "ellen",
  "elliot",
  "elliott",
  "ellis",
  "elm",
  "else",
  "elsevier",
  "elsewhere",
  "elton",
  "elvis",
  "em",
  "emacs",
  "email",
  "emailed",
  "emails",
  "embarrassing",
  "embassy",
  "embedded",
  "embl",
  "emblem",
  "embodiment",
  "embrace",
  "embraced",
  "embroidered",
  "embroidery",
  "embryo",
  "embryonic",
  "embryos",
  "emc",
  "emerald",
  "emerge",
  "emerged",
  "emergence",
  "emergencies",
  "emergency",
  "emerges",
  "emerging",
  "emeritus",
  "emerson",
  "emi",
  "emily",
  "eminem",
  "eminent",
  "emirates",
  "emission",
  "emissions",
  "emma",
  "emmanuel",
  "emo",
  "emory",
  "emoticons",
  "emotion",
  "emotional",
  "emotionally",
  "emotions",
  "emp",
  "emperor",
  "emphasis",
  "emphasize",
  "emphasized",
  "emphasizes",
  "empire",
  "empires",
  "empirical",
  "employ",
  "employability",
  "employed",
  "employee",
  "employees",
  "employer",
  "employers",
  "employing",
  "employment",
  "employs",
  "emporium",
  "empower",
  "empowered",
  "empowering",
  "empowerment",
  "empty",
  "ems",
  "emu",
  "emulation",
  "emulator",
  "emule",
  "en",
  "enable",
  "enabled",
  "enables",
  "enabling",
  "enacted",
  "enactment",
  "enamel",
  "enb",
  "encarta",
  "enchanted",
  "enclosed",
  "enclosure",
  "enclosures",
  "encode",
  "encoded",
  "encoder",
  "encoding",
  "encompasses",
  "encore",
  "encounter",
  "encountered",
  "encounters",
  "encourage",
  "encouraged",
  "encouragement",
  "encourages",
  "encouraging",
  "encrypted",
  "encryption",
  "encyclopedia",
  "end",
  "endangered",
  "endeavor",
  "endeavour",
  "ended",
  "endif",
  "ending",
  "endless",
  "endocrine",
  "endorse",
  "endorsed",
  "endorsement",
  "endowment",
  "endpoint",
  "ends",
  "endurance",
  "endure",
  "enduring",
  "enemies",
  "enemy",
  "energetic",
  "energies",
  "energy",
  "enfield",
  "enforce",
  "enforced",
  "enforcement",
  "enforcing",
  "eng",
  "engadget",
  "engage",
  "engaged",
  "engagement",
  "engagements",
  "engaging",
  "engine",
  "engineer",
  "engineered",
  "engineering",
  "engineers",
  "engines",
  "engl",
  "england",
  "englewood",
  "english",
  "engraved",
  "engraving",
  "enhance",
  "enhanced",
  "enhancement",
  "enhancements",
  "enhances",
  "enhancing",
  "enjoy",
  "enjoyable",
  "enjoyed",
  "enjoying",
  "enjoyment",
  "enjoys",
  "enlarge",
  "enlarged",
  "enlargement",
  "enlightenment",
  "enlisted",
  "enom",
  "enormous",
  "enough",
  "enquire",
  "enquiries",
  "enquiry",
  "enriched",
  "enrichment",
  "enroll",
  "enrolled",
  "enrollment",
  "enrolment",
  "enron",
  "ensemble",
  "ensure",
  "ensures",
  "ensuring",
  "ent",
  "enter",
  "entered",
  "entering",
  "enterprise",
  "enterprises",
  "enters",
  "entertain",
  "entertaining",
  "entertainment",
  "enthusiasm",
  "enthusiast",
  "enthusiastic",
  "enthusiasts",
  "entire",
  "entirely",
  "entirety",
  "entities",
  "entitled",
  "entitlement",
  "entity",
  "entrance",
  "entre",
  "entrepreneur",
  "entrepreneurial",
  "entrepreneurs",
  "entrepreneurship",
  "entries",
  "entropy",
  "entry",
  "enum",
  "enumeration",
  "env",
  "envelope",
  "envelopes",
  "environ",
  "environment",
  "environmental",
  "environmentally",
  "environments",
  "envy",
  "enya",
  "enzyme",
  "enzymes",
  "eo",
  "eos",
  "ep",
  "epa",
  "epic",
  "epidemic",
  "epidemiology",
  "epilepsy",
  "epinions",
  "episcopal",
  "episode",
  "episodes",
  "epoch",
  "epoxy",
  "eps",
  "epsilon",
  "epson",
  "epstein",
  "eq",
  "equal",
  "equality",
  "equally",
  "equals",
  "equation",
  "equations",
  "equatorial",
  "equestrian",
  "equilibrium",
  "equine",
  "equip",
  "equipment",
  "equipped",
  "equitable",
  "equities",
  "equity",
  "equivalence",
  "equivalent",
  "equivalents",
  "er",
  "era",
  "erase",
  "erect",
  "erected",
  "erectile",
  "erection",
  "ergonomic",
  "eric",
  "erica",
  "erickson",
  "ericsson",
  "erie",
  "erik",
  "erin",
  "eritrea",
  "ernest",
  "ernie",
  "ernst",
  "erosion",
  "erotic",
  "erotica",
  "erotik",
  "erp",
  "err",
  "erroneous",
  "error",
  "errors",
  "ers",
  "es",
  "esa",
  "esc",
  "escape",
  "escaped",
  "escapes",
  "escherichia",
  "escort",
  "escorts",
  "escrow",
  "esd",
  "esl",
  "esp",
  "espanol",
  "especially",
  "espn",
  "espresso",
  "esq",
  "ess",
  "essay",
  "essays",
  "essence",
  "essential",
  "essentially",
  "essentials",
  "essex",
  "est",
  "esta",
  "establish",
  "established",
  "establishes",
  "establishing",
  "establishment",
  "establishments",
  "estate",
  "estates",
  "este",
  "esteem",
  "esther",
  "estimate",
  "estimated",
  "estimates",
  "estimating",
  "estimation",
  "estonia",
  "estonian",
  "estrogen",
  "et",
  "eta",
  "etc",
  "eternal",
  "eternity",
  "ethan",
  "ethanol",
  "ether",
  "ethereal",
  "ethernet",
  "ethical",
  "ethics",
  "ethiopia",
  "ethiopian",
  "ethnic",
  "ethnicity",
  "etiology",
  "etiquette",
  "eu",
  "eugene",
  "eur",
  "eureka",
  "euro",
  "europa",
  "europe",
  "european",
  "europeans",
  "euros",
  "ev",
  "eva",
  "evacuation",
  "eval",
  "evaluate",
  "evaluated",
  "evaluates",
  "evaluating",
  "evaluation",
  "evaluations",
  "evan",
  "evanescence",
  "evangelical",
  "evans",
  "evansville",
  "eve",
  "evelyn",
  "even",
  "evening",
  "evenings",
  "evenly",
  "event",
  "events",
  "eventual",
  "eventually",
  "ever",
  "everest",
  "everett",
  "evergreen",
  "everlasting",
  "everquest",
  "every",
  "everybody",
  "everyday",
  "everyone",
  "everything",
  "everytime",
  "everywhere",
  "evidence",
  "evidenced",
  "evident",
  "evidently",
  "evil",
  "evite",
  "evo",
  "evolution",
  "evolutionary",
  "evolve",
  "evolved",
  "evolving",
  "ew",
  "ex",
  "exact",
  "exactly",
  "exam",
  "examination",
  "examinations",
  "examine",
  "examined",
  "examiner",
  "examiners",
  "examines",
  "examining",
  "example",
  "examples",
  "exams",
  "exc",
  "excalibur",
  "excavation",
  "exceed",
  "exceeded",
  "exceeding",
  "exceeds",
  "excel",
  "excellence",
  "excellent",
  "except",
  "exception",
  "exceptional",
  "exceptionally",
  "exceptions",
  "excerpt",
  "excerpts",
  "excess",
  "excessive",
  "exchange",
  "exchanged",
  "exchanges",
  "excise",
  "excite",
  "excited",
  "excitement",
  "exciting",
  "excl",
  "exclude",
  "excluded",
  "excludes",
  "excluding",
  "exclusion",
  "exclusive",
  "exclusively",
  "excursion",
  "excursions",
  "excuse",
  "excuses",
  "exe",
  "exec",
  "executable",
  "execute",
  "executed",
  "executing",
  "execution",
  "executive",
  "executives",
  "exemplary",
  "exempt",
  "exemption",
  "exemptions",
  "exercise",
  "exercised",
  "exercises",
  "exercising",
  "exeter",
  "exhaust",
  "exhausted",
  "exhaustive",
  "exhibit",
  "exhibited",
  "exhibition",
  "exhibitions",
  "exhibitor",
  "exhibitors",
  "exhibits",
  "exif",
  "exile",
  "exim",
  "exist",
  "existed",
  "existence",
  "existing",
  "exists",
  "exit",
  "exits",
  "exodus",
  "exotic",
  "exp",
  "expand",
  "expandable",
  "expanded",
  "expanding",
  "expands",
  "expansion",
  "expansys",
  "expasy",
  "expat",
  "expect",
  "expectancy",
  "expectation",
  "expectations",
  "expected",
  "expecting",
  "expects",
  "expedia",
  "expedited",
  "expedition",
  "expeditions",
  "expenditure",
  "expenditures",
  "expense",
  "expenses",
  "expensive",
  "experience",
  "experienced",
  "experiences",
  "experiencing",
  "experiment",
  "experimental",
  "experimentation",
  "experiments",
  "expert",
  "expertise",
  "experts",
  "expiration",
  "expire",
  "expired",
  "expires",
  "expiry",
  "explain",
  "explained",
  "explaining",
  "explains",
  "explanation",
  "explanations",
  "explanatory",
  "explicit",
  "explicitly",
  "explode",
  "exploded",
  "exploit",
  "exploitation",
  "exploited",
  "exploits",
  "exploration",
  "explore",
  "explored",
  "explorer",
  "explorers",
  "explores",
  "exploring",
  "explosion",
  "explosive",
  "explosives",
  "expo",
  "exponential",
  "export",
  "exported",
  "exporter",
  "exporters",
  "exporting",
  "exports",
  "expose",
  "exposed",
  "exposing",
  "exposition",
  "exposure",
  "exposures",
  "express",
  "expressed",
  "expresses",
  "expressing",
  "expression",
  "expressions",
  "expressive",
  "expressly",
  "exquisite",
  "ext",
  "extend",
  "extended",
  "extending",
  "extends",
  "extension",
  "extensions",
  "extensive",
  "extensively",
  "extent",
  "exterior",
  "extern",
  "external",
  "externally",
  "extinction",
  "extra",
  "extract",
  "extracted",
  "extracting",
  "extraction",
  "extractor",
  "extracts",
  "extraordinary",
  "extras",
  "extreme",
  "extremely",
  "extremes",
  "eye",
  "eyed",
  "eyes",
  "eyewear",
  "ez",
  "ezekiel",
  "ezine",
  "ezra",
  "f",
  "fa",
  "faa",
  "fab",
  "fable",
  "fabric",
  "fabricated",
  "fabrication",
  "fabrics",
  "fabulous",
  "fac",
  "face",
  "faced",
  "faces",
  "facesitting",
  "facial",
  "facials",
  "facilitate",
  "facilitated",
  "facilitates",
  "facilitating",
  "facilitation",
  "facilitator",
  "facilities",
  "facility",
  "facing",
  "facsimile",
  "fact",
  "faction",
  "factor",
  "factories",
  "factoring",
  "factors",
  "factory",
  "facts",
  "factual",
  "faculties",
  "faculty",
  "fade",
  "faded",
  "fading",
  "fahrenheit",
  "fail",
  "failed",
  "failing",
  "fails",
  "failure",
  "failures",
  "faint",
  "fainter",
  "fair",
  "fairbanks",
  "faire",
  "fairfax",
  "fairfield",
  "fairies",
  "fairly",
  "fairmont",
  "fairness",
  "fairs",
  "fairview",
  "fairy",
  "faith",
  "faithful",
  "fake",
  "fakes",
  "falcon",
  "falcons",
  "falkland",
  "fall",
  "fallen",
  "falling",
  "falls",
  "false",
  "fam",
  "fame",
  "familiar",
  "familiarity",
  "families",
  "family",
  "famous",
  "fan",
  "fancy",
  "fans",
  "fantasies",
  "fantastic",
  "fantasy",
  "fao",
  "faq",
  "faqfaq",
  "faqs",
  "far",
  "fare",
  "fares",
  "farewell",
  "fargo",
  "farm",
  "farmer",
  "farmers",
  "farmhouse",
  "farming",
  "farmington",
  "farms",
  "faroe",
  "farrell",
  "farther",
  "fas",
  "fascinating",
  "fashion",
  "fashionable",
  "fashioned",
  "fashions",
  "faso",
  "fast",
  "fasteners",
  "faster",
  "fastest",
  "fat",
  "fatal",
  "fate",
  "father",
  "fathers",
  "fatigue",
  "fats",
  "fatty",
  "faucet",
  "faucets",
  "fault",
  "faults",
  "faulty",
  "fauna",
  "faux",
  "fav",
  "fave",
  "favor",
  "favorable",
  "favored",
  "favorite",
  "favorites",
  "favors",
  "favour",
  "favourable",
  "favourite",
  "favourites",
  "fax",
  "faxes",
  "fayette",
  "fayetteville",
  "fb",
  "fbi",
  "fc",
  "fcc",
  "fd",
  "fda",
  "fe",
  "fear",
  "feared",
  "fears",
  "feasibility",
  "feasible",
  "feast",
  "feat",
  "feather",
  "feathers",
  "feature",
  "featured",
  "features",
  "featuring",
  "feb",
  "february",
  "fed",
  "federal",
  "federally",
  "federated",
  "federation",
  "fedex",
  "fedora",
  "fee",
  "feed",
  "feedback",
  "feeder",
  "feeders",
  "feeding",
  "feeds",
  "feel",
  "feeling",
  "feelings",
  "feels",
  "fees",
  "feet",
  "felix",
  "fell",
  "fellow",
  "fellows",
  "fellowship",
  "fellowships",
  "felony",
  "felt",
  "fema",
  "female",
  "females",
  "femdom",
  "feminine",
  "feminism",
  "feminist",
  "femme",
  "fence",
  "fences",
  "fencing",
  "fender",
  "feng",
  "feof",
  "ferdinand",
  "ferguson",
  "fern",
  "fernandez",
  "fernando",
  "ferrari",
  "ferries",
  "ferris",
  "ferry",
  "fertile",
  "fertility",
  "fertilizer",
  "fest",
  "festival",
  "festivals",
  "festive",
  "fetal",
  "fetch",
  "fetisch",
  "fetish",
  "fetus",
  "fever",
  "few",
  "fewer",
  "ff",
  "ffi",
  "ffl",
  "fg",
  "fgets",
  "fh",
  "fha",
  "fi",
  "fiat",
  "fiber",
  "fiberglass",
  "fibers",
  "fibre",
  "fiction",
  "fictional",
  "fiddle",
  "fidelity",
  "field",
  "fielding",
  "fields",
  "fierce",
  "fiery",
  "fiesta",
  "fifa",
  "fife",
  "fifteen",
  "fifth",
  "fifty",
  "fig",
  "fight",
  "fighter",
  "fighters",
  "fighting",
  "fights",
  "figs",
  "figure",
  "figured",
  "figures",
  "figurine",
  "figurines",
  "fiji",
  "file",
  "filed",
  "filemaker",
  "filename",
  "fileplanet",
  "files",
  "filesize",
  "filesystem",
  "filing",
  "filings",
  "filipino",
  "fill",
  "filled",
  "filler",
  "filling",
  "fills",
  "film",
  "filme",
  "filmed",
  "filming",
  "filmmakers",
  "filmography",
  "films",
  "filter",
  "filtered",
  "filtering",
  "filters",
  "filth",
  "filthy",
  "filtration",
  "fin",
  "final",
  "finale",
  "finally",
  "finals",
  "finance",
  "financed",
  "finances",
  "financial",
  "financially",
  "financials",
  "financing",
  "finch",
  "find",
  "findarticles",
  "finder",
  "finding",
  "findings",
  "findlaw",
  "finds",
  "fine",
  "fined",
  "finely",
  "finepix",
  "fines",
  "finest",
  "finger",
  "fingering",
  "fingerprint",
  "fingers",
  "fingertips",
  "finish",
  "finished",
  "finishes",
  "finishing",
  "finite",
  "finland",
  "finn",
  "finnish",
  "fins",
  "fiona",
  "fioricet",
  "fir",
  "fire",
  "firearm",
  "firearms",
  "fired",
  "firefighter",
  "firefighters",
  "firefly",
  "firefox",
  "fireplace",
  "fireplaces",
  "fires",
  "firewall",
  "firewalls",
  "firewire",
  "fireworks",
  "firing",
  "firm",
  "firmly",
  "firms",
  "firmware",
  "first",
  "firstgov",
  "firstly",
  "fiscal",
  "fischer",
  "fish",
  "fisher",
  "fisheries",
  "fisherman",
  "fishermen",
  "fishery",
  "fishes",
  "fishing",
  "fist",
  "fisting",
  "fit",
  "fitness",
  "fits",
  "fitted",
  "fitting",
  "fittings",
  "fitzgerald",
  "five",
  "fix",
  "fixed",
  "fixes",
  "fixing",
  "fixture",
  "fixtures",
  "fj",
  "fl",
  "fla",
  "flag",
  "flags",
  "flagship",
  "flagstaff",
  "flair",
  "flame",
  "flames",
  "flaming",
  "flamingo",
  "flap",
  "flare",
  "flash",
  "flashers",
  "flashes",
  "flashing",
  "flashlight",
  "flat",
  "flatbed",
  "flats",
  "flavor",
  "flavored",
  "flavors",
  "flavour",
  "flaw",
  "flawed",
  "flaws",
  "flea",
  "fled",
  "flee",
  "fleece",
  "fleet",
  "fleming",
  "flesh",
  "fletcher",
  "flew",
  "flex",
  "flexibility",
  "flexible",
  "flick",
  "flickr",
  "flies",
  "flight",
  "flights",
  "flint",
  "flip",
  "flirt",
  "float",
  "floating",
  "flock",
  "flood",
  "flooded",
  "flooding",
  "floods",
  "floor",
  "flooring",
  "floors",
  "flop",
  "floppy",
  "flora",
  "floral",
  "florence",
  "flores",
  "florida",
  "florist",
  "florists",
  "flour",
  "flow",
  "flower",
  "flowering",
  "flowers",
  "flowing",
  "flown",
  "flows",
  "floyd",
  "flu",
  "fluctuations",
  "fluffy",
  "fluid",
  "fluids",
  "fluorescence",
  "fluorescent",
  "flush",
  "flushing",
  "flute",
  "flux",
  "fly",
  "flyer",
  "flyers",
  "flying",
  "flynn",
  "fm",
  "fn",
  "fno",
  "fo",
  "foam",
  "fob",
  "focal",
  "focus",
  "focused",
  "focuses",
  "focusing",
  "fog",
  "foia",
  "foil",
  "fold",
  "folded",
  "folder",
  "folders",
  "folding",
  "folds",
  "foley",
  "foliage",
  "folio",
  "folk",
  "folklore",
  "folks",
  "follow",
  "followed",
  "followers",
  "following",
  "follows",
  "followup",
  "fomit",
  "fond",
  "font",
  "fonts",
  "foo",
  "food",
  "foods",
  "fool",
  "foolish",
  "fools",
  "foot",
  "footage",
  "football",
  "footer",
  "footjob",
  "footnote",
  "footnotes",
  "footprint",
  "footwear",
  "for",
  "forbes",
  "forbidden",
  "force",
  "forced",
  "forces",
  "forcing",
  "ford",
  "fore",
  "foreach",
  "forecast",
  "forecasting",
  "forecasts",
  "foreclosure",
  "foreclosures",
  "forefront",
  "foregoing",
  "forehead",
  "foreign",
  "foreigners",
  "foreman",
  "foremost",
  "forensic",
  "forest",
  "forestry",
  "forests",
  "forever",
  "foreword",
  "forex",
  "forge",
  "forged",
  "forget",
  "forgive",
  "forgiveness",
  "forgot",
  "forgotten",
  "fork",
  "forks",
  "form",
  "forma",
  "formal",
  "formally",
  "format",
  "formation",
  "formations",
  "formats",
  "formatted",
  "formatting",
  "formed",
  "former",
  "formerly",
  "forming",
  "forms",
  "formula",
  "formulas",
  "formulate",
  "formulated",
  "formulation",
  "forrest",
  "forrester",
  "fort",
  "forte",
  "forth",
  "forthcoming",
  "fortran",
  "fortress",
  "fortunate",
  "fortunately",
  "fortune",
  "forty",
  "forum",
  "forums",
  "forward",
  "forwarded",
  "forwarding",
  "forwards",
  "fossil",
  "fossils",
  "foster",
  "fostering",
  "foto",
  "fotos",
  "fought",
  "foul",
  "found",
  "foundation",
  "foundations",
  "founded",
  "founder",
  "founders",
  "founding",
  "foundry",
  "fountain",
  "fountains",
  "four",
  "fourier",
  "fourteen",
  "fourth",
  "fowler",
  "fox",
  "fp",
  "fpo",
  "fprintf",
  "fps",
  "fr",
  "fra",
  "fraction",
  "fractional",
  "fractions",
  "fracture",
  "fractures",
  "fragile",
  "fragment",
  "fragmentation",
  "fragments",
  "fragrance",
  "fragrances",
  "frame",
  "framed",
  "frames",
  "framework",
  "frameworks",
  "framing",
  "fran",
  "franc",
  "francais",
  "francaise",
  "france",
  "frances",
  "francesco",
  "franchise",
  "franchises",
  "franchising",
  "francis",
  "francisco",
  "franco",
  "francois",
  "francs",
  "frankfurt",
  "frankie",
  "franklin",
  "frankly",
  "franz",
  "fraser",
  "fraternity",
  "frau",
  "fraud",
  "fraudulent",
  "frauen",
  "fre",
  "fread",
  "freak",
  "freaks",
  "fred",
  "freddie",
  "frederic",
  "frederick",
  "free",
  "freebies",
  "freebsd",
  "freed",
  "freedom",
  "freedoms",
  "freelance",
  "freelists",
  "freely",
  "freeman",
  "freeport",
  "freestyle",
  "freeware",
  "freeway",
  "freeze",
  "freezer",
  "freezers",
  "freezing",
  "freight",
  "fremont",
  "french",
  "frenzy",
  "freq",
  "frequencies",
  "frequency",
  "frequent",
  "frequently",
  "fresh",
  "freshly",
  "freshman",
  "freshmen",
  "freshwater",
  "fresno",
  "frey",
  "fri",
  "friction",
  "friday",
  "fridays",
  "fridge",
  "fried",
  "friedman",
  "friedrich",
  "friend",
  "friendly",
  "friends",
  "friendship",
  "fries",
  "fringe",
  "fritz",
  "frog",
  "frogs",
  "from",
  "front",
  "frontal",
  "frontgate",
  "frontier",
  "frontiers",
  "frontline",
  "frontpage",
  "fronts",
  "frost",
  "frozen",
  "fruit",
  "fruits",
  "frustrated",
  "frustrating",
  "frustration",
  "fry",
  "fs",
  "fsa",
  "fsb",
  "ft",
  "fta",
  "ftc",
  "ftd",
  "fte",
  "ftp",
  "fu",
  "fuck",
  "fucked",
  "fuckers",
  "fuckin",
  "fucking",
  "fucks",
  "fudge",
  "fuel",
  "fuels",
  "fuji",
  "fujifilm",
  "fujitsu",
  "fulfil",
  "fulfill",
  "fulfilled",
  "fulfilling",
  "fulfillment",
  "full",
  "fuller",
  "fullerton",
  "fully",
  "fulton",
  "fun",
  "func",
  "function",
  "functional",
  "functionality",
  "functioning",
  "functions",
  "fund",
  "fundamental",
  "fundamentally",
  "fundamentals",
  "funded",
  "funding",
  "fundraiser",
  "fundraising",
  "funds",
  "funeral",
  "fungal",
  "fungi",
  "funk",
  "funky",
  "funny",
  "fur",
  "furious",
  "furnace",
  "furnish",
  "furnished",
  "furnishing",
  "furnishings",
  "furniture",
  "furry",
  "further",
  "furthermore",
  "fury",
  "fuse",
  "fusion",
  "futuna",
  "future",
  "futures",
  "fuzzy",
  "fw",
  "fwd",
  "fx",
  "fy",
  "fyi",
  "g",
  "ga",
  "gabon",
  "gabriel",
  "gadget",
  "gadgets",
  "gaelic",
  "gag",
  "gage",
  "gagged",
  "gail",
  "gain",
  "gained",
  "gainesville",
  "gaining",
  "gains",
  "gal",
  "gala",
  "galactic",
  "galaxies",
  "galaxy",
  "gale",
  "galerie",
  "galileo",
  "gallagher",
  "galleries",
  "gallery",
  "gallon",
  "gallons",
  "galloway",
  "galore",
  "gals",
  "galveston",
  "galway",
  "gam",
  "gambia",
  "gamble",
  "gambling",
  "game",
  "gameboy",
  "gamecube",
  "gamefaqs",
  "gameplay",
  "gamer",
  "gamers",
  "games",
  "gamespot",
  "gamespy",
  "gaming",
  "gamma",
  "gan",
  "gandhi",
  "gang",
  "gangbang",
  "gangs",
  "gannett",
  "gao",
  "gap",
  "gaps",
  "garage",
  "garages",
  "garbage",
  "garcia",
  "garde",
  "garden",
  "gardener",
  "gardening",
  "gardens",
  "gardner",
  "garfield",
  "garland",
  "garlic",
  "garment",
  "garments",
  "garmin",
  "garner",
  "garnet",
  "garrett",
  "garrison",
  "garth",
  "gartner",
  "gary",
  "gas",
  "gases",
  "gasket",
  "gasoline",
  "gastric",
  "gastrointestinal",
  "gate",
  "gates",
  "gateway",
  "gateways",
  "gather",
  "gathered",
  "gathering",
  "gatherings",
  "gatwick",
  "gauge",
  "gauges",
  "gaussian",
  "gauteng",
  "gave",
  "gavin",
  "gay",
  "gays",
  "gaza",
  "gaze",
  "gazette",
  "gb",
  "gba",
  "gbp",
  "gc",
  "gcc",
  "gcse",
  "gd",
  "gdb",
  "gdp",
  "ge",
  "gear",
  "geared",
  "gears",
  "ged",
  "gee",
  "geek",
  "geeks",
  "geforce",
  "geile",
  "geisha",
  "gel",
  "gem",
  "gemini",
  "gems",
  "gemstone",
  "gemstones",
  "gen",
  "genbank",
  "gender",
  "gene",
  "genealogical",
  "genealogy",
  "general",
  "generalized",
  "generally",
  "generals",
  "generate",
  "generated",
  "generates",
  "generating",
  "generation",
  "generations",
  "generator",
  "generators",
  "generic",
  "generosity",
  "generous",
  "genes",
  "genesis",
  "genetic",
  "genetically",
  "genetics",
  "geneva",
  "genie",
  "genital",
  "genius",
  "genocide",
  "genome",
  "genomic",
  "genomics",
  "genre",
  "genres",
  "gentle",
  "gentleman",
  "gentlemen",
  "gently",
  "gentoo",
  "genuine",
  "genuinely",
  "genus",
  "geo",
  "geoff",
  "geoffrey",
  "geographic",
  "geographical",
  "geographically",
  "geography",
  "geological",
  "geology",
  "geometric",
  "geometry",
  "geophysical",
  "geophysics",
  "georg",
  "george",
  "georges",
  "georgetown",
  "georgia",
  "georgian",
  "ger",
  "gerald",
  "gerard",
  "german",
  "germans",
  "germany",
  "gerry",
  "gesture",
  "get",
  "getaway",
  "getaways",
  "gets",
  "getting",
  "getty",
  "gev",
  "gf",
  "gg",
  "gh",
  "ghana",
  "ghetto",
  "ghost",
  "ghosts",
  "ghz",
  "gi",
  "gia",
  "giant",
  "giants",
  "gibbs",
  "gibraltar",
  "gibson",
  "giclee",
  "gif",
  "gifs",
  "gift",
  "gifted",
  "gifts",
  "gig",
  "gigabit",
  "gigabyte",
  "gigantic",
  "gigs",
  "gil",
  "gilbert",
  "giles",
  "gill",
  "gilmore",
  "gimp",
  "gin",
  "gina",
  "ginger",
  "giorgio",
  "giovanni",
  "girl",
  "girlfriend",
  "girls",
  "gis",
  "give",
  "given",
  "gives",
  "giving",
  "gj",
  "gk",
  "gl",
  "glacier",
  "glad",
  "gladly",
  "glamour",
  "glance",
  "gland",
  "glasgow",
  "glass",
  "glasses",
  "glassware",
  "glazed",
  "glazing",
  "glen",
  "glendale",
  "glenn",
  "glibc",
  "glide",
  "glimpse",
  "glitter",
  "gln",
  "global",
  "globalisation",
  "globalization",
  "globally",
  "globe",
  "globes",
  "gloria",
  "glorious",
  "glory",
  "gloryhole",
  "gloss",
  "glossaries",
  "glossary",
  "glossy",
  "gloucester",
  "gloucestershire",
  "glove",
  "gloves",
  "glow",
  "glowing",
  "glu",
  "glucose",
  "glue",
  "gly",
  "gm",
  "gmail",
  "gmbh",
  "gmc",
  "gmt",
  "gn",
  "gnd",
  "gnome",
  "gnu",
  "go",
  "goa",
  "goal",
  "goals",
  "goat",
  "goats",
  "goblet",
  "god",
  "goddess",
  "godfather",
  "gods",
  "godsmack",
  "goes",
  "goggles",
  "goin",
  "going",
  "gold",
  "goldberg",
  "golden",
  "goldman",
  "goldstein",
  "golf",
  "golfers",
  "golfing",
  "gomez",
  "gone",
  "gong",
  "gonna",
  "gonzales",
  "gonzalez",
  "goo",
  "good",
  "goodbye",
  "goodies",
  "goodman",
  "goodness",
  "goods",
  "goodwill",
  "goodwin",
  "google",
  "goose",
  "gop",
  "gordon",
  "gore",
  "gorge",
  "gorgeous",
  "gorilla",
  "gorillaz",
  "gospel",
  "gossip",
  "got",
  "goth",
  "gothic",
  "goto",
  "gotta",
  "gotten",
  "gould",
  "gourmet",
  "gov",
  "govern",
  "governance",
  "governed",
  "governing",
  "government",
  "governmental",
  "governments",
  "governor",
  "governors",
  "govt",
  "gown",
  "gowns",
  "gp",
  "gpa",
  "gpl",
  "gpo",
  "gprs",
  "gps",
  "gr",
  "grab",
  "grabbed",
  "grabs",
  "grace",
  "graceful",
  "grad",
  "grade",
  "graded",
  "graders",
  "grades",
  "gradient",
  "grading",
  "gradual",
  "gradually",
  "graduate",
  "graduated",
  "graduates",
  "graduating",
  "graduation",
  "graffiti",
  "grafton",
  "graham",
  "grain",
  "grains",
  "gram",
  "grammar",
  "grams",
  "gran",
  "granada",
  "grand",
  "grandchildren",
  "grande",
  "grandfather",
  "grandma",
  "grandmother",
  "grandparents",
  "grange",
  "granite",
  "granny",
  "grant",
  "granted",
  "granting",
  "grants",
  "grape",
  "grapes",
  "graph",
  "graphic",
  "graphical",
  "graphics",
  "graphite",
  "graphs",
  "gras",
  "grasp",
  "grass",
  "grassroots",
  "grateful",
  "gratis",
  "gratitude",
  "gratuit",
  "gratuite",
  "grave",
  "gravel",
  "graves",
  "gravity",
  "gray",
  "grazing",
  "gre",
  "grease",
  "great",
  "greater",
  "greatest",
  "greatly",
  "greece",
  "greed",
  "greedy",
  "greek",
  "greeks",
  "green",
  "greenberg",
  "greene",
  "greenfield",
  "greenhouse",
  "greenland",
  "greens",
  "greensboro",
  "greenville",
  "greenwich",
  "greenwood",
  "greet",
  "greeted",
  "greeting",
  "greetings",
  "greg",
  "gregg",
  "gregory",
  "grenada",
  "grenadines",
  "grep",
  "grew",
  "grey",
  "greyhound",
  "grid",
  "grief",
  "grievance",
  "griffin",
  "griffith",
  "grill",
  "grille",
  "grilled",
  "grills",
  "grim",
  "grin",
  "grind",
  "grinder",
  "grinding",
  "grip",
  "grips",
  "grizzly",
  "groceries",
  "grocery",
  "groom",
  "grooming",
  "groove",
  "groovy",
  "gross",
  "ground",
  "grounded",
  "grounds",
  "groundwater",
  "group",
  "grouped",
  "grouping",
  "groups",
  "grove",
  "grow",
  "grower",
  "growers",
  "growing",
  "grown",
  "grows",
  "growth",
  "gs",
  "gsa",
  "gsm",
  "gst",
  "gt",
  "gta",
  "gtk",
  "gu",
  "guadeloupe",
  "guam",
  "guarantee",
  "guaranteed",
  "guarantees",
  "guard",
  "guardian",
  "guardians",
  "guards",
  "guatemala",
  "gucci",
  "guernsey",
  "guess",
  "guessing",
  "guest",
  "guestbook",
  "guests",
  "gui",
  "guiana",
  "guidance",
  "guide",
  "guidebook",
  "guided",
  "guideline",
  "guidelines",
  "guides",
  "guiding",
  "guild",
  "guilt",
  "guilty",
  "guinea",
  "guinness",
  "guitar",
  "guitarist",
  "guitars",
  "gulf",
  "gull",
  "gum",
  "gun",
  "gundam",
  "guns",
  "gupta",
  "guru",
  "gus",
  "gut",
  "gutenberg",
  "guts",
  "guy",
  "guyana",
  "guys",
  "gv",
  "gw",
  "gwen",
  "gx",
  "gym",
  "gymnastics",
  "gyms",
  "gypsy",
  "gz",
  "gzip",
  "h",
  "ha",
  "haas",
  "habit",
  "habitat",
  "habitats",
  "habits",
  "hack",
  "hacked",
  "hacker",
  "hackers",
  "hacking",
  "hacks",
  "had",
  "hague",
  "haha",
  "hahn",
  "hai",
  "hail",
  "hair",
  "haired",
  "hairy",
  "haiti",
  "haitian",
  "hal",
  "hale",
  "half",
  "halfway",
  "halifax",
  "hall",
  "hallmark",
  "halloween",
  "halls",
  "halo",
  "halogen",
  "halt",
  "ham",
  "hama",
  "hamas",
  "hamburg",
  "hamilton",
  "hamlet",
  "hammer",
  "hammond",
  "hampshire",
  "hampton",
  "han",
  "hancock",
  "hand",
  "handbag",
  "handbags",
  "handbook",
  "handcrafted",
  "handed",
  "handel",
  "handful",
  "handheld",
  "handhelds",
  "handicap",
  "handicapped",
  "handjob",
  "handjobs",
  "handle",
  "handled",
  "handler",
  "handlers",
  "handles",
  "handling",
  "handmade",
  "handouts",
  "hands",
  "handset",
  "handsets",
  "handsfree",
  "handsome",
  "handwriting",
  "handy",
  "hang",
  "hanger",
  "hanging",
  "hangs",
  "hank",
  "hanna",
  "hannah",
  "hannover",
  "hanoi",
  "hanover",
  "hans",
  "hansard",
  "hansen",
  "hanson",
  "happen",
  "happened",
  "happening",
  "happenings",
  "happens",
  "happier",
  "happily",
  "happiness",
  "happy",
  "har",
  "harassment",
  "harbor",
  "harbour",
  "hard",
  "hardback",
  "hardcore",
  "hardcover",
  "harder",
  "hardest",
  "harding",
  "hardly",
  "hardship",
  "hardware",
  "hardwood",
  "hardy",
  "hare",
  "harlem",
  "harley",
  "harm",
  "harman",
  "harmful",
  "harmless",
  "harmonic",
  "harmony",
  "harness",
  "harold",
  "harp",
  "harper",
  "harriet",
  "harrington",
  "harris",
  "harrisburg",
  "harrison",
  "harsh",
  "hart",
  "hartford",
  "hartley",
  "harvard",
  "harvest",
  "harvested",
  "harvesting",
  "harvey",
  "has",
  "hasbro",
  "hash",
  "hassle",
  "hast",
  "hastings",
  "hat",
  "hatch",
  "hatchback",
  "hate",
  "hated",
  "hates",
  "hath",
  "hatred",
  "hats",
  "haul",
  "haunted",
  "haute",
  "havana",
  "have",
  "haven",
  "having",
  "havoc",
  "hawaii",
  "hawaiian",
  "hawk",
  "hawkins",
  "hawks",
  "hawthorne",
  "hay",
  "hayden",
  "hayes",
  "haynes",
  "hays",
  "hayward",
  "hazard",
  "hazardous",
  "hazards",
  "haze",
  "hazel",
  "hb",
  "hbo",
  "hc",
  "hcl",
  "hd",
  "hdd",
  "hdtv",
  "he",
  "head",
  "headache",
  "headaches",
  "headed",
  "header",
  "headers",
  "heading",
  "headings",
  "headlights",
  "headline",
  "headlines",
  "headphone",
  "headphones",
  "headquartered",
  "headquarters",
  "heads",
  "headset",
  "headsets",
  "heal",
  "healing",
  "health",
  "healthcare",
  "healthier",
  "healthy",
  "heap",
  "hear",
  "heard",
  "hearing",
  "hearings",
  "hears",
  "heart",
  "heartbeat",
  "hearted",
  "heartland",
  "hearts",
  "heat",
  "heated",
  "heater",
  "heaters",
  "heath",
  "heather",
  "heathrow",
  "heating",
  "heaven",
  "heavenly",
  "heavens",
  "heavier",
  "heavily",
  "heavy",
  "heavyweight",
  "hebrew",
  "hebrews",
  "heck",
  "hectares",
  "hector",
  "hedge",
  "hee",
  "heel",
  "heels",
  "heh",
  "hehe",
  "heidelberg",
  "heidi",
  "height",
  "heights",
  "heinz",
  "held",
  "helen",
  "helena",
  "helicopter",
  "helicopters",
  "helium",
  "helix",
  "hell",
  "hello",
  "helm",
  "helmet",
  "helmets",
  "help",
  "helpdesk",
  "helped",
  "helper",
  "helpers",
  "helpful",
  "helping",
  "helpless",
  "helpline",
  "helps",
  "helsinki",
  "hem",
  "hemisphere",
  "hemp",
  "hen",
  "hence",
  "henderson",
  "hendrix",
  "henri",
  "henry",
  "hentai",
  "hep",
  "hepatitis",
  "her",
  "herald",
  "herb",
  "herbal",
  "herbert",
  "herbs",
  "hercules",
  "herd",
  "here",
  "hereafter",
  "hereby",
  "hereford",
  "herein",
  "hereinafter",
  "heritage",
  "herman",
  "hernandez",
  "hero",
  "heroes",
  "heroic",
  "heroin",
  "herpes",
  "herring",
  "hers",
  "herself",
  "hershey",
  "hertfordshire",
  "hertz",
  "herzegovina",
  "hes",
  "hesitate",
  "hess",
  "het",
  "heterogeneous",
  "hewitt",
  "hewlett",
  "hex",
  "hey",
  "hf",
  "hg",
  "hgh",
  "hh",
  "hhs",
  "hi",
  "hickory",
  "hicks",
  "hid",
  "hidden",
  "hide",
  "hides",
  "hiding",
  "hier",
  "hierarchical",
  "hierarchy",
  "hifi",
  "higgins",
  "high",
  "highbeam",
  "higher",
  "highest",
  "highland",
  "highlands",
  "highlight",
  "highlighted",
  "highlighting",
  "highlights",
  "highly",
  "highs",
  "highway",
  "highways",
  "hike",
  "hiking",
  "hilarious",
  "hilary",
  "hilfiger",
  "hill",
  "hillary",
  "hills",
  "hillside",
  "hilton",
  "him",
  "himself",
  "hindi",
  "hindu",
  "hinge",
  "hinges",
  "hint",
  "hints",
  "hip",
  "hipaa",
  "hips",
  "hire",
  "hired",
  "hires",
  "hiring",
  "his",
  "hispanic",
  "hist",
  "historian",
  "historians",
  "historic",
  "historical",
  "historically",
  "histories",
  "history",
  "hit",
  "hitachi",
  "hitch",
  "hitchcock",
  "hitler",
  "hits",
  "hitting",
  "hiv",
  "hj",
  "hk",
  "hklm",
  "hl",
  "hm",
  "hmm",
  "hmmm",
  "hms",
  "hn",
  "ho",
  "hobart",
  "hobbies",
  "hobbs",
  "hobby",
  "hoc",
  "hockey",
  "hoffman",
  "hog",
  "hogan",
  "hogtied",
  "hold",
  "holdem",
  "holden",
  "holder",
  "holders",
  "holding",
  "holdings",
  "holds",
  "hole",
  "holes",
  "holiday",
  "holidays",
  "holistic",
  "holland",
  "hollow",
  "holloway",
  "holly",
  "hollywood",
  "holmes",
  "holocaust",
  "holster",
  "holt",
  "holy",
  "home",
  "homecoming",
  "homeland",
  "homeless",
  "homelessness",
  "homemade",
  "homeowner",
  "homeowners",
  "homepage",
  "homepages",
  "homer",
  "homes",
  "homestead",
  "hometown",
  "homework",
  "homicide",
  "homme",
  "homo",
  "homogeneous",
  "homosexual",
  "homosexuality",
  "hon",
  "honda",
  "honduras",
  "honest",
  "honestly",
  "honesty",
  "honey",
  "honeymoon",
  "hong",
  "honolulu",
  "honor",
  "honorable",
  "honorary",
  "honored",
  "honors",
  "honour",
  "honourable",
  "honours",
  "hood",
  "hooded",
  "hoodia",
  "hoodie",
  "hoods",
  "hook",
  "hooked",
  "hooker",
  "hooks",
  "hoop",
  "hoops",
  "hoover",
  "hop",
  "hope",
  "hoped",
  "hopeful",
  "hopefully",
  "hopes",
  "hoping",
  "hopkins",
  "hopper",
  "horde",
  "horizon",
  "horizons",
  "horizontal",
  "hormone",
  "hormones",
  "horn",
  "horns",
  "horny",
  "horoscope",
  "horoscopes",
  "horrible",
  "horror",
  "horse",
  "horseback",
  "horsepower",
  "horses",
  "horticulture",
  "horton",
  "hose",
  "hospice",
  "hospital",
  "hospitality",
  "hospitals",
  "host",
  "hostage",
  "hosted",
  "hostel",
  "hostels",
  "hostile",
  "hosting",
  "hostname",
  "hosts",
  "hot",
  "hotel",
  "hoteles",
  "hotels",
  "hotjobs",
  "hotline",
  "hotmail",
  "hotspot",
  "hotspots",
  "hottest",
  "hottie",
  "hotwire",
  "houghton",
  "hound",
  "hour",
  "hourly",
  "hours",
  "house",
  "housed",
  "household",
  "householder",
  "households",
  "housekeeping",
  "houses",
  "housewares",
  "housewife",
  "housewives",
  "housing",
  "houston",
  "how",
  "howard",
  "howe",
  "howell",
  "however",
  "howto",
  "hp",
  "hpa",
  "hq",
  "hr",
  "href",
  "hrs",
  "hs",
  "hsbc",
  "hsn",
  "ht",
  "htdocs",
  "htm",
  "html",
  "http",
  "httpd",
  "https",
  "hu",
  "hua",
  "huang",
  "hub",
  "hubbard",
  "hubs",
  "hud",
  "hudson",
  "hug",
  "huge",
  "hugh",
  "hughes",
  "hugo",
  "hugs",
  "huh",
  "hulk",
  "hull",
  "hum",
  "human",
  "humane",
  "humanitarian",
  "humanities",
  "humanity",
  "humans",
  "humble",
  "humboldt",
  "humidity",
  "humiliation",
  "hummer",
  "humor",
  "humorous",
  "humour",
  "humphrey",
  "hun",
  "hundred",
  "hundreds",
  "hung",
  "hungarian",
  "hungary",
  "hunger",
  "hungry",
  "hunk",
  "hunks",
  "huns",
  "hunt",
  "hunter",
  "hunters",
  "hunting",
  "huntington",
  "huntsville",
  "hurley",
  "huron",
  "hurricane",
  "hurricanes",
  "hurry",
  "hurt",
  "hurting",
  "hurts",
  "husband",
  "husbands",
  "hush",
  "huskies",
  "husky",
  "hussein",
  "hustle",
  "hustler",
  "hut",
  "hutchinson",
  "hv",
  "hvac",
  "hw",
  "hwy",
  "hx",
  "hy",
  "hyatt",
  "hybrid",
  "hyde",
  "hyderabad",
  "hydraulic",
  "hydro",
  "hydrocodone",
  "hydrogen",
  "hygiene",
  "hymn",
  "hype",
  "hyper",
  "hyperlink",
  "hypermail",
  "hypertension",
  "hypertext",
  "hypnosis",
  "hypotheses",
  "hypothesis",
  "hypothetical",
  "hyundai",
  "hz",
  "i",
  "ia",
  "ian",
  "ib",
  "ibid",
  "ibis",
  "ibiza",
  "ibm",
  "ibn",
  "ibook",
  "ic",
  "icann",
  "icc",
  "ice",
  "iceland",
  "icelandic",
  "ich",
  "icon",
  "icons",
  "icq",
  "ics",
  "ict",
  "id",
  "ida",
  "idaho",
  "idc",
  "ide",
  "idea",
  "ideal",
  "ideally",
  "ideals",
  "ideas",
  "identical",
  "identifiable",
  "identification",
  "identified",
  "identifier",
  "identifiers",
  "identifies",
  "identify",
  "identifying",
  "identities",
  "identity",
  "ideological",
  "ideology",
  "idg",
  "idiot",
  "idiots",
  "idle",
  "idol",
  "ids",
  "ie",
  "iec",
  "ieee",
  "ies",
  "ietf",
  "if",
  "ifdef",
  "ifs",
  "ig",
  "ign",
  "ignition",
  "ignorance",
  "ignorant",
  "ignore",
  "ignored",
  "ignoring",
  "igor",
  "ih",
  "ii",
  "iii",
  "iis",
  "ij",
  "ik",
  "il",
  "ile",
  "ill",
  "illegal",
  "illegally",
  "illicit",
  "illinois",
  "illness",
  "illnesses",
  "illuminated",
  "illumination",
  "illusion",
  "illusions",
  "illustrate",
  "illustrated",
  "illustrates",
  "illustration",
  "illustrations",
  "illustrator",
  "ilo",
  "ilug",
  "im",
  "imac",
  "image",
  "imagery",
  "images",
  "imaginary",
  "imagination",
  "imaginative",
  "imagine",
  "imagined",
  "imaging",
  "imap",
  "imc",
  "imdb",
  "imf",
  "img",
  "imitation",
  "immediate",
  "immediately",
  "immense",
  "immersion",
  "immigrant",
  "immigrants",
  "immigration",
  "imminent",
  "immortal",
  "immune",
  "immunity",
  "immunization",
  "immunology",
  "imo",
  "imp",
  "impact",
  "impacted",
  "impacts",
  "impaired",
  "impairment",
  "impartial",
  "impedance",
  "imperative",
  "imperial",
  "implant",
  "implants",
  "implement",
  "implementation",
  "implementations",
  "implemented",
  "implementing",
  "implements",
  "implication",
  "implications",
  "implicit",
  "implied",
  "implies",
  "imply",
  "import",
  "importance",
  "important",
  "importantly",
  "imported",
  "importer",
  "importers",
  "importing",
  "imports",
  "impose",
  "imposed",
  "imposing",
  "impossible",
  "impotence",
  "impress",
  "impressed",
  "impression",
  "impressions",
  "impressive",
  "impressum",
  "imprint",
  "imprisonment",
  "improper",
  "improve",
  "improved",
  "improvement",
  "improvements",
  "improves",
  "improving",
  "impulse",
  "ims",
  "in",
  "inability",
  "inaccuracies",
  "inaccurate",
  "inactive",
  "inadequate",
  "inappropriate",
  "inaugural",
  "inbound",
  "inbox",
  "inc",
  "incense",
  "incentive",
  "incentives",
  "inception",
  "incest",
  "inch",
  "inches",
  "incidence",
  "incident",
  "incidental",
  "incidents",
  "incl",
  "inclined",
  "include",
  "included",
  "includes",
  "including",
  "inclusion",
  "inclusive",
  "income",
  "incomes",
  "incoming",
  "incompatible",
  "incomplete",
  "inconsistent",
  "inconvenience",
  "incorporate",
  "incorporated",
  "incorporates",
  "incorporating",
  "incorporation",
  "incorrect",
  "incorrectly",
  "increase",
  "increased",
  "increases",
  "increasing",
  "increasingly",
  "incredible",
  "incredibly",
  "increment",
  "incremental",
  "increments",
  "incubus",
  "incumbent",
  "incur",
  "incurred",
  "ind",
  "indeed",
  "indemnity",
  "independence",
  "independent",
  "independently",
  "index",
  "indexed",
  "indexes",
  "indexing",
  "indi",
  "india",
  "indian",
  "indiana",
  "indianapolis",
  "indians",
  "indicate",
  "indicated",
  "indicates",
  "indicating",
  "indication",
  "indications",
  "indicative",
  "indicator",
  "indicators",
  "indices",
  "indictment",
  "indie",
  "indies",
  "indigenous",
  "indigo",
  "indirect",
  "indirectly",
  "indispensable",
  "individual",
  "individually",
  "individuals",
  "indo",
  "indonesia",
  "indonesian",
  "indoor",
  "indoors",
  "induce",
  "induced",
  "induction",
  "indulgence",
  "industrial",
  "industries",
  "industry",
  "indy",
  "indymedia",
  "ineffective",
  "inequalities",
  "inequality",
  "inevitable",
  "inevitably",
  "inexpensive",
  "inf",
  "infamous",
  "infant",
  "infantry",
  "infants",
  "infect",
  "infected",
  "infection",
  "infections",
  "infectious",
  "inference",
  "inferior",
  "infertility",
  "infinite",
  "infiniti",
  "infinity",
  "inflammation",
  "inflammatory",
  "inflatable",
  "inflation",
  "influence",
  "influenced",
  "influences",
  "influencing",
  "influential",
  "influenza",
  "info",
  "infocus",
  "inform",
  "informal",
  "informatics",
  "information",
  "informational",
  "informations",
  "informative",
  "informed",
  "informing",
  "informs",
  "infos",
  "infospace",
  "infousa",
  "infoworld",
  "infrared",
  "infrastructure",
  "infringement",
  "infusion",
  "ing",
  "ingram",
  "ingredient",
  "ingredients",
  "inhabitants",
  "inhalation",
  "inherent",
  "inherently",
  "inheritance",
  "inherited",
  "inhibit",
  "inhibition",
  "inhibitor",
  "inhibitors",
  "init",
  "initial",
  "initialization",
  "initialize",
  "initially",
  "initials",
  "initiate",
  "initiated",
  "initiating",
  "initiation",
  "initiative",
  "initiatives",
  "injected",
  "injection",
  "injections",
  "injunction",
  "injured",
  "injuries",
  "injury",
  "injustice",
  "ink",
  "inkjet",
  "inks",
  "inland",
  "inlet",
  "inline",
  "inlog",
  "inmate",
  "inmates",
  "inn",
  "inner",
  "inning",
  "innings",
  "innocence",
  "innocent",
  "innovation",
  "innovations",
  "innovative",
  "inns",
  "inorganic",
  "inpatient",
  "input",
  "inputs",
  "inquire",
  "inquiries",
  "inquiry",
  "ins",
  "insane",
  "insanity",
  "insect",
  "insects",
  "insert",
  "inserted",
  "inserting",
  "insertion",
  "insertions",
  "inserts",
  "insest",
  "inside",
  "insider",
  "insight",
  "insightful",
  "insights",
  "insist",
  "insisted",
  "insists",
  "insomnia",
  "inspect",
  "inspected",
  "inspection",
  "inspections",
  "inspector",
  "inspectors",
  "inspiration",
  "inspirational",
  "inspire",
  "inspired",
  "inspiring",
  "inspiron",
  "inst",
  "instability",
  "install",
  "installation",
  "installations",
  "installed",
  "installer",
  "installing",
  "installment",
  "installs",
  "instance",
  "instances",
  "instant",
  "instantly",
  "instead",
  "instinct",
  "institut",
  "institute",
  "institutes",
  "institution",
  "institutional",
  "institutions",
  "instruct",
  "instructed",
  "instruction",
  "instructional",
  "instructions",
  "instructor",
  "instructors",
  "instrument",
  "instrumental",
  "instrumentation",
  "instruments",
  "insufficient",
  "insulated",
  "insulation",
  "insulin",
  "insult",
  "insurance",
  "insure",
  "insured",
  "insurer",
  "insurers",
  "int",
  "intact",
  "intake",
  "intangible",
  "integer",
  "integers",
  "integral",
  "integrate",
  "integrated",
  "integrates",
  "integrating",
  "integration",
  "integrity",
  "intel",
  "intellect",
  "intellectual",
  "intelligence",
  "intelligent",
  "intend",
  "intended",
  "intends",
  "intense",
  "intensity",
  "intensive",
  "intent",
  "intention",
  "intentional",
  "intentionally",
  "intentions",
  "inter",
  "interact",
  "interacting",
  "interaction",
  "interactions",
  "interactive",
  "intercept",
  "interchange",
  "interconnect",
  "interconnection",
  "intercontinental",
  "intercourse",
  "interdisciplinary",
  "interest",
  "interested",
  "interesting",
  "interestingly",
  "interests",
  "interface",
  "interfaces",
  "interfere",
  "interference",
  "intergovernmental",
  "interim",
  "interior",
  "interiors",
  "intermediate",
  "intermittent",
  "intern",
  "internal",
  "internally",
  "international",
  "internationally",
  "internet",
  "internship",
  "internships",
  "interoperability",
  "interpersonal",
  "interpret",
  "interpretation",
  "interpretations",
  "interpreted",
  "interpreter",
  "interpreters",
  "interpreting",
  "interpro",
  "interracial",
  "interrupt",
  "interrupted",
  "interruption",
  "intersection",
  "interstate",
  "interval",
  "intervals",
  "intervene",
  "intervention",
  "interventions",
  "interview",
  "interviewed",
  "interviewing",
  "interviews",
  "intestinal",
  "intimate",
  "intl",
  "into",
  "intra",
  "intracellular",
  "intranet",
  "intravenous",
  "intriguing",
  "intrinsic",
  "intro",
  "introduce",
  "introduced",
  "introduces",
  "introducing",
  "introduction",
  "introductions",
  "introductory",
  "intrusion",
  "intuition",
  "intuitive",
  "inuyasha",
  "invalid",
  "invaluable",
  "invariant",
  "invasion",
  "invasive",
  "invented",
  "invention",
  "inventions",
  "inventor",
  "inventories",
  "inventory",
  "inverness",
  "inverse",
  "inverted",
  "inverter",
  "invest",
  "invested",
  "investigate",
  "investigated",
  "investigating",
  "investigation",
  "investigations",
  "investigative",
  "investigator",
  "investigators",
  "investing",
  "investment",
  "investments",
  "investor",
  "investors",
  "invisible",
  "invision",
  "invitation",
  "invitational",
  "invitations",
  "invite",
  "invited",
  "invites",
  "inviting",
  "invoice",
  "invoices",
  "invoke",
  "invoked",
  "involve",
  "involved",
  "involvement",
  "involves",
  "involving",
  "inward",
  "io",
  "iomega",
  "ion",
  "ionamin",
  "ionic",
  "ions",
  "ios",
  "iowa",
  "ip",
  "ipaq",
  "ipb",
  "ipc",
  "ipo",
  "ipod",
  "ipods",
  "ips",
  "ipsec",
  "ipswich",
  "iptables",
  "iq",
  "ir",
  "ira",
  "iran",
  "iranian",
  "iraq",
  "iraqi",
  "iraqis",
  "irc",
  "ire",
  "ireland",
  "irene",
  "iris",
  "irish",
  "iriver",
  "iron",
  "ironic",
  "ironically",
  "ironing",
  "irons",
  "irony",
  "irq",
  "irregular",
  "irrelevant",
  "irrigation",
  "irritation",
  "irs",
  "irvine",
  "irving",
  "irwin",
  "is",
  "isa",
  "isaac",
  "isabel",
  "isabella",
  "isaiah",
  "isbn",
  "isd",
  "isdn",
  "ish",
  "isis",
  "isl",
  "islam",
  "islamic",
  "island",
  "islander",
  "islanders",
  "islands",
  "isle",
  "isles",
  "isnt",
  "iso",
  "isolate",
  "isolated",
  "isolates",
  "isolation",
  "isp",
  "isps",
  "israel",
  "israeli",
  "israelis",
  "iss",
  "issn",
  "issuance",
  "issue",
  "issued",
  "issuer",
  "issues",
  "issuing",
  "ist",
  "istanbul",
  "isuzu",
  "it",
  "ita",
  "italia",
  "italian",
  "italiano",
  "italic",
  "italicized",
  "italy",
  "itc",
  "item",
  "items",
  "iteration",
  "ithaca",
  "itinerary",
  "itk",
  "its",
  "itself",
  "itu",
  "itunes",
  "ity",
  "iu",
  "iv",
  "ivan",
  "ive",
  "ivoire",
  "ivory",
  "ivtools",
  "ivy",
  "ix",
  "iz",
  "j",
  "ja",
  "jabber",
  "jacket",
  "jackets",
  "jackie",
  "jacking",
  "jackpot",
  "jacks",
  "jackson",
  "jacksonville",
  "jacob",
  "jacobs",
  "jacqueline",
  "jacques",
  "jacuzzi",
  "jade",
  "jaguar",
  "jail",
  "jakarta",
  "jake",
  "jam",
  "jamaica",
  "james",
  "jameson",
  "jamestown",
  "jamie",
  "jams",
  "jan",
  "jane",
  "janeiro",
  "janet",
  "janice",
  "janis",
  "janitorial",
  "january",
  "japan",
  "japanese",
  "jar",
  "jared",
  "jargon",
  "jars",
  "jarvis",
  "jasmine",
  "jason",
  "jasper",
  "java",
  "javascript",
  "jaw",
  "jaws",
  "jay",
  "jays",
  "jazz",
  "jb",
  "jbl",
  "jboss",
  "jc",
  "jd",
  "jdbc",
  "je",
  "jealous",
  "jean",
  "jeanne",
  "jeans",
  "jedi",
  "jeep",
  "jeeves",
  "jeff",
  "jefferson",
  "jeffrey",
  "jelly",
  "jelsoft",
  "jen",
  "jenkins",
  "jenna",
  "jennifer",
  "jennings",
  "jenny",
  "jensen",
  "jeremiah",
  "jeremy",
  "jerk",
  "jerking",
  "jerome",
  "jersey",
  "jerseys",
  "jerusalem",
  "jess",
  "jesse",
  "jessica",
  "jessie",
  "jesus",
  "jet",
  "jets",
  "jeux",
  "jew",
  "jewel",
  "jewellery",
  "jewelry",
  "jewels",
  "jewish",
  "jews",
  "jf",
  "jfk",
  "jg",
  "jh",
  "ji",
  "jigsaw",
  "jihad",
  "jill",
  "jimi",
  "jimmy",
  "jin",
  "jingle",
  "jira",
  "jive",
  "jj",
  "jk",
  "jl",
  "jm",
  "jn",
  "jo",
  "joan",
  "joanna",
  "joanne",
  "joaquin",
  "job",
  "jobs",
  "jockey",
  "joel",
  "joey",
  "johan",
  "johann",
  "johannes",
  "johannesburg",
  "johnny",
  "johns",
  "johnson",
  "johnston",
  "join",
  "joined",
  "joining",
  "joins",
  "joint",
  "jointly",
  "joints",
  "jojo",
  "joke",
  "jokes",
  "jolie",
  "jolla",
  "jolly",
  "jon",
  "jonah",
  "jonas",
  "jonathan",
  "jones",
  "jong",
  "joomla",
  "joplin",
  "jordan",
  "jorge",
  "jose",
  "josef",
  "joseph",
  "josephine",
  "josh",
  "joshua",
  "jour",
  "journal",
  "journalism",
  "journalist",
  "journalists",
  "journals",
  "journey",
  "journeys",
  "jovi",
  "joy",
  "joyce",
  "joystick",
  "jp",
  "jpeg",
  "jpg",
  "jpy",
  "jr",
  "js",
  "jsp",
  "jt",
  "ju",
  "jubilee",
  "judaism",
  "judd",
  "jude",
  "judge",
  "judged",
  "judgement",
  "judges",
  "judging",
  "judgment",
  "judgments",
  "judicial",
  "judiciary",
  "judith",
  "judy",
  "juice",
  "juices",
  "juicy",
  "jukebox",
  "jul",
  "jules",
  "julia",
  "julian",
  "julie",
  "juliet",
  "julio",
  "julius",
  "july",
  "jumbo",
  "jump",
  "jumped",
  "jumper",
  "jumping",
  "jumps",
  "jun",
  "junction",
  "june",
  "jung",
  "jungle",
  "junior",
  "juniors",
  "juniper",
  "junk",
  "jupiter",
  "jurisdiction",
  "jurisdictions",
  "jury",
  "just",
  "justice",
  "justification",
  "justified",
  "justify",
  "justin",
  "juvenile",
  "jv",
  "jvc",
  "jw",
  "k",
  "ka",
  "kai",
  "kaiser",
  "kalamazoo",
  "kan",
  "kane",
  "kangaroo",
  "kansas",
  "kanye",
  "kaplan",
  "kappa",
  "kara",
  "karaoke",
  "karate",
  "karen",
  "karl",
  "karma",
  "kart",
  "kashmir",
  "kat",
  "kate",
  "katherine",
  "kathleen",
  "kathryn",
  "kathy",
  "katie",
  "katrina",
  "katy",
  "katz",
  "kauai",
  "kaufman",
  "kawasaki",
  "kay",
  "kayak",
  "kayaking",
  "kazaa",
  "kazakhstan",
  "kb",
  "kbps",
  "kbytes",
  "kc",
  "kd",
  "kde",
  "ke",
  "keeling",
  "keen",
  "keep",
  "keeper",
  "keeping",
  "keeps",
  "keith",
  "kelkoo",
  "keller",
  "kelley",
  "kellogg",
  "kelly",
  "kendall",
  "kennedy",
  "kennel",
  "kenneth",
  "kenny",
  "keno",
  "kensington",
  "kent",
  "kentucky",
  "kenwood",
  "kenya",
  "kept",
  "kerala",
  "kern",
  "kernel",
  "kernels",
  "kerr",
  "kerry",
  "kettle",
  "kev",
  "kevin",
  "key",
  "keyboard",
  "keyboards",
  "keygen",
  "keynes",
  "keynote",
  "keypad",
  "keys",
  "keystone",
  "keyword",
  "keywords",
  "kg",
  "kh",
  "khan",
  "khz",
  "ki",
  "kia",
  "kick",
  "kicked",
  "kicking",
  "kicks",
  "kid",
  "kidding",
  "kidney",
  "kids",
  "kiev",
  "kijiji",
  "kill",
  "killed",
  "killer",
  "killers",
  "killing",
  "kills",
  "kilometers",
  "kilometres",
  "kim",
  "kimberly",
  "kin",
  "kinase",
  "kind",
  "kinda",
  "kindergarten",
  "kindly",
  "kindness",
  "kinds",
  "kinetic",
  "kinetics",
  "king",
  "kingdom",
  "kings",
  "kingston",
  "kinky",
  "kiosk",
  "kirby",
  "kiribati",
  "kirk",
  "kirsten",
  "kiss",
  "kissed",
  "kisses",
  "kissimmee",
  "kissing",
  "kit",
  "kitchen",
  "kitchens",
  "kite",
  "kits",
  "kitten",
  "kittens",
  "kitts",
  "kitty",
  "kiwi",
  "kj",
  "kk",
  "kl",
  "klaus",
  "klein",
  "km",
  "kms",
  "kn",
  "knee",
  "knees",
  "knew",
  "knife",
  "knight",
  "knights",
  "knit",
  "knitting",
  "knives",
  "knob",
  "knobs",
  "knock",
  "knocked",
  "knocking",
  "knot",
  "knots",
  "know",
  "knowing",
  "knowingly",
  "knowledge",
  "knowledgeable",
  "knowledgebase",
  "knowledgestorm",
  "knowles",
  "known",
  "knows",
  "knox",
  "knoxville",
  "ko",
  "kobe",
  "koch",
  "kodak",
  "koh",
  "kona",
  "kong",
  "konica",
  "kontakt",
  "kool",
  "korea",
  "korean",
  "korn",
  "kos",
  "kosher",
  "kosovo",
  "kp",
  "kpx",
  "kr",
  "kraft",
  "kramer",
  "kris",
  "krishna",
  "kristen",
  "kristin",
  "kruger",
  "ks",
  "kt",
  "ku",
  "kuala",
  "kudoz",
  "kumar",
  "kung",
  "kurdish",
  "kurt",
  "kuwait",
  "kv",
  "kvm",
  "kw",
  "kx",
  "ky",
  "kyle",
  "kylie",
  "kyocera",
  "kyoto",
  "kyrgyzstan",
  "kz",
  "l",
  "la",
  "lab",
  "label",
  "labeled",
  "labeling",
  "labelled",
  "labelling",
  "labels",
  "labor",
  "laboratories",
  "laboratory",
  "labour",
  "labrador",
  "labs",
  "lac",
  "lace",
  "lack",
  "lacked",
  "lacking",
  "lacks",
  "lacrosse",
  "lad",
  "ladder",
  "ladders",
  "laden",
  "ladies",
  "lady",
  "ladyboy",
  "ladyboys",
  "lafayette",
  "lag",
  "lagoon",
  "laguna",
  "lai",
  "laid",
  "lake",
  "lakeland",
  "lakers",
  "lakes",
  "lakeside",
  "lakewood",
  "lam",
  "lama",
  "lamar",
  "lamb",
  "lambda",
  "lambert",
  "lamborghini",
  "lame",
  "laminate",
  "laminated",
  "lamp",
  "lamps",
  "lan",
  "lancashire",
  "lancaster",
  "lance",
  "land",
  "landed",
  "landfill",
  "landing",
  "landlord",
  "landlords",
  "landmark",
  "landmarks",
  "lands",
  "landscape",
  "landscapes",
  "landscaping",
  "lane",
  "lanes",
  "lang",
  "lange",
  "langley",
  "language",
  "languages",
  "lanka",
  "lansing",
  "lantern",
  "lao",
  "laos",
  "lap",
  "laps",
  "laptop",
  "laptops",
  "lara",
  "large",
  "largely",
  "larger",
  "largest",
  "largo",
  "lars",
  "larsen",
  "larson",
  "larvae",
  "las",
  "laser",
  "laserjet",
  "lasers",
  "lasik",
  "last",
  "lasted",
  "lasting",
  "lastly",
  "lasts",
  "lat",
  "latch",
  "late",
  "lately",
  "latency",
  "latent",
  "later",
  "lateral",
  "latest",
  "latex",
  "latin",
  "latina",
  "latinas",
  "latino",
  "latitude",
  "latter",
  "lattice",
  "latvia",
  "latvian",
  "lauderdale",
  "laugh",
  "laughed",
  "laughing",
  "laughs",
  "laughter",
  "launch",
  "launched",
  "launches",
  "launching",
  "laundering",
  "laundry",
  "laura",
  "laurel",
  "lauren",
  "laurence",
  "laurent",
  "laurie",
  "lava",
  "lavender",
  "lavigne",
  "law",
  "lawful",
  "lawmakers",
  "lawn",
  "lawrence",
  "laws",
  "lawson",
  "lawsuit",
  "lawsuits",
  "lawyer",
  "lawyers",
  "lax",
  "lay",
  "layer",
  "layered",
  "layers",
  "laying",
  "layout",
  "layouts",
  "lays",
  "layup",
  "lazy",
  "lb",
  "lbs",
  "lc",
  "lcd",
  "ld",
  "ldap",
  "lds",
  "le",
  "lea",
  "lead",
  "leader",
  "leaders",
  "leadership",
  "leading",
  "leads",
  "leaf",
  "leaflet",
  "league",
  "leagues",
  "leah",
  "leak",
  "leakage",
  "leaks",
  "lean",
  "leaning",
  "leap",
  "learn",
  "learned",
  "learner",
  "learners",
  "learning",
  "learns",
  "learnt",
  "lease",
  "leased",
  "leases",
  "leasing",
  "least",
  "leather",
  "leave",
  "leaves",
  "leaving",
  "lebanese",
  "lebanon",
  "lec",
  "lecture",
  "lecturer",
  "lectures",
  "led",
  "ledger",
  "leds",
  "lee",
  "leeds",
  "left",
  "leg",
  "legacy",
  "legal",
  "legally",
  "legend",
  "legendary",
  "legends",
  "legion",
  "legislation",
  "legislative",
  "legislators",
  "legislature",
  "legitimacy",
  "legitimate",
  "lego",
  "legs",
  "lehigh",
  "lei",
  "leica",
  "leicester",
  "leicestershire",
  "leigh",
  "leipzig",
  "leisure",
  "lemma",
  "lemon",
  "len",
  "lena",
  "lend",
  "lender",
  "lenders",
  "lending",
  "lendingtree",
  "length",
  "lengths",
  "lengthy",
  "lennon",
  "lenny",
  "lenox",
  "lens",
  "lenses",
  "lent",
  "leo",
  "leon",
  "leonard",
  "leonardo",
  "leone",
  "leopard",
  "leroy",
  "les",
  "lesbian",
  "lesbianas",
  "lesbians",
  "lesbo",
  "lesbos",
  "lesions",
  "leslie",
  "lesotho",
  "less",
  "lesser",
  "lesson",
  "lessons",
  "lest",
  "lester",
  "let",
  "lethal",
  "letras",
  "lets",
  "lett",
  "letter",
  "lettering",
  "letters",
  "letting",
  "lettuce",
  "leu",
  "leukemia",
  "lev",
  "level",
  "levels",
  "lever",
  "leverage",
  "leveraging",
  "levi",
  "levin",
  "levine",
  "levitra",
  "levy",
  "lewis",
  "lex",
  "lexar",
  "lexicon",
  "lexington",
  "lexisnexis",
  "lexmark",
  "lexus",
  "lf",
  "lg",
  "lh",
  "li",
  "liabilities",
  "liability",
  "liable",
  "liaison",
  "liam",
  "liar",
  "lib",
  "libby",
  "libc",
  "libdevel",
  "liberal",
  "liberals",
  "liberation",
  "liberia",
  "libertarian",
  "liberties",
  "liberty",
  "librarian",
  "librarians",
  "libraries",
  "library",
  "libs",
  "libstdc",
  "libtool",
  "libya",
  "libyan",
  "lic",
  "licence",
  "licences",
  "license",
  "licensed",
  "licensee",
  "licensees",
  "licenses",
  "licensing",
  "licensors",
  "licensure",
  "lick",
  "licking",
  "lid",
  "lie",
  "liechtenstein",
  "lied",
  "lien",
  "liens",
  "lies",
  "lieu",
  "lieutenant",
  "life",
  "lifecycle",
  "lifelong",
  "lifestyle",
  "lifestyles",
  "lifetime",
  "lift",
  "lifted",
  "lifting",
  "lifts",
  "ligand",
  "light",
  "lightbox",
  "lighted",
  "lighter",
  "lighthouse",
  "lighting",
  "lightly",
  "lightning",
  "lights",
  "lightweight",
  "like",
  "liked",
  "likelihood",
  "likely",
  "likes",
  "likewise",
  "liking",
  "lil",
  "lilac",
  "lilies",
  "lillian",
  "lilly",
  "lily",
  "lim",
  "lima",
  "limb",
  "limbs",
  "lime",
  "limerick",
  "limestone",
  "limit",
  "limitation",
  "limitations",
  "limited",
  "limiting",
  "limits",
  "limo",
  "limousine",
  "limousines",
  "limp",
  "lin",
  "lincoln",
  "lincolnshire",
  "linda",
  "linden",
  "lindsay",
  "lindsey",
  "line",
  "lineage",
  "linear",
  "lined",
  "linen",
  "linens",
  "liner",
  "liners",
  "lines",
  "lineup",
  "ling",
  "lingere",
  "lingerie",
  "linguistic",
  "linguistics",
  "lining",
  "link",
  "linkage",
  "linkages",
  "linked",
  "linker",
  "linkin",
  "linking",
  "links",
  "linksys",
  "linn",
  "linus",
  "linux",
  "lion",
  "lionel",
  "lions",
  "lip",
  "lipid",
  "lipitor",
  "liposuction",
  "lips",
  "lipstick",
  "liquid",
  "liquidation",
  "liquidity",
  "liquids",
  "liquor",
  "lira",
  "lis",
  "lisa",
  "lisbon",
  "lisp",
  "list",
  "listed",
  "listen",
  "listened",
  "listener",
  "listeners",
  "listening",
  "lister",
  "listing",
  "listings",
  "listmania",
  "listprice",
  "lists",
  "listserv",
  "lit",
  "lite",
  "liter",
  "literacy",
  "literal",
  "literally",
  "literary",
  "literature",
  "lithium",
  "lithuania",
  "lithuanian",
  "litigation",
  "litre",
  "litres",
  "litter",
  "little",
  "liu",
  "live",
  "livecam",
  "lived",
  "livejournal",
  "lively",
  "liver",
  "liverpool",
  "lives",
  "livesex",
  "livestock",
  "living",
  "livingston",
  "liz",
  "lizard",
  "lj",
  "lk",
  "ll",
  "llc",
  "lloyd",
  "llp",
  "lm",
  "ln",
  "lo",
  "load",
  "loaded",
  "loader",
  "loading",
  "loads",
  "loan",
  "loans",
  "lob",
  "lobby",
  "lobbying",
  "lobster",
  "loc",
  "local",
  "locale",
  "localhost",
  "localities",
  "locality",
  "localization",
  "localized",
  "locally",
  "locals",
  "locate",
  "located",
  "locating",
  "location",
  "locations",
  "locator",
  "loch",
  "lock",
  "locke",
  "locked",
  "locker",
  "locking",
  "locks",
  "locus",
  "lodge",
  "lodged",
  "lodges",
  "lodging",
  "loft",
  "log",
  "logan",
  "logged",
  "logger",
  "logging",
  "logic",
  "logical",
  "login",
  "logistics",
  "logitech",
  "logo",
  "logon",
  "logos",
  "logout",
  "logs",
  "lohan",
  "lois",
  "lol",
  "lola",
  "lolita",
  "lolitas",
  "lon",
  "london",
  "lone",
  "lonely",
  "long",
  "longer",
  "longest",
  "longevity",
  "longhorn",
  "longitude",
  "longitudinal",
  "look",
  "looked",
  "looking",
  "lookout",
  "looks",
  "looksmart",
  "lookup",
  "loop",
  "loops",
  "loose",
  "loosely",
  "lopez",
  "lord",
  "lords",
  "lore",
  "loren",
  "lorenzo",
  "lori",
  "lorraine",
  "lortab",
  "los",
  "lose",
  "loser",
  "losers",
  "loses",
  "losing",
  "loss",
  "losses",
  "lost",
  "lot",
  "lotion",
  "lots",
  "lottery",
  "lotto",
  "lotus",
  "lou",
  "loud",
  "louis",
  "louise",
  "louisiana",
  "louisville",
  "lounge",
  "love",
  "loved",
  "lovely",
  "lover",
  "lovers",
  "loves",
  "loving",
  "low",
  "lowe",
  "lowell",
  "lower",
  "lowered",
  "lowering",
  "lowest",
  "lows",
  "loyal",
  "loyalty",
  "loyola",
  "lp",
  "lps",
  "lq",
  "lr",
  "ls",
  "lsu",
  "lt",
  "ltd",
  "lu",
  "lubbock",
  "lubricants",
  "luc",
  "lucas",
  "lucent",
  "lucia",
  "luck",
  "luckily",
  "lucky",
  "lucy",
  "ludwig",
  "lug",
  "luggage",
  "luis",
  "luke",
  "lulu",
  "lumber",
  "lump",
  "lumpur",
  "luna",
  "lunar",
  "lunch",
  "luncheon",
  "lund",
  "lung",
  "lungs",
  "lure",
  "lush",
  "lust",
  "luther",
  "lutheran",
  "luton",
  "luv",
  "lux",
  "luxembourg",
  "luxurious",
  "luxury",
  "lv",
  "lw",
  "lx",
  "ly",
  "lycos",
  "lydia",
  "lying",
  "lyme",
  "lymph",
  "lymphoma",
  "lynch",
  "lynn",
  "lynne",
  "lynx",
  "lyon",
  "lyons",
  "lyric",
  "lyrics",
  "lys",
  "m",
  "ma",
  "mac",
  "macau",
  "macdonald",
  "macedonia",
  "mach",
  "machine",
  "machinery",
  "machines",
  "machining",
  "macintosh",
  "mack",
  "mackay",
  "mackenzie",
  "macmillan",
  "macon",
  "macos",
  "macquarie",
  "macro",
  "macroeconomic",
  "macromedia",
  "macros",
  "macs",
  "macworld",
  "macy",
  "mad",
  "madagascar",
  "madam",
  "madame",
  "madden",
  "made",
  "madison",
  "madness",
  "madonna",
  "madrid",
  "madthumbs",
  "mae",
  "maestro",
  "mafia",
  "mag",
  "magazine",
  "magazines",
  "mage",
  "magellan",
  "magenta",
  "maggie",
  "magic",
  "magical",
  "magician",
  "magistrate",
  "magna",
  "magnesium",
  "magnet",
  "magnetic",
  "magnets",
  "magnificent",
  "magnitude",
  "magnolia",
  "magnum",
  "mags",
  "mah",
  "maharashtra",
  "mahogany",
  "mai",
  "maid",
  "maiden",
  "mail",
  "mailbox",
  "mailed",
  "mailer",
  "mailing",
  "mailman",
  "mails",
  "mailto",
  "main",
  "maine",
  "mainframe",
  "mainland",
  "mainly",
  "mains",
  "mainstream",
  "maintain",
  "maintained",
  "maintainer",
  "maintaining",
  "maintains",
  "maintenance",
  "mais",
  "maize",
  "majestic",
  "majesty",
  "major",
  "majordomo",
  "majority",
  "majors",
  "make",
  "makefile",
  "makeover",
  "maker",
  "makers",
  "makes",
  "makeup",
  "making",
  "mal",
  "malaga",
  "malaria",
  "malawi",
  "malay",
  "malaysia",
  "malaysian",
  "malcolm",
  "maldives",
  "male",
  "males",
  "mali",
  "malibu",
  "malicious",
  "malignant",
  "mall",
  "mallorca",
  "malls",
  "malone",
  "malpractice",
  "malta",
  "maltese",
  "malware",
  "mama",
  "mambo",
  "mammalian",
  "mammals",
  "mammoth",
  "man",
  "mana",
  "manage",
  "managed",
  "management",
  "manager",
  "managerial",
  "managers",
  "manages",
  "managing",
  "manchester",
  "mandarin",
  "mandate",
  "mandated",
  "mandates",
  "mandatory",
  "mandrake",
  "mandy",
  "manga",
  "mango",
  "manhattan",
  "mania",
  "manicures",
  "manifest",
  "manifesto",
  "manifold",
  "manila",
  "manipulate",
  "manipulated",
  "manipulation",
  "manitoba",
  "mankind",
  "mann",
  "manner",
  "manners",
  "manning",
  "manor",
  "manpower",
  "mans",
  "mansfield",
  "mansion",
  "manson",
  "mantle",
  "manual",
  "manually",
  "manuals",
  "manuel",
  "manufacture",
  "manufactured",
  "manufacturer",
  "manufacturers",
  "manufactures",
  "manufacturing",
  "manure",
  "manuscript",
  "manuscripts",
  "many",
  "mao",
  "maori",
  "map",
  "maple",
  "mapped",
  "mapping",
  "mapquest",
  "maps",
  "mar",
  "mara",
  "marathon",
  "marble",
  "marc",
  "marcel",
  "march",
  "marching",
  "marcia",
  "marco",
  "marcos",
  "marcus",
  "mardi",
  "mare",
  "margaret",
  "margin",
  "marginal",
  "margins",
  "maria",
  "mariah",
  "marian",
  "mariana",
  "marianne",
  "marie",
  "marietta",
  "marijuana",
  "marilyn",
  "marin",
  "marina",
  "marine",
  "mariner",
  "mariners",
  "marines",
  "marino",
  "mario",
  "marion",
  "marital",
  "maritime",
  "marked",
  "marker",
  "markers",
  "market",
  "marketed",
  "marketers",
  "marketing",
  "marketplace",
  "markets",
  "marking",
  "markings",
  "marks",
  "markup",
  "markus",
  "marlboro",
  "marlborough",
  "marley",
  "marlin",
  "maroon",
  "marquette",
  "marquis",
  "marriage",
  "marriages",
  "married",
  "marriott",
  "marrow",
  "marry",
  "mars",
  "marsh",
  "marshal",
  "marshall",
  "mart",
  "martha",
  "martial",
  "martin",
  "martinez",
  "martini",
  "martinique",
  "marty",
  "marvel",
  "marvelous",
  "marvin",
  "marx",
  "mary",
  "maryland",
  "mas",
  "maserati",
  "mask",
  "masks",
  "mason",
  "masonry",
  "mass",
  "massachusetts",
  "massacre",
  "massage",
  "masses",
  "massey",
  "massive",
  "mast",
  "master",
  "masterbating",
  "masterbation",
  "mastercard",
  "mastering",
  "masterpiece",
  "masters",
  "mastery",
  "masturbating",
  "masturbation",
  "mat",
  "match",
  "matched",
  "matches",
  "matching",
  "mate",
  "mateo",
  "material",
  "materially",
  "materials",
  "maternal",
  "maternity",
  "mates",
  "math",
  "mathematical",
  "mathematics",
  "maths",
  "mating",
  "matlab",
  "matrices",
  "matrix",
  "mats",
  "matt",
  "matte",
  "matter",
  "matters",
  "matthew",
  "matthews",
  "matthias",
  "mattress",
  "mattresses",
  "mature",
  "maturity",
  "maui",
  "maureen",
  "maurice",
  "mauritania",
  "mauritius",
  "maven",
  "maverick",
  "max",
  "maxi",
  "maxim",
  "maximal",
  "maximize",
  "maximizing",
  "maximum",
  "maxtor",
  "maxwell",
  "may",
  "maya",
  "maybe",
  "mayen",
  "mayer",
  "mayhem",
  "mayo",
  "mayor",
  "mayotte",
  "mazda",
  "maze",
  "mb",
  "mba",
  "mbps",
  "mc",
  "mca",
  "mcafee",
  "mcbride",
  "mccain",
  "mccarthy",
  "mccartney",
  "mccormick",
  "mccoy",
  "mcdonald",
  "mcdowell",
  "mcgee",
  "mcgill",
  "mcgraw",
  "mcgregor",
  "mcguire",
  "mci",
  "mckenzie",
  "mckinney",
  "mclaren",
  "mclean",
  "mcmahon",
  "mcse",
  "mcsg",
  "md",
  "mda",
  "mds",
  "mdt",
  "me",
  "mead",
  "meade",
  "meadow",
  "meadows",
  "meal",
  "meals",
  "mean",
  "meaning",
  "meaningful",
  "meaningless",
  "meanings",
  "means",
  "meant",
  "meantime",
  "meanwhile",
  "measurable",
  "measure",
  "measured",
  "measurement",
  "measurements",
  "measures",
  "measuring",
  "meat",
  "meats",
  "mechanic",
  "mechanical",
  "mechanics",
  "mechanism",
  "mechanisms",
  "med",
  "medal",
  "medals",
  "medford",
  "media",
  "median",
  "mediated",
  "mediation",
  "mediator",
  "mediawiki",
  "medicaid",
  "medical",
  "medically",
  "medicare",
  "medication",
  "medications",
  "medicinal",
  "medicine",
  "medicines",
  "medieval",
  "medina",
  "meditation",
  "mediterranean",
  "medium",
  "medley",
  "medline",
  "meds",
  "meet",
  "meeting",
  "meetings",
  "meets",
  "meetup",
  "meg",
  "mega",
  "megan",
  "megapixel",
  "megapixels",
  "mehr",
  "mel",
  "melanie",
  "melanoma",
  "melbourne",
  "melinda",
  "melissa",
  "mellon",
  "melodies",
  "melody",
  "melt",
  "melted",
  "melting",
  "melvin",
  "mem",
  "member",
  "memberlistmemberlist",
  "members",
  "membership",
  "memberships",
  "membrane",
  "membranes",
  "memo",
  "memoir",
  "memoirs",
  "memorabilia",
  "memorable",
  "memorandum",
  "memorial",
  "memorials",
  "memories",
  "memory",
  "memphis",
  "men",
  "menace",
  "menopause",
  "mens",
  "ment",
  "mental",
  "mentally",
  "mention",
  "mentioned",
  "mentioning",
  "mentions",
  "mentor",
  "mentoring",
  "mentors",
  "ments",
  "menu",
  "menus",
  "mer",
  "mercedes",
  "mercer",
  "merchandise",
  "merchandising",
  "merchant",
  "merchantability",
  "merchants",
  "merck",
  "mercury",
  "mercy",
  "mere",
  "meredith",
  "merely",
  "merge",
  "merged",
  "merger",
  "mergers",
  "merging",
  "meridia",
  "meridian",
  "merit",
  "merits",
  "merlin",
  "mermaid",
  "merriam",
  "merrill",
  "merry",
  "mes",
  "mesa",
  "mesh",
  "mesothelioma",
  "mess",
  "message",
  "messages",
  "messageslog",
  "messaging",
  "messenger",
  "messiah",
  "messy",
  "met",
  "meta",
  "metabolic",
  "metabolism",
  "metacritic",
  "metadata",
  "metal",
  "metallic",
  "metallica",
  "metals",
  "metaphor",
  "metasearch",
  "meteorological",
  "meteorology",
  "meter",
  "metering",
  "meters",
  "meth",
  "methane",
  "method",
  "methodist",
  "methodologies",
  "methodology",
  "methods",
  "methyl",
  "metre",
  "metres",
  "metric",
  "metrics",
  "metro",
  "metropolis",
  "metropolitan",
  "mets",
  "mev",
  "mexican",
  "mexico",
  "meyer",
  "mf",
  "mfc",
  "mfg",
  "mfr",
  "mft",
  "mg",
  "mgm",
  "mgmt",
  "mh",
  "mhz",
  "mi",
  "mia",
  "miami",
  "mib",
  "mic",
  "micah",
  "mice",
  "michael",
  "michaels",
  "michel",
  "michele",
  "michelle",
  "michigan",
  "mick",
  "mickey",
  "micro",
  "microbial",
  "microbiology",
  "micron",
  "micronesia",
  "microphone",
  "microphones",
  "microscope",
  "microscopic",
  "microscopy",
  "microsoft",
  "microsystems",
  "microwave",
  "mid",
  "middle",
  "middlesex",
  "middleton",
  "middletown",
  "middleware",
  "middot",
  "midget",
  "midi",
  "midland",
  "midlands",
  "midnight",
  "midst",
  "midtown",
  "midway",
  "midwest",
  "mifflin",
  "might",
  "mighty",
  "migraine",
  "migrant",
  "migrants",
  "migrate",
  "migrating",
  "migration",
  "miguel",
  "mikes",
  "mil",
  "milan",
  "milano",
  "mild",
  "mile",
  "mileage",
  "miles",
  "milestone",
  "milestones",
  "milf",
  "milfhunter",
  "milford",
  "milfs",
  "milfseeker",
  "military",
  "militia",
  "milk",
  "mill",
  "millenium",
  "millennium",
  "miller",
  "milling",
  "million",
  "millionaire",
  "millions",
  "mills",
  "milton",
  "milwaukee",
  "mime",
  "mimi",
  "min",
  "mind",
  "minded",
  "mindless",
  "minds",
  "mine",
  "miner",
  "mineral",
  "minerals",
  "miners",
  "mines",
  "ming",
  "minh",
  "mini",
  "miniature",
  "miniatures",
  "minimal",
  "minimize",
  "minimizing",
  "minimum",
  "mining",
  "minister",
  "ministerial",
  "ministers",
  "ministries",
  "ministry",
  "minneapolis",
  "minnesota",
  "minnie",
  "minolta",
  "minor",
  "minorities",
  "minority",
  "minors",
  "mins",
  "mint",
  "minus",
  "minute",
  "minutes",
  "mio",
  "mips",
  "miquelon",
  "mir",
  "mira",
  "miracle",
  "miracles",
  "mirage",
  "miranda",
  "miriam",
  "mirror",
  "mirrors",
  "mis",
  "misc",
  "miscellaneous",
  "misconduct",
  "miserable",
  "misery",
  "misleading",
  "misplace",
  "miss",
  "missed",
  "misses",
  "missile",
  "missiles",
  "missing",
  "mission",
  "missionaries",
  "missionary",
  "missions",
  "mississauga",
  "mississippi",
  "missouri",
  "missy",
  "mist",
  "mistake",
  "mistaken",
  "mistakes",
  "mister",
  "mistress",
  "misty",
  "misuse",
  "mit",
  "mitch",
  "mitchell",
  "mitigate",
  "mitigation",
  "mitochondrial",
  "mitsubishi",
  "mix",
  "mixed",
  "mixer",
  "mixers",
  "mixes",
  "mixing",
  "mixture",
  "mixtures",
  "mj",
  "mk",
  "ml",
  "mla",
  "mlb",
  "mlm",
  "mls",
  "mm",
  "mmc",
  "mmf",
  "mmm",
  "mms",
  "mn",
  "mnt",
  "mo",
  "mob",
  "mobil",
  "mobile",
  "mobiles",
  "mobility",
  "mobilization",
  "moby",
  "moc",
  "mock",
  "mod",
  "modal",
  "mode",
  "model",
  "modeled",
  "modeling",
  "modelling",
  "models",
  "modem",
  "modems",
  "moderate",
  "moderated",
  "moderately",
  "moderation",
  "moderator",
  "moderators",
  "modern",
  "modernization",
  "modes",
  "modest",
  "modification",
  "modifications",
  "modified",
  "modify",
  "modifying",
  "mods",
  "modular",
  "modulation",
  "module",
  "modules",
  "moe",
  "mohammed",
  "moi",
  "moines",
  "moist",
  "moisture",
  "mojo",
  "mol",
  "mold",
  "molded",
  "molding",
  "moldova",
  "mole",
  "molecular",
  "molecule",
  "molecules",
  "molly",
  "mom",
  "moment",
  "moments",
  "momentum",
  "momma",
  "mommy",
  "moms",
  "mon",
  "mona",
  "monaco",
  "monarch",
  "monastery",
  "monday",
  "mondays",
  "monde",
  "mondo",
  "monetary",
  "money",
  "mongolia",
  "monica",
  "monies",
  "monitor",
  "monitored",
  "monitoring",
  "monitors",
  "monk",
  "monkey",
  "monkeys",
  "monks",
  "monmouth",
  "mono",
  "monoclonal",
  "monogram",
  "monophonic",
  "monopoly",
  "monroe",
  "monster",
  "monsters",
  "mont",
  "montana",
  "monte",
  "montenegro",
  "monterey",
  "montgomery",
  "month",
  "monthly",
  "months",
  "montreal",
  "montserrat",
  "monty",
  "monument",
  "monuments",
  "moo",
  "mood",
  "moody",
  "moon",
  "moonlight",
  "moore",
  "moose",
  "mop",
  "moral",
  "morale",
  "morales",
  "morality",
  "moran",
  "more",
  "moreover",
  "morgan",
  "mormon",
  "morning",
  "mornings",
  "moroccan",
  "morocco",
  "morphology",
  "morris",
  "morrison",
  "morrow",
  "morse",
  "mortal",
  "mortality",
  "mortar",
  "mortgage",
  "mortgages",
  "morton",
  "mos",
  "mosaic",
  "moscow",
  "moses",
  "mosque",
  "mosquito",
  "moss",
  "most",
  "mostly",
  "mot",
  "motel",
  "motels",
  "mother",
  "motherboard",
  "motherboards",
  "mothers",
  "motif",
  "motion",
  "motions",
  "motivate",
  "motivated",
  "motivation",
  "motivational",
  "motive",
  "motives",
  "motley",
  "moto",
  "motor",
  "motorcycle",
  "motorcycles",
  "motoring",
  "motorized",
  "motorola",
  "motors",
  "motorsport",
  "motorsports",
  "motto",
  "mound",
  "mount",
  "mountain",
  "mountains",
  "mounted",
  "mounting",
  "mounts",
  "mourning",
  "mouse",
  "mouth",
  "mov",
  "movable",
  "move",
  "moved",
  "movement",
  "movements",
  "mover",
  "movers",
  "moves",
  "movie",
  "movies",
  "moving",
  "mozambique",
  "mozart",
  "mozilla",
  "mp",
  "mpa",
  "mpc",
  "mpeg",
  "mpegs",
  "mpg",
  "mph",
  "mpi",
  "mpls",
  "mps",
  "mr",
  "mri",
  "mrna",
  "mrs",
  "ms",
  "msa",
  "msc",
  "msdn",
  "msds",
  "msg",
  "msgid",
  "msgstr",
  "msi",
  "msie",
  "msm",
  "msn",
  "msnbc",
  "mso",
  "msrp",
  "mst",
  "msu",
  "mt",
  "mta",
  "mtv",
  "mu",
  "much",
  "mud",
  "muddy",
  "mudvayne",
  "mueller",
  "mug",
  "mugs",
  "muhammad",
  "mule",
  "muller",
  "multi",
  "multicast",
  "multicultural",
  "multidisciplinary",
  "multifunction",
  "multilateral",
  "multilingual",
  "multimedia",
  "multinational",
  "multiplayer",
  "multiple",
  "multiplication",
  "multiplied",
  "multiply",
  "multitude",
  "mum",
  "mumbai",
  "mummy",
  "mundo",
  "munich",
  "municipal",
  "municipalities",
  "municipality",
  "murakami",
  "murder",
  "murdered",
  "murders",
  "murphy",
  "murray",
  "mus",
  "muscle",
  "muscles",
  "muscular",
  "muse",
  "museum",
  "museums",
  "mushroom",
  "mushrooms",
  "music",
  "musica",
  "musical",
  "musicals",
  "musician",
  "musicians",
  "musik",
  "musings",
  "muslim",
  "muslims",
  "must",
  "mustang",
  "mustard",
  "mutant",
  "mutants",
  "mutation",
  "mutations",
  "mute",
  "mutual",
  "mutually",
  "muze",
  "mv",
  "mvc",
  "mvp",
  "mw",
  "mx",
  "my",
  "myanmar",
  "myers",
  "myocardial",
  "myr",
  "myriad",
  "myrtle",
  "myself",
  "mysimon",
  "myspace",
  "mysql",
  "mysteries",
  "mysterious",
  "mystery",
  "mystic",
  "mystical",
  "myth",
  "mythology",
  "myths",
  "mz",
  "n",
  "na",
  "nabble",
  "nach",
  "nacional",
  "nad",
  "nadu",
  "nail",
  "nails",
  "nairobi",
  "naive",
  "naked",
  "nam",
  "name",
  "named",
  "namely",
  "names",
  "namespace",
  "namibia",
  "naming",
  "nan",
  "nancy",
  "nanny",
  "nano",
  "nanotechnology",
  "naomi",
  "nap",
  "napa",
  "naples",
  "napoleon",
  "napster",
  "narnia",
  "narrative",
  "narrator",
  "narrow",
  "nas",
  "nasa",
  "nasal",
  "nascar",
  "nasdaq",
  "nash",
  "nashville",
  "nassau",
  "nasty",
  "nat",
  "natal",
  "natalie",
  "natasha",
  "nate",
  "nathan",
  "nathaniel",
  "nation",
  "national",
  "nationalism",
  "nationalist",
  "nationality",
  "nationally",
  "nationals",
  "nations",
  "nationwide",
  "native",
  "natives",
  "natl",
  "nato",
  "natural",
  "naturally",
  "naturals",
  "nature",
  "naughty",
  "nauru",
  "nausea",
  "nautical",
  "nav",
  "navajo",
  "naval",
  "navigate",
  "navigation",
  "navigational",
  "navigator",
  "navy",
  "nay",
  "nazi",
  "nazis",
  "nb",
  "nba",
  "nbc",
  "nc",
  "ncaa",
  "ncbi",
  "ncr",
  "nd",
  "ne",
  "neal",
  "near",
  "nearby",
  "nearest",
  "nearly",
  "neat",
  "nebraska",
  "nec",
  "necessarily",
  "necessary",
  "necessity",
  "neck",
  "necklace",
  "necklaces",
  "ned",
  "nederland",
  "nederlands",
  "need",
  "needed",
  "needing",
  "needle",
  "needles",
  "needless",
  "needs",
  "needy",
  "negative",
  "negatively",
  "neglect",
  "neglected",
  "negligence",
  "negligible",
  "negotiable",
  "negotiate",
  "negotiated",
  "negotiating",
  "negotiation",
  "negotiations",
  "negro",
  "neighbor",
  "neighborhood",
  "neighborhoods",
  "neighboring",
  "neighbors",
  "neighbour",
  "neighbourhood",
  "neighbouring",
  "neighbours",
  "neil",
  "neither",
  "nel",
  "nelly",
  "nelson",
  "nemo",
  "neo",
  "neon",
  "neonatal",
  "neoplasms",
  "nepal",
  "nephew",
  "neptune",
  "nerd",
  "nero",
  "nerve",
  "nerves",
  "nervous",
  "nes",
  "ness",
  "nest",
  "nested",
  "nesting",
  "net",
  "netbsd",
  "netgear",
  "netherlands",
  "nets",
  "netscape",
  "netware",
  "network",
  "networked",
  "networking",
  "networks",
  "neu",
  "neural",
  "neurological",
  "neurology",
  "neurons",
  "neuroscience",
  "neutral",
  "neutron",
  "nevada",
  "never",
  "nevertheless",
  "neville",
  "nevis",
  "new",
  "newark",
  "newbie",
  "newbies",
  "newborn",
  "newbury",
  "newcastle",
  "newcomers",
  "newer",
  "newest",
  "newfoundland",
  "newly",
  "newman",
  "newport",
  "news",
  "newsfeed",
  "newsgator",
  "newsgroup",
  "newsgroups",
  "newsletter",
  "newsletters",
  "newspaper",
  "newspapers",
  "newsroom",
  "newsweek",
  "newswire",
  "newton",
  "next",
  "nextag",
  "nextel",
  "nexus",
  "nf",
  "nfl",
  "nfs",
  "ng",
  "ngc",
  "ngo",
  "ngos",
  "nguyen",
  "nh",
  "nhl",
  "nhs",
  "ni",
  "niagara",
  "nib",
  "nic",
  "nicaragua",
  "nice",
  "nicely",
  "niche",
  "nicholas",
  "nichols",
  "nicholson",
  "nicht",
  "nickel",
  "nickelback",
  "nickname",
  "nicolas",
  "nicole",
  "nicotine",
  "nie",
  "nielsen",
  "nifty",
  "nigel",
  "niger",
  "nigeria",
  "nigerian",
  "night",
  "nightclub",
  "nightlife",
  "nightly",
  "nightmare",
  "nights",
  "nightwish",
  "nih",
  "nike",
  "nikki",
  "nikon",
  "nil",
  "nile",
  "nimh",
  "nina",
  "nine",
  "nineteenth",
  "ninety",
  "ninja",
  "nintendo",
  "ninth",
  "nip",
  "nipple",
  "nipples",
  "nirvana",
  "nis",
  "nissan",
  "nist",
  "nite",
  "nitrate",
  "nitro",
  "nitrogen",
  "niue",
  "nixon",
  "nj",
  "nk",
  "nl",
  "nm",
  "nmr",
  "nn",
  "no",
  "noaa",
  "noah",
  "nobel",
  "noble",
  "nobody",
  "nod",
  "nodded",
  "node",
  "nodes",
  "noel",
  "noir",
  "noise",
  "noisy",
  "nok",
  "nokia",
  "nolan",
  "nom",
  "nominal",
  "nominate",
  "nominated",
  "nomination",
  "nominations",
  "nominee",
  "nominees",
  "non",
  "noncommercial",
  "none",
  "nonetheless",
  "nonfiction",
  "nonlinear",
  "nonprofit",
  "nonsense",
  "noodles",
  "noon",
  "nope",
  "nor",
  "nora",
  "nord",
  "nordic",
  "norfolk",
  "norm",
  "norma",
  "normal",
  "normalized",
  "normally",
  "norman",
  "norms",
  "norris",
  "nortel",
  "north",
  "northampton",
  "northamptonshire",
  "northeast",
  "northeastern",
  "northern",
  "northumberland",
  "northwest",
  "northwestern",
  "norton",
  "norway",
  "norwegian",
  "norwich",
  "norwood",
  "nos",
  "nose",
  "nostalgia",
  "not",
  "notable",
  "notably",
  "notation",
  "notch",
  "note",
  "notebook",
  "notebooks",
  "noted",
  "notes",
  "noteworthy",
  "nothing",
  "notice",
  "noticeable",
  "noticed",
  "notices",
  "notification",
  "notifications",
  "notified",
  "notify",
  "noting",
  "notion",
  "notions",
  "notorious",
  "notre",
  "nottingham",
  "nottinghamshire",
  "notwithstanding",
  "noun",
  "nous",
  "nouveau",
  "nov",
  "nova",
  "novel",
  "novell",
  "novels",
  "novelties",
  "novelty",
  "november",
  "novice",
  "novo",
  "now",
  "nowadays",
  "nowhere",
  "nox",
  "nozzle",
  "np",
  "npr",
  "nr",
  "nrc",
  "nrs",
  "ns",
  "nsa",
  "nsf",
  "nsu",
  "nsw",
  "nt",
  "ntp",
  "ntsc",
  "nu",
  "nuclear",
  "nuclei",
  "nucleic",
  "nucleotide",
  "nucleus",
  "nude",
  "nudes",
  "nudist",
  "nudists",
  "nudity",
  "nuevo",
  "nuggets",
  "nuisance",
  "nuke",
  "null",
  "num",
  "number",
  "numbered",
  "numbering",
  "numbers",
  "numeric",
  "numerical",
  "numerous",
  "nunavut",
  "nur",
  "nurse",
  "nursery",
  "nurses",
  "nursing",
  "nut",
  "nutrient",
  "nutrients",
  "nutrition",
  "nutritional",
  "nuts",
  "nutten",
  "nv",
  "nvidia",
  "nw",
  "nws",
  "nwt",
  "nx",
  "ny",
  "nyc",
  "nylon",
  "nylons",
  "nyse",
  "nyt",
  "nz",
  "o",
  "oa",
  "oahu",
  "oak",
  "oakland",
  "oakley",
  "oaks",
  "oakwood",
  "oasis",
  "oath",
  "ob",
  "obedience",
  "obese",
  "obesity",
  "obey",
  "obituaries",
  "obituary",
  "obj",
  "object",
  "objection",
  "objectionable",
  "objections",
  "objective",
  "objectives",
  "objects",
  "obligated",
  "obligation",
  "obligations",
  "obliged",
  "oblique",
  "obs",
  "obscene",
  "obscure",
  "observation",
  "observations",
  "observatory",
  "observe",
  "observed",
  "observer",
  "observers",
  "observing",
  "obsessed",
  "obsession",
  "obsolete",
  "obstacle",
  "obstacles",
  "obstetrics",
  "obstruction",
  "obtain",
  "obtained",
  "obtaining",
  "obvious",
  "obviously",
  "oc",
  "occ",
  "occasion",
  "occasional",
  "occasionally",
  "occasions",
  "occult",
  "occupancy",
  "occupation",
  "occupational",
  "occupations",
  "occupied",
  "occupy",
  "occur",
  "occurred",
  "occurrence",
  "occurrences",
  "occurring",
  "occurs",
  "ocean",
  "oceania",
  "oceanic",
  "oceans",
  "och",
  "oclc",
  "ocr",
  "oct",
  "octave",
  "octet",
  "october",
  "od",
  "odbc",
  "odd",
  "odds",
  "ode",
  "oder",
  "odessa",
  "odor",
  "odyssey",
  "oe",
  "oecd",
  "oem",
  "of",
  "off",
  "offence",
  "offences",
  "offended",
  "offender",
  "offenders",
  "offense",
  "offenses",
  "offensive",
  "offer",
  "offered",
  "offering",
  "offerings",
  "offers",
  "office",
  "officer",
  "officers",
  "offices",
  "official",
  "officially",
  "officials",
  "offline",
  "offs",
  "offset",
  "offshore",
  "offspring",
  "often",
  "og",
  "ogden",
  "ogg",
  "oh",
  "ohio",
  "ohm",
  "oi",
  "oil",
  "oils",
  "oj",
  "ok",
  "okay",
  "oki",
  "oklahoma",
  "ol",
  "old",
  "older",
  "oldest",
  "oldham",
  "oldies",
  "oldmedline",
  "olds",
  "oldsmobile",
  "ole",
  "olive",
  "oliver",
  "olivia",
  "olivier",
  "olsen",
  "olson",
  "olympia",
  "olympic",
  "olympics",
  "olympus",
  "om",
  "omaha",
  "oman",
  "omar",
  "omb",
  "ombudsman",
  "omega",
  "omg",
  "omission",
  "omissions",
  "omit",
  "omitted",
  "omni",
  "on",
  "onboard",
  "once",
  "oncology",
  "one",
  "ones",
  "oneself",
  "ongoing",
  "onion",
  "onions",
  "online",
  "only",
  "ons",
  "onset",
  "onsite",
  "ont",
  "ontario",
  "onto",
  "ontology",
  "onwards",
  "onyx",
  "oo",
  "ooh",
  "ooo",
  "oops",
  "op",
  "opal",
  "opaque",
  "open",
  "openbsd",
  "opened",
  "opener",
  "opengl",
  "openid",
  "opening",
  "openings",
  "openly",
  "openness",
  "openoffice",
  "opens",
  "opera",
  "operate",
  "operated",
  "operates",
  "operating",
  "operation",
  "operational",
  "operations",
  "operative",
  "operator",
  "operators",
  "ophthalmology",
  "opinion",
  "opinions",
  "opp",
  "opponent",
  "opponents",
  "opportunities",
  "opportunity",
  "oppose",
  "opposed",
  "opposing",
  "opposite",
  "opposition",
  "oppression",
  "oprah",
  "ops",
  "opt",
  "opted",
  "opteron",
  "optic",
  "optical",
  "optics",
  "optimal",
  "optimisation",
  "optimism",
  "optimistic",
  "optimization",
  "optimizations",
  "optimize",
  "optimized",
  "optimizing",
  "optimum",
  "option",
  "optional",
  "optionally",
  "options",
  "opus",
  "or",
  "ora",
  "oracle",
  "oral",
  "orange",
  "orb",
  "orbit",
  "orbital",
  "orbitz",
  "orchard",
  "orchestra",
  "orchid",
  "ord",
  "order",
  "ordered",
  "ordering",
  "orders",
  "ordinance",
  "ordinances",
  "ordinary",
  "ordination",
  "ordinator",
  "ore",
  "oregon",
  "orf",
  "org",
  "organ",
  "organic",
  "organisation",
  "organisational",
  "organisations",
  "organise",
  "organised",
  "organisers",
  "organising",
  "organism",
  "organisms",
  "organization",
  "organizational",
  "organizations",
  "organize",
  "organized",
  "organizer",
  "organizers",
  "organizing",
  "organs",
  "orgasm",
  "orgasms",
  "orgies",
  "orgy",
  "orient",
  "oriental",
  "orientation",
  "oriented",
  "orig",
  "origin",
  "original",
  "originally",
  "originals",
  "originated",
  "originating",
  "originator",
  "origins",
  "orioles",
  "orion",
  "orlando",
  "orleans",
  "ornament",
  "ornamental",
  "ornaments",
  "oro",
  "orphan",
  "ors",
  "ortho",
  "orthodox",
  "orthopedic",
  "os",
  "osaka",
  "osama",
  "osborne",
  "oscar",
  "oscommerce",
  "osha",
  "oslo",
  "oss",
  "osteoporosis",
  "ostg",
  "osu",
  "osx",
  "ot",
  "otc",
  "other",
  "others",
  "otherwise",
  "otis",
  "ottawa",
  "otter",
  "otto",
  "ottoman",
  "ou",
  "ought",
  "ounce",
  "ounces",
  "our",
  "ours",
  "ourselves",
  "out",
  "outback",
  "outbound",
  "outbreak",
  "outcome",
  "outcomes",
  "outdated",
  "outdoor",
  "outdoors",
  "outer",
  "outerwear",
  "outfit",
  "outfits",
  "outfitters",
  "outgoing",
  "outing",
  "outkast",
  "outlaw",
  "outlet",
  "outlets",
  "outline",
  "outlined",
  "outlines",
  "outlook",
  "outlying",
  "outpatient",
  "outpost",
  "output",
  "outputs",
  "outrageous",
  "outreach",
  "outright",
  "outs",
  "outside",
  "outsourcing",
  "outstanding",
  "outward",
  "ov",
  "oval",
  "ovarian",
  "oven",
  "ovens",
  "over",
  "overall",
  "overcast",
  "overcome",
  "overcoming",
  "overdose",
  "overdrive",
  "overflow",
  "overhaul",
  "overhead",
  "overland",
  "overlap",
  "overlapping",
  "overlay",
  "overload",
  "overlooked",
  "overlooking",
  "overly",
  "overnight",
  "override",
  "overseas",
  "oversee",
  "oversight",
  "oversized",
  "overstock",
  "overtime",
  "overture",
  "overview",
  "overweight",
  "overwhelmed",
  "overwhelming",
  "ow",
  "owe",
  "owed",
  "owen",
  "owens",
  "owing",
  "owl",
  "owls",
  "own",
  "owned",
  "owner",
  "owners",
  "ownership",
  "owning",
  "owns",
  "ox",
  "oxford",
  "oxfordshire",
  "oxidation",
  "oxide",
  "oxley",
  "oxygen",
  "oyster",
  "oz",
  "ozone",
  "p",
  "pa",
  "pablo",
  "pac",
  "pace",
  "paced",
  "pacific",
  "pack",
  "package",
  "packaged",
  "packages",
  "packaging",
  "packard",
  "packed",
  "packers",
  "packet",
  "packets",
  "packing",
  "packs",
  "pact",
  "pad",
  "padded",
  "padding",
  "paddle",
  "paddy",
  "padres",
  "pads",
  "pagan",
  "page",
  "pager",
  "pagerank",
  "pages",
  "pagina",
  "paging",
  "paid",
  "paige",
  "pain",
  "painful",
  "pains",
  "paint",
  "paintball",
  "painted",
  "painter",
  "painters",
  "painting",
  "paintings",
  "paints",
  "pair",
  "paired",
  "pairs",
  "pak",
  "pakistan",
  "pakistani",
  "pal",
  "palace",
  "palau",
  "pale",
  "palestine",
  "palestinian",
  "palestinians",
  "palette",
  "pallet",
  "palm",
  "palma",
  "palmer",
  "palmone",
  "palms",
  "palo",
  "pals",
  "pam",
  "pamela",
  "pan",
  "panama",
  "panasonic",
  "pancreatic",
  "panda",
  "pandemic",
  "pane",
  "panel",
  "panels",
  "panic",
  "panorama",
  "panoramic",
  "pans",
  "pant",
  "pantera",
  "panther",
  "panthers",
  "pantie",
  "panties",
  "pants",
  "panty",
  "pantyhose",
  "paolo",
  "pap",
  "papa",
  "paper",
  "paperback",
  "paperbacks",
  "papers",
  "paperwork",
  "papua",
  "par",
  "para",
  "parade",
  "paradigm",
  "paradise",
  "paradox",
  "paragon",
  "paragraph",
  "paragraphs",
  "paraguay",
  "paralegal",
  "parallel",
  "param",
  "parameter",
  "parameters",
  "paramount",
  "paranoid",
  "paranormal",
  "parcel",
  "parcels",
  "pardon",
  "parent",
  "parental",
  "parentheses",
  "parenting",
  "parents",
  "parfum",
  "paris",
  "parish",
  "parity",
  "park",
  "parked",
  "parker",
  "parking",
  "parkinson",
  "parks",
  "parkway",
  "parliament",
  "parliamentary",
  "parody",
  "parole",
  "parrot",
  "parse",
  "parser",
  "parsing",
  "parsons",
  "part",
  "partial",
  "partially",
  "participant",
  "participants",
  "participate",
  "participated",
  "participates",
  "participating",
  "participation",
  "participatory",
  "particle",
  "particles",
  "particular",
  "particularly",
  "particulars",
  "particulate",
  "parties",
  "partisan",
  "partition",
  "partitioning",
  "partitions",
  "partly",
  "partner",
  "partnering",
  "partners",
  "partnership",
  "partnerships",
  "parts",
  "party",
  "pas",
  "pasadena",
  "pascal",
  "paso",
  "pass",
  "passage",
  "passages",
  "passed",
  "passenger",
  "passengers",
  "passes",
  "passing",
  "passion",
  "passionate",
  "passions",
  "passive",
  "passport",
  "password",
  "passwords",
  "past",
  "pasta",
  "paste",
  "pastel",
  "pastor",
  "pastoral",
  "pastry",
  "pasture",
  "patagonia",
  "patch",
  "patches",
  "patent",
  "patented",
  "patents",
  "paterson",
  "path",
  "pathetic",
  "pathfinder",
  "pathogens",
  "pathology",
  "paths",
  "pathway",
  "pathways",
  "patience",
  "patient",
  "patients",
  "patio",
  "patricia",
  "patrick",
  "patriot",
  "patriotic",
  "patriots",
  "patrol",
  "patron",
  "patrons",
  "pattern",
  "patterns",
  "patterson",
  "patti",
  "patton",
  "patty",
  "paul",
  "paula",
  "pauline",
  "paulo",
  "pause",
  "paved",
  "pavement",
  "pavilion",
  "paving",
  "paw",
  "pax",
  "paxil",
  "pay",
  "payable",
  "payday",
  "paying",
  "payload",
  "payment",
  "payments",
  "payne",
  "payout",
  "payouts",
  "paypal",
  "payroll",
  "pays",
  "paz",
  "pb",
  "pbs",
  "pc",
  "pcb",
  "pcg",
  "pci",
  "pcm",
  "pcmcia",
  "pcos",
  "pcr",
  "pcs",
  "pct",
  "pd",
  "pda",
  "pdas",
  "pdb",
  "pdf",
  "pdfs",
  "pdp",
  "pdt",
  "pe",
  "pea",
  "peace",
  "peaceful",
  "peach",
  "peacock",
  "peak",
  "peaks",
  "peanut",
  "peanuts",
  "pear",
  "pearce",
  "pearl",
  "pearls",
  "pearson",
  "peas",
  "peck",
  "peculiar",
  "pedal",
  "pedals",
  "pedestal",
  "pedestrian",
  "pediatric",
  "pediatrics",
  "pedigree",
  "pedro",
  "pee",
  "peeing",
  "peek",
  "peel",
  "peer",
  "peers",
  "peg",
  "pegasus",
  "pei",
  "pelican",
  "pembroke",
  "pen",
  "penalties",
  "penalty",
  "pencil",
  "pencils",
  "pendant",
  "pendants",
  "pending",
  "penetration",
  "penguin",
  "penguins",
  "peninsula",
  "penis",
  "penn",
  "pennsylvania",
  "penny",
  "pens",
  "pensacola",
  "pension",
  "pensions",
  "pentagon",
  "pentax",
  "penthouse",
  "pentium",
  "people",
  "peoples",
  "peoplesoft",
  "peoria",
  "pep",
  "pepper",
  "peppers",
  "pepsi",
  "peptide",
  "peptides",
  "per",
  "perceive",
  "perceived",
  "percent",
  "percentage",
  "percentages",
  "percentile",
  "perception",
  "perceptions",
  "percussion",
  "percy",
  "perennial",
  "perez",
  "perfect",
  "perfection",
  "perfectly",
  "perform",
  "performance",
  "performances",
  "performed",
  "performer",
  "performers",
  "performing",
  "performs",
  "perfume",
  "perfumes",
  "perhaps",
  "perimeter",
  "period",
  "periodic",
  "periodical",
  "periodically",
  "periodicals",
  "periods",
  "peripheral",
  "peripherals",
  "perkins",
  "perl",
  "permalink",
  "permanent",
  "permanently",
  "permissible",
  "permission",
  "permissions",
  "permit",
  "permits",
  "permitted",
  "permitting",
  "perpetual",
  "perry",
  "pers",
  "persecution",
  "persia",
  "persian",
  "persist",
  "persistence",
  "persistent",
  "person",
  "personal",
  "personalised",
  "personalities",
  "personality",
  "personalize",
  "personalized",
  "personally",
  "personals",
  "personnel",
  "persons",
  "perspective",
  "perspectives",
  "persuade",
  "persuasion",
  "pertaining",
  "perth",
  "pertinent",
  "peru",
  "peruvian",
  "pervasive",
  "peso",
  "pesos",
  "pest",
  "pesticide",
  "pesticides",
  "pests",
  "pet",
  "pete",
  "peter",
  "peterborough",
  "peters",
  "petersburg",
  "petersen",
  "peterson",
  "petit",
  "petite",
  "petition",
  "petitioner",
  "petitions",
  "petrol",
  "petroleum",
  "pets",
  "petty",
  "peugeot",
  "pewter",
  "pf",
  "pfc",
  "pfizer",
  "pg",
  "pga",
  "pgp",
  "pgsql",
  "ph",
  "phantom",
  "phantomnode",
  "pharma",
  "pharmaceutical",
  "pharmaceuticals",
  "pharmacies",
  "pharmacist",
  "pharmacists",
  "pharmacology",
  "pharmacy",
  "phase",
  "phases",
  "phat",
  "phd",
  "phe",
  "phelps",
  "phenomena",
  "phenomenon",
  "phenotype",
  "phentermine",
  "phi",
  "phil",
  "philadelphia",
  "philanthropy",
  "philip",
  "philippe",
  "philippine",
  "philippines",
  "philips",
  "phillies",
  "phillip",
  "phillips",
  "philly",
  "philosopher",
  "philosophers",
  "philosophical",
  "philosophy",
  "phishing",
  "phoenix",
  "phone",
  "phonephone",
  "phones",
  "phosphate",
  "phosphorus",
  "phosphorylation",
  "photo",
  "photograph",
  "photographed",
  "photographer",
  "photographers",
  "photographic",
  "photographs",
  "photography",
  "photon",
  "photos",
  "photoshop",
  "photosmart",
  "php",
  "phpbb",
  "phrase",
  "phrases",
  "phs",
  "phuket",
  "phyllis",
  "phys",
  "physical",
  "physically",
  "physician",
  "physicians",
  "physics",
  "physiol",
  "physiological",
  "physiology",
  "physiopathology",
  "pi",
  "pianist",
  "piano",
  "piazza",
  "pic",
  "picasso",
  "pichunter",
  "pick",
  "picked",
  "picking",
  "picks",
  "pickup",
  "picnic",
  "pics",
  "pictorial",
  "picture",
  "pictured",
  "pictures",
  "picturesque",
  "pid",
  "pie",
  "piece",
  "pieces",
  "piedmont",
  "pier",
  "pierce",
  "pierced",
  "piercing",
  "pierre",
  "pies",
  "pig",
  "pigeon",
  "pigment",
  "pigs",
  "pike",
  "pilates",
  "pile",
  "piles",
  "pilgrim",
  "pill",
  "pillar",
  "pillars",
  "pillow",
  "pillows",
  "pills",
  "pilot",
  "pilots",
  "pim",
  "pimp",
  "pin",
  "pinball",
  "pinch",
  "pine",
  "pineapple",
  "pines",
  "ping",
  "pink",
  "pinkworld",
  "pinnacle",
  "pins",
  "pint",
  "pioneer",
  "pioneering",
  "pioneers",
  "pipe",
  "pipeline",
  "pipelines",
  "piper",
  "pipes",
  "piping",
  "piracy",
  "pirate",
  "pirates",
  "piss",
  "pissed",
  "pissing",
  "pistol",
  "pistols",
  "piston",
  "pistons",
  "pit",
  "pitbull",
  "pitcairn",
  "pitch",
  "pitched",
  "pitcher",
  "pitching",
  "pits",
  "pitt",
  "pittsburgh",
  "pity",
  "pivot",
  "pix",
  "pixar",
  "pixel",
  "pixels",
  "pixmania",
  "pizza",
  "pj",
  "pk",
  "pkg",
  "pl",
  "place",
  "placebo",
  "placed",
  "placement",
  "placements",
  "places",
  "placing",
  "plague",
  "plaid",
  "plain",
  "plains",
  "plaintiff",
  "plaintiffs",
  "plan",
  "planar",
  "plane",
  "planes",
  "planet",
  "planetary",
  "planets",
  "planned",
  "planner",
  "planners",
  "planning",
  "plano",
  "plans",
  "plant",
  "plantation",
  "planted",
  "planting",
  "plantronics",
  "plants",
  "plaque",
  "plaques",
  "plasma",
  "plaster",
  "plastic",
  "plastics",
  "plat",
  "plate",
  "plateau",
  "plated",
  "plates",
  "platform",
  "platforms",
  "platinum",
  "plato",
  "plausible",
  "play",
  "playa",
  "playback",
  "playboy",
  "played",
  "player",
  "players",
  "playful",
  "playground",
  "playhouse",
  "playing",
  "playlist",
  "playlists",
  "playoff",
  "playoffs",
  "plays",
  "playstation",
  "plaza",
  "plc",
  "plea",
  "pleasant",
  "please",
  "pleased",
  "pleasing",
  "pleasure",
  "pleasures",
  "pledge",
  "pledged",
  "plenary",
  "plenty",
  "plone",
  "plot",
  "plots",
  "plotting",
  "pls",
  "plug",
  "plugged",
  "plugin",
  "plugins",
  "plugs",
  "plum",
  "plumbers",
  "plumbing",
  "plump",
  "plunge",
  "plural",
  "plus",
  "plush",
  "pluto",
  "ply",
  "plymouth",
  "plz",
  "pm",
  "pmc",
  "pmid",
  "pms",
  "pn",
  "pneumatic",
  "pneumonia",
  "png",
  "po",
  "pocket",
  "pocketpc",
  "pockets",
  "pod",
  "podcast",
  "podcasting",
  "podcasts",
  "poe",
  "poem",
  "poems",
  "poet",
  "poetic",
  "poetry",
  "poets",
  "pogo",
  "point",
  "pointe",
  "pointed",
  "pointer",
  "pointers",
  "pointing",
  "pointless",
  "points",
  "poised",
  "poison",
  "poisoning",
  "pokemon",
  "poker",
  "pol",
  "poland",
  "polar",
  "polarization",
  "polarized",
  "polaroid",
  "pole",
  "poles",
  "police",
  "policies",
  "policing",
  "policy",
  "polish",
  "polished",
  "polishing",
  "polite",
  "political",
  "politically",
  "politician",
  "politicians",
  "politics",
  "polk",
  "poll",
  "pollen",
  "polling",
  "polls",
  "pollutant",
  "pollutants",
  "pollution",
  "polly",
  "polo",
  "polski",
  "poly",
  "polyester",
  "polymer",
  "polymerase",
  "polymers",
  "polynesia",
  "polynomial",
  "polyphonic",
  "polytechnic",
  "pond",
  "ponds",
  "pong",
  "pontiac",
  "pony",
  "pooh",
  "pool",
  "poole",
  "pools",
  "poor",
  "poorest",
  "poorly",
  "pop",
  "popcorn",
  "pope",
  "popped",
  "poppy",
  "pops",
  "popular",
  "popularity",
  "populated",
  "population",
  "populations",
  "popup",
  "por",
  "porcelain",
  "porch",
  "pork",
  "porn",
  "porno",
  "pornography",
  "pornstar",
  "pornstars",
  "porsche",
  "port",
  "portability",
  "portable",
  "portage",
  "portal",
  "portals",
  "porter",
  "portfolio",
  "portfolios",
  "portion",
  "portions",
  "portland",
  "porto",
  "portrait",
  "portraits",
  "portrayed",
  "ports",
  "portsmouth",
  "portugal",
  "portuguese",
  "pos",
  "pose",
  "posed",
  "poses",
  "posing",
  "position",
  "positioned",
  "positioning",
  "positions",
  "positive",
  "positively",
  "positives",
  "posix",
  "possess",
  "possessed",
  "possesses",
  "possession",
  "possessions",
  "possibilities",
  "possibility",
  "possible",
  "possibly",
  "post",
  "postage",
  "postal",
  "postcard",
  "postcards",
  "postcode",
  "posted",
  "poster",
  "posterior",
  "posters",
  "postfix",
  "postgraduate",
  "postgresql",
  "posting",
  "postings",
  "postnuke",
  "postponed",
  "postposted",
  "posts",
  "postscript",
  "posture",
  "pot",
  "potassium",
  "potato",
  "potatoes",
  "potent",
  "potential",
  "potentially",
  "potentials",
  "pots",
  "potter",
  "pottery",
  "pouch",
  "poultry",
  "pound",
  "pounding",
  "pounds",
  "pour",
  "poured",
  "pouring",
  "poverty",
  "pow",
  "powder",
  "powell",
  "power",
  "powerbook",
  "powered",
  "powerful",
  "powerpc",
  "powerpoint",
  "powers",
  "powerseller",
  "powershot",
  "poy",
  "pp",
  "ppc",
  "ppl",
  "ppm",
  "ppp",
  "pps",
  "ppt",
  "pq",
  "pr",
  "prac",
  "practicable",
  "practical",
  "practically",
  "practice",
  "practiced",
  "practices",
  "practicing",
  "practise",
  "practitioner",
  "practitioners",
  "prada",
  "pradesh",
  "pragmatic",
  "prague",
  "prairie",
  "praise",
  "praised",
  "pratt",
  "pray",
  "prayer",
  "prayers",
  "praying",
  "prc",
  "pre",
  "preacher",
  "preaching",
  "precautions",
  "preceded",
  "precedence",
  "precedent",
  "preceding",
  "precinct",
  "precious",
  "precipitation",
  "precise",
  "precisely",
  "precision",
  "precursor",
  "predator",
  "predators",
  "predecessor",
  "predicate",
  "predict",
  "predictable",
  "predicted",
  "predicting",
  "prediction",
  "predictions",
  "predictive",
  "predicts",
  "predominantly",
  "preface",
  "prefer",
  "preferable",
  "preferably",
  "preference",
  "preferences",
  "preferred",
  "prefers",
  "prefix",
  "pregnancy",
  "pregnant",
  "prejudice",
  "preliminary",
  "prelude",
  "premature",
  "premier",
  "premiere",
  "premiership",
  "premise",
  "premises",
  "premium",
  "premiums",
  "prenatal",
  "prentice",
  "prep",
  "prepaid",
  "preparation",
  "preparations",
  "preparatory",
  "prepare",
  "prepared",
  "preparedness",
  "prepares",
  "preparing",
  "prerequisite",
  "prerequisites",
  "pres",
  "presario",
  "presbyterian",
  "preschool",
  "prescott",
  "prescribe",
  "prescribed",
  "prescribing",
  "prescription",
  "prescriptions",
  "presence",
  "present",
  "presentation",
  "presentations",
  "presented",
  "presenter",
  "presenters",
  "presenting",
  "presently",
  "presents",
  "preservation",
  "preserve",
  "preserved",
  "preserves",
  "preserving",
  "preset",
  "presidency",
  "president",
  "presidential",
  "presidents",
  "presiding",
  "presley",
  "press",
  "pressed",
  "presses",
  "pressing",
  "pressure",
  "pressures",
  "prestige",
  "prestigious",
  "preston",
  "presumably",
  "presumed",
  "preteen",
  "pretend",
  "pretoria",
  "pretty",
  "prev",
  "prevail",
  "prevailing",
  "prevalence",
  "prevalent",
  "prevent",
  "prevented",
  "preventing",
  "prevention",
  "preventive",
  "prevents",
  "preview",
  "previews",
  "previous",
  "previously",
  "prey",
  "pri",
  "price",
  "priced",
  "pricegrabber",
  "pricerunner",
  "prices",
  "pricetool",
  "pricing",
  "pride",
  "priest",
  "priests",
  "prima",
  "primarily",
  "primary",
  "prime",
  "primer",
  "primitive",
  "prince",
  "princes",
  "princess",
  "princeton",
  "principal",
  "principally",
  "principals",
  "principe",
  "principle",
  "principles",
  "print",
  "printable",
  "printed",
  "printer",
  "printers",
  "printf",
  "printing",
  "printprinter",
  "prints",
  "prior",
  "priorities",
  "priority",
  "prism",
  "prison",
  "prisoner",
  "prisoners",
  "prisons",
  "pristine",
  "privacy",
  "privat",
  "private",
  "privately",
  "privatization",
  "privilege",
  "privileged",
  "privileges",
  "prix",
  "prize",
  "prizes",
  "pro",
  "proactive",
  "prob",
  "probabilities",
  "probability",
  "probable",
  "probably",
  "probate",
  "probation",
  "probe",
  "probes",
  "probing",
  "problem",
  "problematic",
  "problems",
  "proc",
  "procedural",
  "procedure",
  "procedures",
  "proceed",
  "proceeded",
  "proceeding",
  "proceedings",
  "proceeds",
  "process",
  "processed",
  "processes",
  "processing",
  "processor",
  "processors",
  "proclaimed",
  "procurement",
  "prod",
  "produce",
  "produced",
  "producer",
  "producers",
  "produces",
  "producing",
  "product",
  "production",
  "productions",
  "productive",
  "productivity",
  "products",
  "prof",
  "profession",
  "professional",
  "professionalism",
  "professionally",
  "professionals",
  "professions",
  "professor",
  "professors",
  "proficiency",
  "proficient",
  "profile",
  "profileprofile",
  "profiles",
  "profiling",
  "profit",
  "profitability",
  "profitable",
  "profits",
  "profound",
  "prog",
  "prognosis",
  "program",
  "programmable",
  "programme",
  "programmed",
  "programmer",
  "programmers",
  "programmes",
  "programming",
  "programs",
  "progress",
  "progression",
  "progressive",
  "prohibit",
  "prohibited",
  "prohibition",
  "prohibits",
  "project",
  "projected",
  "projection",
  "projections",
  "projector",
  "projectors",
  "projects",
  "proliant",
  "proliferation",
  "prolonged",
  "prolyte",
  "prom",
  "prominent",
  "promise",
  "promised",
  "promises",
  "promising",
  "promo",
  "promote",
  "promoted",
  "promoter",
  "promoters",
  "promotes",
  "promoting",
  "promotion",
  "promotional",
  "promotions",
  "prompt",
  "prompted",
  "promptly",
  "prompts",
  "prone",
  "pronounced",
  "pronunciation",
  "proof",
  "proofs",
  "prop",
  "propaganda",
  "propagation",
  "propane",
  "propecia",
  "proper",
  "properly",
  "properties",
  "property",
  "prophecy",
  "prophet",
  "prophets",
  "proportion",
  "proportional",
  "proportions",
  "proposal",
  "proposals",
  "propose",
  "proposed",
  "proposes",
  "proposing",
  "proposition",
  "proprietary",
  "props",
  "propulsion",
  "proquest",
  "pros",
  "prose",
  "prosecution",
  "prosecutor",
  "prosecutors",
  "prospect",
  "prospective",
  "prospects",
  "prospectus",
  "prosperity",
  "prostate",
  "prostitution",
  "prostores",
  "prot",
  "protect",
  "protected",
  "protecting",
  "protection",
  "protections",
  "protective",
  "protector",
  "protectors",
  "protects",
  "protein",
  "proteins",
  "protest",
  "protestant",
  "protesters",
  "protests",
  "proto",
  "protocol",
  "protocols",
  "proton",
  "prototype",
  "prototypes",
  "proud",
  "proudly",
  "prov",
  "prove",
  "proved",
  "proven",
  "provence",
  "proverbs",
  "proves",
  "provide",
  "provided",
  "providence",
  "provider",
  "providers",
  "provides",
  "providing",
  "province",
  "provinces",
  "provincial",
  "proving",
  "provision",
  "provisional",
  "provisioning",
  "provisions",
  "provost",
  "proximity",
  "proxy",
  "prozac",
  "prudent",
  "prudential",
  "prweb",
  "ps",
  "psa",
  "psalm",
  "psalms",
  "psc",
  "pseudo",
  "psi",
  "psp",
  "pst",
  "psu",
  "psy",
  "psychiatric",
  "psychiatry",
  "psychic",
  "psycho",
  "psychological",
  "psychologist",
  "psychologists",
  "psychology",
  "psychotherapy",
  "pt",
  "pta",
  "pte",
  "ptr",
  "pts",
  "pty",
  "pu",
  "pub",
  "publ",
  "public",
  "publication",
  "publications",
  "publicity",
  "publicly",
  "publish",
  "published",
  "publisher",
  "publishers",
  "publishes",
  "publishing",
  "pubmed",
  "pubs",
  "pudding",
  "pueblo",
  "puerto",
  "puff",
  "puffy",
  "pull",
  "pulled",
  "pulling",
  "pulls",
  "pulmonary",
  "pulp",
  "pulse",
  "pulses",
  "puma",
  "pump",
  "pumped",
  "pumping",
  "pumpkin",
  "pumps",
  "punch",
  "punctuation",
  "pundit",
  "punish",
  "punished",
  "punishment",
  "punjab",
  "punk",
  "punt",
  "punta",
  "pupil",
  "pupils",
  "puppet",
  "puppets",
  "puppies",
  "puppy",
  "purchase",
  "purchased",
  "purchaser",
  "purchases",
  "purchasing",
  "purdue",
  "pure",
  "purely",
  "purification",
  "purified",
  "purifier",
  "purity",
  "purple",
  "purpose",
  "purposes",
  "purse",
  "purses",
  "pursuant",
  "pursue",
  "pursued",
  "pursuing",
  "pursuit",
  "push",
  "pushed",
  "pushes",
  "pushing",
  "pussies",
  "pussy",
  "pussycat",
  "put",
  "putative",
  "putin",
  "putnam",
  "puts",
  "putting",
  "puzzle",
  "puzzles",
  "pv",
  "pvc",
  "pvt",
  "pw",
  "px",
  "py",
  "pyramid",
  "python",
  "q",
  "qa",
  "qaeda",
  "qatar",
  "qb",
  "qc",
  "qd",
  "qi",
  "qld",
  "qos",
  "qq",
  "qr",
  "qt",
  "qtr",
  "qty",
  "quad",
  "quake",
  "qualification",
  "qualifications",
  "qualified",
  "qualifier",
  "qualifies",
  "qualify",
  "qualifying",
  "qualitative",
  "qualities",
  "quality",
  "quan",
  "quantitative",
  "quantities",
  "quantity",
  "quantum",
  "quark",
  "quarry",
  "quart",
  "quarter",
  "quarterback",
  "quarterly",
  "quarters",
  "quartet",
  "quartz",
  "quasi",
  "quay",
  "que",
  "quebec",
  "queen",
  "queens",
  "queensland",
  "queer",
  "queries",
  "query",
  "quest",
  "question",
  "questionable",
  "questioned",
  "questioning",
  "questionnaire",
  "questionnaires",
  "questions",
  "queue",
  "qui",
  "quick",
  "quickbooks",
  "quickcheck",
  "quicker",
  "quickly",
  "quicktime",
  "quiet",
  "quietly",
  "quilt",
  "quilting",
  "quilts",
  "quincy",
  "quinn",
  "quinta",
  "quit",
  "quite",
  "quiz",
  "quizzes",
  "quo",
  "quorum",
  "quot",
  "quota",
  "quotation",
  "quotations",
  "quote",
  "quoted",
  "quotes",
  "quoting",
  "qwest",
  "r",
  "ra",
  "rabbi",
  "rabbit",
  "rabbits",
  "rac",
  "race",
  "racer",
  "races",
  "rachel",
  "racial",
  "racing",
  "racism",
  "racist",
  "rack",
  "racks",
  "rad",
  "radar",
  "radeon",
  "radial",
  "radiant",
  "radiation",
  "radiator",
  "radical",
  "radio",
  "radioactive",
  "radiohead",
  "radiology",
  "radios",
  "radisson",
  "radius",
  "rae",
  "raf",
  "rafael",
  "rafting",
  "rag",
  "rage",
  "raging",
  "rai",
  "raid",
  "raider",
  "raiders",
  "rail",
  "railroad",
  "rails",
  "railway",
  "railways",
  "rain",
  "rainbow",
  "rainfall",
  "rainforest",
  "rains",
  "rainy",
  "raise",
  "raised",
  "raises",
  "raising",
  "rajasthan",
  "rake",
  "raleigh",
  "rally",
  "ralph",
  "ram",
  "rama",
  "ramada",
  "ramblings",
  "rammstein",
  "ramon",
  "ramones",
  "ramp",
  "ramps",
  "rams",
  "ramsey",
  "ran",
  "ranch",
  "rancho",
  "rand",
  "randall",
  "randolph",
  "random",
  "randomized",
  "randomly",
  "randy",
  "rang",
  "range",
  "ranged",
  "ranger",
  "rangers",
  "ranges",
  "ranging",
  "rank",
  "ranked",
  "ranking",
  "rankings",
  "ranks",
  "rant",
  "rants",
  "rao",
  "rap",
  "rape",
  "raped",
  "raphael",
  "rapid",
  "rapidly",
  "rapids",
  "rare",
  "rarely",
  "ras",
  "rash",
  "raspberry",
  "rat",
  "rate",
  "rated",
  "rates",
  "rather",
  "ratification",
  "rating",
  "ratings",
  "ratio",
  "rational",
  "rationale",
  "ratios",
  "raton",
  "rats",
  "rave",
  "raven",
  "ravens",
  "raw",
  "ray",
  "raymond",
  "rays",
  "razor",
  "razr",
  "rb",
  "rbi",
  "rc",
  "rca",
  "rcs",
  "rcw",
  "rd",
  "rdf",
  "re",
  "rea",
  "reach",
  "reached",
  "reaches",
  "reaching",
  "react",
  "reaction",
  "reactions",
  "reactive",
  "reactor",
  "read",
  "readable",
  "reader",
  "readers",
  "readily",
  "readiness",
  "reading",
  "readings",
  "readme",
  "reads",
  "ready",
  "reagan",
  "real",
  "realise",
  "realised",
  "realism",
  "realistic",
  "realities",
  "reality",
  "realization",
  "realize",
  "realized",
  "realizing",
  "really",
  "realm",
  "realms",
  "realtime",
  "realtones",
  "realtor",
  "realtors",
  "realty",
  "reap",
  "rear",
  "reason",
  "reasonable",
  "reasonably",
  "reasoning",
  "reasons",
  "rebate",
  "rebates",
  "rebecca",
  "rebel",
  "rebellion",
  "rebels",
  "reboot",
  "rebound",
  "rebounds",
  "rebuild",
  "rebuilding",
  "rebuilt",
  "rec",
  "recall",
  "recalled",
  "recalls",
  "recap",
  "receipt",
  "receipts",
  "receivable",
  "receive",
  "received",
  "receiver",
  "receivers",
  "receives",
  "receiving",
  "recent",
  "recently",
  "reception",
  "receptor",
  "receptors",
  "recess",
  "recession",
  "recharge",
  "rechargeable",
  "recherche",
  "recipe",
  "recipes",
  "recipient",
  "recipients",
  "reciprocal",
  "reclamation",
  "recognise",
  "recognised",
  "recognition",
  "recognize",
  "recognized",
  "recognizes",
  "recognizing",
  "recombinant",
  "recommend",
  "recommendation",
  "recommendations",
  "recommended",
  "recommending",
  "recommends",
  "recon",
  "reconciliation",
  "reconditioned",
  "reconstruction",
  "record",
  "recorded",
  "recorder",
  "recorders",
  "recording",
  "recordings",
  "records",
  "recover",
  "recovered",
  "recovering",
  "recovery",
  "recreation",
  "recreational",
  "recruit",
  "recruited",
  "recruiter",
  "recruiters",
  "recruiting",
  "recruitment",
  "recruits",
  "rectal",
  "rectangle",
  "rectangular",
  "recurrence",
  "recurrent",
  "recurring",
  "recursive",
  "recycle",
  "recycled",
  "recycling",
  "red",
  "redeem",
  "redemption",
  "redesign",
  "redevelopment",
  "redhat",
  "redhead",
  "redirect",
  "redirected",
  "redistribute",
  "redistributed",
  "redistribution",
  "redmond",
  "reds",
  "redskins",
  "reduce",
  "reduced",
  "reduces",
  "reducing",
  "reduction",
  "reductions",
  "redundancy",
  "redundant",
  "redwood",
  "reebok",
  "reed",
  "reef",
  "reel",
  "reels",
  "reese",
  "reeves",
  "ref",
  "refer",
  "referee",
  "reference",
  "referenced",
  "references",
  "referendum",
  "referral",
  "referrals",
  "referred",
  "referring",
  "refers",
  "refill",
  "refills",
  "refinance",
  "refinancing",
  "refine",
  "refined",
  "refinement",
  "refining",
  "reflect",
  "reflected",
  "reflecting",
  "reflection",
  "reflections",
  "reflective",
  "reflector",
  "reflects",
  "reflex",
  "reform",
  "reformed",
  "reforms",
  "refrain",
  "refresh",
  "refreshing",
  "refrigeration",
  "refrigerator",
  "refrigerators",
  "refuge",
  "refugee",
  "refugees",
  "refund",
  "refundable",
  "refunds",
  "refurbished",
  "refusal",
  "refuse",
  "refused",
  "refuses",
  "refusing",
  "reg",
  "regain",
  "regal",
  "regard",
  "regarded",
  "regarding",
  "regardless",
  "regards",
  "reged",
  "regency",
  "regeneration",
  "regent",
  "regents",
  "reggae",
  "regime",
  "regimen",
  "regiment",
  "regimes",
  "regina",
  "region",
  "regional",
  "regions",
  "regis",
  "register",
  "registered",
  "registering",
  "registerregister",
  "registers",
  "registrant",
  "registrar",
  "registration",
  "registrations",
  "registry",
  "regression",
  "regret",
  "regs",
  "regular",
  "regularly",
  "regulate",
  "regulated",
  "regulating",
  "regulation",
  "regulations",
  "regulator",
  "regulators",
  "regulatory",
  "rehab",
  "rehabilitation",
  "rehearsal",
  "rei",
  "reich",
  "reid",
  "reign",
  "reiki",
  "reilly",
  "reimbursement",
  "reinforce",
  "reinforced",
  "reinforcement",
  "reits",
  "reject",
  "rejected",
  "rejection",
  "rejects",
  "rel",
  "relate",
  "related",
  "relates",
  "relating",
  "relation",
  "relational",
  "relations",
  "relationship",
  "relationships",
  "relative",
  "relatively",
  "relatives",
  "relativity",
  "relax",
  "relaxation",
  "relaxed",
  "relaxing",
  "relay",
  "relays",
  "release",
  "released",
  "releases",
  "releasing",
  "relevance",
  "relevant",
  "reliability",
  "reliable",
  "reliably",
  "reliance",
  "relied",
  "relief",
  "relies",
  "relieve",
  "relieved",
  "religion",
  "religions",
  "religious",
  "reload",
  "relocate",
  "relocating",
  "relocation",
  "reluctant",
  "rely",
  "relying",
  "rem",
  "remain",
  "remainder",
  "remained",
  "remaining",
  "remains",
  "remake",
  "remark",
  "remarkable",
  "remarkably",
  "remarked",
  "remarks",
  "remedial",
  "remediation",
  "remedies",
  "remedy",
  "remember",
  "remembered",
  "remembering",
  "remembers",
  "remembrance",
  "remind",
  "reminded",
  "reminder",
  "reminders",
  "reminds",
  "remington",
  "remix",
  "remodeling",
  "remortgage",
  "remote",
  "remotely",
  "removable",
  "removal",
  "remove",
  "removed",
  "remover",
  "removes",
  "removing",
  "remuneration",
  "ren",
  "renaissance",
  "renal",
  "rename",
  "renamed",
  "renault",
  "render",
  "rendered",
  "rendering",
  "renders",
  "rene",
  "renee",
  "renew",
  "renewable",
  "renewal",
  "renewed",
  "reno",
  "renovated",
  "renovation",
  "renovations",
  "renowned",
  "rent",
  "rental",
  "rentals",
  "rented",
  "renting",
  "rents",
  "reorganization",
  "rep",
  "repair",
  "repaired",
  "repairing",
  "repairs",
  "repay",
  "repayment",
  "repeal",
  "repealed",
  "repeat",
  "repeated",
  "repeatedly",
  "repeating",
  "repeats",
  "repec",
  "repertoire",
  "repetition",
  "repetitive",
  "replace",
  "replaced",
  "replacement",
  "replacements",
  "replaces",
  "replacing",
  "replay",
  "replica",
  "replication",
  "replied",
  "replies",
  "reply",
  "report",
  "reported",
  "reportedly",
  "reporter",
  "reporters",
  "reporting",
  "reports",
  "repository",
  "represent",
  "representation",
  "representations",
  "representative",
  "representatives",
  "represented",
  "representing",
  "represents",
  "reprint",
  "reprinted",
  "reprints",
  "reproduce",
  "reproduced",
  "reproduction",
  "reproductions",
  "reproductive",
  "reps",
  "reptiles",
  "republic",
  "republican",
  "republicans",
  "reputable",
  "reputation",
  "req",
  "request",
  "requested",
  "requesting",
  "requests",
  "require",
  "required",
  "requirement",
  "requirements",
  "requires",
  "requiring",
  "requisite",
  "res",
  "resale",
  "rescue",
  "rescued",
  "research",
  "researched",
  "researcher",
  "researchers",
  "researching",
  "reseller",
  "resellers",
  "resemble",
  "reservation",
  "reservations",
  "reserve",
  "reserveamerica",
  "reserved",
  "reserves",
  "reservoir",
  "reset",
  "resets",
  "reside",
  "residence",
  "residences",
  "residency",
  "resident",
  "residential",
  "residents",
  "resides",
  "residing",
  "residual",
  "residue",
  "residues",
  "resign",
  "resignation",
  "resigned",
  "resin",
  "resist",
  "resistance",
  "resistant",
  "resistor",
  "resize",
  "resolution",
  "resolutions",
  "resolve",
  "resolved",
  "resolving",
  "resonance",
  "resort",
  "resorts",
  "resource",
  "resources",
  "resp",
  "respect",
  "respected",
  "respectful",
  "respectfully",
  "respecting",
  "respective",
  "respectively",
  "respects",
  "respiratory",
  "respond",
  "responded",
  "respondent",
  "respondents",
  "responding",
  "responds",
  "response",
  "responses",
  "responsibilities",
  "responsibility",
  "responsible",
  "responsive",
  "rest",
  "restart",
  "restaurant",
  "restaurants",
  "resting",
  "restless",
  "restoration",
  "restore",
  "restored",
  "restoring",
  "restraint",
  "restrict",
  "restricted",
  "restricting",
  "restriction",
  "restrictions",
  "restrictive",
  "restructuring",
  "rests",
  "result",
  "resulted",
  "resulting",
  "results",
  "resume",
  "resumed",
  "resumes",
  "resurrection",
  "ret",
  "retail",
  "retailer",
  "retailers",
  "retailing",
  "retain",
  "retained",
  "retaining",
  "retains",
  "retardation",
  "retention",
  "retire",
  "retired",
  "retirement",
  "retiring",
  "retractable",
  "retreat",
  "retreats",
  "retrieval",
  "retrieve",
  "retrieved",
  "retriever",
  "retrieving",
  "retro",
  "retrospective",
  "return",
  "returned",
  "returning",
  "returns",
  "reunion",
  "reusable",
  "reuse",
  "reuters",
  "rev",
  "reveal",
  "revealed",
  "revealing",
  "reveals",
  "revelation",
  "revenge",
  "revenue",
  "revenues",
  "reverend",
  "reversal",
  "reverse",
  "reversed",
  "reversible",
  "reverted",
  "review",
  "reviewed",
  "reviewer",
  "reviewers",
  "reviewing",
  "reviews",
  "revise",
  "revised",
  "revision",
  "revisions",
  "revisited",
  "revival",
  "revocation",
  "revoked",
  "revolt",
  "revolution",
  "revolutionary",
  "revolving",
  "reward",
  "rewarded",
  "rewarding",
  "rewards",
  "rewrite",
  "rewritten",
  "rex",
  "rey",
  "reyes",
  "reynolds",
  "rf",
  "rfc",
  "rfid",
  "rfp",
  "rg",
  "rgb",
  "rh",
  "rhapsody",
  "rhetoric",
  "rheumatoid",
  "rhino",
  "rhode",
  "rhodes",
  "rhymes",
  "rhythm",
  "rhythms",
  "ri",
  "rib",
  "ribbon",
  "ribbons",
  "ribosomal",
  "ribs",
  "ric",
  "rica",
  "rican",
  "ricardo",
  "rice",
  "rich",
  "richard",
  "richards",
  "richardson",
  "richer",
  "riches",
  "richest",
  "richie",
  "richland",
  "richmond",
  "richter",
  "rick",
  "ricky",
  "rico",
  "ricoh",
  "rid",
  "riddle",
  "ride",
  "rider",
  "riders",
  "rides",
  "ridge",
  "ridiculous",
  "riding",
  "rifle",
  "rifles",
  "rig",
  "right",
  "righteous",
  "righteousness",
  "rightly",
  "rights",
  "rigid",
  "rigorous",
  "rihanna",
  "riley",
  "rim",
  "rims",
  "ring",
  "ringer",
  "ringing",
  "rings",
  "ringtone",
  "ringtones",
  "rinse",
  "rio",
  "riot",
  "rip",
  "ripe",
  "ripencc",
  "ripley",
  "ripped",
  "ripper",
  "rise",
  "risen",
  "rises",
  "rising",
  "risk",
  "risks",
  "risky",
  "rita",
  "ritchie",
  "rite",
  "ritual",
  "rituals",
  "ritz",
  "rival",
  "rivals",
  "river",
  "rivera",
  "rivers",
  "riverside",
  "riviera",
  "rj",
  "rk",
  "rl",
  "rm",
  "rms",
  "rn",
  "rna",
  "ro",
  "roach",
  "road",
  "roadmap",
  "roads",
  "roadside",
  "roadway",
  "roaming",
  "roanoke",
  "roast",
  "roasted",
  "robbery",
  "robbie",
  "robbins",
  "robe",
  "robert",
  "roberto",
  "roberts",
  "robertson",
  "robin",
  "robinson",
  "robot",
  "robotic",
  "robotics",
  "robots",
  "robust",
  "roc",
  "roche",
  "rochester",
  "rock",
  "rocker",
  "rocket",
  "rockets",
  "rockford",
  "rockies",
  "rockin",
  "rocking",
  "rockport",
  "rocks",
  "rockville",
  "rockwell",
  "rocky",
  "rod",
  "rode",
  "rodeo",
  "rodgers",
  "rodney",
  "rodriguez",
  "rods",
  "roe",
  "roger",
  "rogers",
  "rogue",
  "roi",
  "roland",
  "role",
  "roles",
  "rolex",
  "roll",
  "rolled",
  "roller",
  "rollers",
  "rolling",
  "rollover",
  "rolls",
  "rom",
  "roma",
  "roman",
  "romance",
  "romania",
  "romanian",
  "romans",
  "romantic",
  "rome",
  "romeo",
  "roms",
  "ronald",
  "ronnie",
  "roof",
  "roofing",
  "rookie",
  "room",
  "roommate",
  "roommates",
  "rooms",
  "roosevelt",
  "root",
  "rooted",
  "roots",
  "rope",
  "ropes",
  "ros",
  "rosa",
  "rose",
  "rosemary",
  "rosen",
  "rosenberg",
  "roses",
  "rosie",
  "ross",
  "rossi",
  "roster",
  "roswell",
  "rot",
  "rotary",
  "rotate",
  "rotating",
  "rotation",
  "roth",
  "rotor",
  "rotten",
  "rotterdam",
  "rouge",
  "rough",
  "roughly",
  "roulette",
  "round",
  "rounded",
  "rounding",
  "rounds",
  "roundtable",
  "roundup",
  "route",
  "routed",
  "router",
  "routers",
  "routes",
  "routine",
  "routinely",
  "routines",
  "routing",
  "rove",
  "rover",
  "row",
  "rowan",
  "rowe",
  "rowing",
  "rowling",
  "rows",
  "roxy",
  "roy",
  "royal",
  "royale",
  "royals",
  "royalties",
  "royalty",
  "royce",
  "rp",
  "rpc",
  "rpg",
  "rpm",
  "rr",
  "rrp",
  "rs",
  "rsa",
  "rss",
  "rsvp",
  "rt",
  "rtf",
  "rts",
  "ru",
  "rub",
  "rubber",
  "rubbing",
  "rubbish",
  "rubin",
  "ruby",
  "rude",
  "rudolph",
  "rudy",
  "rue",
  "rug",
  "rugby",
  "rugged",
  "rugs",
  "ruin",
  "ruined",
  "ruins",
  "rule",
  "ruled",
  "rulemaking",
  "ruler",
  "rulers",
  "rules",
  "ruling",
  "rulings",
  "rum",
  "rumble",
  "rumor",
  "rumors",
  "rumsfeld",
  "run",
  "runaway",
  "runner",
  "runners",
  "running",
  "runoff",
  "runs",
  "runtime",
  "runway",
  "rupee",
  "rupert",
  "rural",
  "rus",
  "rush",
  "rushed",
  "rushing",
  "russ",
  "russell",
  "russia",
  "russian",
  "russians",
  "rust",
  "rustic",
  "rusty",
  "rutgers",
  "ruth",
  "rutherford",
  "rutland",
  "rv",
  "rw",
  "rwanda",
  "rx",
  "ry",
  "ryder",
  "rye",
  "s",
  "sa",
  "saab",
  "sabbath",
  "sac",
  "sack",
  "sacks",
  "sacramento",
  "sacred",
  "sacrifice",
  "sad",
  "saddam",
  "saddle",
  "sadly",
  "sadness",
  "safari",
  "safaris",
  "safe",
  "safeguard",
  "safeguards",
  "safely",
  "safer",
  "safety",
  "saga",
  "sage",
  "sagem",
  "sahara",
  "said",
  "sail",
  "sailing",
  "sailor",
  "sailors",
  "saint",
  "saints",
  "sakai",
  "sake",
  "sal",
  "salad",
  "salads",
  "salaries",
  "salary",
  "sale",
  "salem",
  "sales",
  "saline",
  "salisbury",
  "sally",
  "salmon",
  "salomon",
  "salon",
  "salons",
  "saloon",
  "salsa",
  "salt",
  "salts",
  "saltwater",
  "salute",
  "salvador",
  "salvage",
  "salvation",
  "salzburg",
  "samantha",
  "samba",
  "same",
  "sammy",
  "samoa",
  "sample",
  "sampled",
  "sampler",
  "samples",
  "sampling",
  "samson",
  "samsung",
  "samuel",
  "samurai",
  "san",
  "sanchez",
  "sanction",
  "sanctions",
  "sanctuary",
  "sand",
  "sandal",
  "sandals",
  "sandbox",
  "sander",
  "sanders",
  "sandisk",
  "sandra",
  "sands",
  "sandwich",
  "sandwiches",
  "sandy",
  "sane",
  "sanford",
  "sang",
  "sanitary",
  "sanitation",
  "sanity",
  "sans",
  "santa",
  "santana",
  "santiago",
  "santo",
  "santos",
  "sanyo",
  "sao",
  "sap",
  "sapiens",
  "sapphire",
  "sar",
  "sara",
  "sarah",
  "sarasota",
  "saratoga",
  "sarbanes",
  "sars",
  "sas",
  "saskatchewan",
  "saskatoon",
  "sassy",
  "sat",
  "sata",
  "satan",
  "satellite",
  "satellites",
  "satin",
  "satire",
  "satisfaction",
  "satisfactory",
  "satisfied",
  "satisfies",
  "satisfy",
  "satisfying",
  "saturated",
  "saturation",
  "saturday",
  "saturdays",
  "saturn",
  "sauce",
  "sauces",
  "saudi",
  "saul",
  "sauna",
  "saunders",
  "sausage",
  "sauvignon",
  "savage",
  "savanna",
  "savannah",
  "save",
  "saved",
  "saver",
  "savers",
  "saves",
  "savesave",
  "saving",
  "savings",
  "savior",
  "savvy",
  "saw",
  "saws",
  "sawyer",
  "sax",
  "saxon",
  "saxophone",
  "say",
  "saying",
  "says",
  "sb",
  "sba",
  "sbc",
  "sbin",
  "sbjct",
  "sbs",
  "sc",
  "sca",
  "scalability",
  "scalable",
  "scalar",
  "scale",
  "scaled",
  "scales",
  "scaling",
  "scam",
  "scams",
  "scan",
  "scandal",
  "scandinavia",
  "scandinavian",
  "scanned",
  "scanner",
  "scanners",
  "scanning",
  "scans",
  "scar",
  "scarborough",
  "scarce",
  "scare",
  "scared",
  "scarf",
  "scarface",
  "scarlet",
  "scars",
  "scarves",
  "scary",
  "scat",
  "scattered",
  "scattering",
  "scenario",
  "scenarios",
  "scene",
  "scenery",
  "scenes",
  "scenic",
  "scent",
  "scented",
  "sch",
  "schedule",
  "scheduled",
  "scheduler",
  "schedules",
  "scheduling",
  "schema",
  "schematic",
  "scheme",
  "schemes",
  "schizophrenia",
  "schmidt",
  "schneider",
  "scholar",
  "scholarly",
  "scholars",
  "scholarship",
  "scholarships",
  "scholastic",
  "school",
  "schoolgirl",
  "schooling",
  "schools",
  "schultz",
  "schwartz",
  "schwarzenegger",
  "sci",
  "science",
  "sciences",
  "scientific",
  "scientist",
  "scientists",
  "scientology",
  "scion",
  "scissors",
  "sclerosis",
  "scm",
  "sco",
  "scooby",
  "scoop",
  "scooter",
  "scooters",
  "scope",
  "scopes",
  "score",
  "scoreboard",
  "scorecard",
  "scored",
  "scores",
  "scoring",
  "scorpio",
  "scotch",
  "scotia",
  "scotland",
  "scots",
  "scottish",
  "scottsdale",
  "scout",
  "scouting",
  "scouts",
  "scr",
  "scrabble",
  "scrap",
  "scrapbook",
  "scrapbooking",
  "scraps",
  "scratch",
  "scratches",
  "scream",
  "screaming",
  "screen",
  "screened",
  "screening",
  "screenplay",
  "screens",
  "screensaver",
  "screensavers",
  "screenshot",
  "screenshots",
  "screw",
  "screwed",
  "screws",
  "script",
  "scripting",
  "scripts",
  "scripture",
  "scriptures",
  "scroll",
  "scrolling",
  "scrolls",
  "scrub",
  "scrutiny",
  "scsi",
  "scuba",
  "sculpture",
  "sculptures",
  "sd",
  "sdk",
  "sdl",
  "sdn",
  "sdram",
  "sds",
  "se",
  "sea",
  "seafood",
  "seagate",
  "seahawks",
  "seal",
  "sealed",
  "sealing",
  "seals",
  "seam",
  "seamless",
  "sean",
  "search",
  "searchable",
  "searched",
  "searches",
  "searching",
  "searchsearch",
  "sears",
  "seas",
  "seaside",
  "season",
  "seasonal",
  "seasoned",
  "seasons",
  "seat",
  "seated",
  "seating",
  "seats",
  "seattle",
  "sebastian",
  "sec",
  "second",
  "secondary",
  "seconded",
  "secondly",
  "seconds",
  "secrecy",
  "secret",
  "secretarial",
  "secretariat",
  "secretaries",
  "secretary",
  "secretion",
  "secretly",
  "secrets",
  "secs",
  "secsg",
  "sect",
  "section",
  "sectional",
  "sections",
  "sector",
  "sectors",
  "secular",
  "secunia",
  "secure",
  "secured",
  "securely",
  "securing",
  "securities",
  "security",
  "sed",
  "sedan",
  "sediment",
  "sediments",
  "sedona",
  "see",
  "seed",
  "seeds",
  "seeing",
  "seek",
  "seeker",
  "seekers",
  "seeking",
  "seeks",
  "seem",
  "seemed",
  "seemingly",
  "seems",
  "seen",
  "sees",
  "seether",
  "sega",
  "segment",
  "segmentation",
  "segments",
  "segregation",
  "seiko",
  "seismic",
  "seite",
  "seize",
  "seized",
  "seizure",
  "seizures",
  "sek",
  "seldom",
  "select",
  "selected",
  "selecting",
  "selection",
  "selections",
  "selective",
  "selector",
  "selects",
  "self",
  "selfish",
  "sell",
  "seller",
  "sellers",
  "selling",
  "sells",
  "sem",
  "semantic",
  "semantics",
  "semester",
  "semi",
  "semiconductor",
  "semiconductors",
  "seminar",
  "seminars",
  "seminary",
  "sen",
  "senate",
  "senator",
  "senators",
  "send",
  "sender",
  "sending",
  "sendmail",
  "sendo",
  "sends",
  "seneca",
  "senegal",
  "senior",
  "seniors",
  "sennheiser",
  "sensation",
  "sensations",
  "sense",
  "senses",
  "sensible",
  "sensing",
  "sensitive",
  "sensitivity",
  "sensor",
  "sensors",
  "sensory",
  "sensual",
  "sent",
  "sentence",
  "sentenced",
  "sentences",
  "sentencing",
  "sentiment",
  "sentinel",
  "seo",
  "seoul",
  "sep",
  "separate",
  "separated",
  "separately",
  "separates",
  "separating",
  "separation",
  "separator",
  "seperate",
  "sept",
  "september",
  "septic",
  "seq",
  "sequel",
  "sequence",
  "sequences",
  "sequencing",
  "sequential",
  "ser",
  "serbia",
  "serbian",
  "serena",
  "serenity",
  "sergeant",
  "sergio",
  "serial",
  "serials",
  "serie",
  "series",
  "serif",
  "serious",
  "seriously",
  "sermon",
  "sermons",
  "serpent",
  "serum",
  "serv",
  "servant",
  "servants",
  "serve",
  "served",
  "server",
  "servers",
  "serves",
  "service",
  "serviced",
  "servicemagic",
  "services",
  "servicing",
  "serving",
  "servings",
  "servlet",
  "ses",
  "sesame",
  "session",
  "sessions",
  "sesso",
  "set",
  "seth",
  "sets",
  "setting",
  "settings",
  "settle",
  "settled",
  "settlement",
  "settlements",
  "settlers",
  "settling",
  "setup",
  "seven",
  "seventeen",
  "seventh",
  "seventy",
  "several",
  "severe",
  "severely",
  "severity",
  "seville",
  "sew",
  "sewage",
  "sewer",
  "sewing",
  "sex",
  "sexcam",
  "sexe",
  "sexes",
  "sexo",
  "sexual",
  "sexuality",
  "sexually",
  "sexy",
  "seychelles",
  "seymour",
  "sf",
  "sg",
  "sgd",
  "sgh",
  "sgi",
  "sgml",
  "sgt",
  "sh",
  "sha",
  "shack",
  "shade",
  "shaded",
  "shades",
  "shadow",
  "shadows",
  "shady",
  "shaft",
  "shah",
  "shake",
  "shaker",
  "shakes",
  "shakespeare",
  "shaking",
  "shakira",
  "shall",
  "shallow",
  "shalt",
  "shame",
  "shampoo",
  "shane",
  "shanghai",
  "shania",
  "shannon",
  "shape",
  "shaped",
  "shapes",
  "shaping",
  "shapiro",
  "share",
  "shared",
  "shareholder",
  "shareholders",
  "sharepoint",
  "shares",
  "shareware",
  "sharing",
  "shark",
  "sharks",
  "sharon",
  "sharp",
  "sharper",
  "sharply",
  "shattered",
  "shaun",
  "shave",
  "shaved",
  "shaving",
  "shaw",
  "shawn",
  "she",
  "shea",
  "shear",
  "shed",
  "sheds",
  "sheehan",
  "sheep",
  "sheer",
  "sheet",
  "sheets",
  "sheffield",
  "sheikh",
  "sheila",
  "shelby",
  "sheldon",
  "shelf",
  "shell",
  "shelley",
  "shellfish",
  "shells",
  "shelter",
  "shelters",
  "shelton",
  "shelves",
  "shelving",
  "shemale",
  "shemales",
  "shenzhen",
  "shepherd",
  "sheraton",
  "sheridan",
  "sheriff",
  "sherman",
  "sherry",
  "sherwood",
  "shi",
  "shield",
  "shields",
  "shift",
  "shifted",
  "shifting",
  "shifts",
  "shilling",
  "shimano",
  "shin",
  "shine",
  "shinedown",
  "shines",
  "shining",
  "shiny",
  "ship",
  "shipment",
  "shipments",
  "shipped",
  "shipping",
  "ships",
  "shire",
  "shirley",
  "shirt",
  "shirts",
  "shit",
  "shock",
  "shocked",
  "shocking",
  "shocks",
  "shockwave",
  "shoe",
  "shoes",
  "shook",
  "shoot",
  "shooter",
  "shooting",
  "shoots",
  "shop",
  "shoppe",
  "shopper",
  "shoppers",
  "shopping",
  "shoppy",
  "shops",
  "shopzilla",
  "shore",
  "shoreline",
  "shores",
  "short",
  "shortage",
  "shortages",
  "shortcut",
  "shortcuts",
  "shorter",
  "shortest",
  "shortlist",
  "shortly",
  "shorts",
  "shot",
  "shotgun",
  "shots",
  "should",
  "shoulder",
  "shoulders",
  "shout",
  "shouted",
  "shouting",
  "shouts",
  "show",
  "showcase",
  "showdown",
  "showed",
  "shower",
  "showers",
  "showing",
  "shown",
  "showroom",
  "shows",
  "showtimes",
  "shrek",
  "shreveport",
  "shrimp",
  "shrine",
  "shrink",
  "shropshire",
  "shrubs",
  "shuffle",
  "shui",
  "shut",
  "shutdown",
  "shutter",
  "shuttle",
  "shy",
  "si",
  "siam",
  "siberian",
  "sibling",
  "siblings",
  "sic",
  "sich",
  "sicily",
  "sick",
  "sickness",
  "side",
  "sidebar",
  "sided",
  "sides",
  "sidewalk",
  "siding",
  "sidney",
  "sie",
  "siege",
  "siemens",
  "siena",
  "sierra",
  "sig",
  "sigh",
  "sight",
  "sights",
  "sightseeing",
  "sigma",
  "sign",
  "signage",
  "signal",
  "signaling",
  "signalling",
  "signals",
  "signature",
  "signatures",
  "signed",
  "significance",
  "significant",
  "significantly",
  "signifies",
  "signing",
  "signs",
  "signup",
  "silence",
  "silent",
  "silently",
  "silhouette",
  "silica",
  "silicon",
  "silicone",
  "silk",
  "silky",
  "silly",
  "silva",
  "silver",
  "sim",
  "similar",
  "similarities",
  "similarity",
  "similarly",
  "simmons",
  "simon",
  "simone",
  "simple",
  "simpler",
  "simplest",
  "simplicity",
  "simplified",
  "simplify",
  "simply",
  "simpson",
  "simpsons",
  "sims",
  "simulate",
  "simulated",
  "simulation",
  "simulations",
  "simulator",
  "simultaneous",
  "simultaneously",
  "sin",
  "sinatra",
  "since",
  "sincere",
  "sincerely",
  "sinclair",
  "sind",
  "sing",
  "singapore",
  "singer",
  "singers",
  "singh",
  "singing",
  "single",
  "singled",
  "singles",
  "sings",
  "singular",
  "sinister",
  "sink",
  "sinking",
  "sinks",
  "sins",
  "sinus",
  "sion",
  "sioux",
  "sip",
  "sir",
  "sire",
  "sirius",
  "sis",
  "sister",
  "sisters",
  "sit",
  "site",
  "sitemap",
  "sites",
  "sith",
  "sits",
  "sitting",
  "situ",
  "situated",
  "situation",
  "situations",
  "six",
  "sixteen",
  "sixth",
  "sixty",
  "siyabona",
  "size",
  "sized",
  "sizeof",
  "sizes",
  "sizing",
  "sj",
  "sk",
  "ska",
  "skate",
  "skateboard",
  "skateboarding",
  "skates",
  "skating",
  "skeletal",
  "skeleton",
  "skeptical",
  "sketch",
  "sketches",
  "ski",
  "skies",
  "skiing",
  "skill",
  "skilled",
  "skills",
  "skin",
  "skincare",
  "skinner",
  "skinny",
  "skins",
  "skip",
  "skipped",
  "skipping",
  "skirt",
  "skirts",
  "skis",
  "sku",
  "skull",
  "sky",
  "skye",
  "skyline",
  "skype",
  "sl",
  "slab",
  "slac",
  "slack",
  "slam",
  "slang",
  "slap",
  "slash",
  "slashdot",
  "slate",
  "slater",
  "slaughter",
  "slave",
  "slavery",
  "slaves",
  "slayer",
  "sle",
  "sleazydream",
  "sleek",
  "sleep",
  "sleeper",
  "sleeping",
  "sleeps",
  "sleepy",
  "sleeve",
  "sleeves",
  "slender",
  "slept",
  "sli",
  "slice",
  "sliced",
  "slices",
  "slick",
  "slide",
  "slider",
  "slides",
  "slideshow",
  "sliding",
  "slight",
  "slightly",
  "slim",
  "sling",
  "slip",
  "slipknot",
  "slipped",
  "slippers",
  "slippery",
  "slips",
  "sloan",
  "slogan",
  "slope",
  "slopes",
  "slot",
  "slots",
  "slovak",
  "slovakia",
  "slovenia",
  "slovenian",
  "slow",
  "slowed",
  "slower",
  "slowing",
  "slowly",
  "slr",
  "sludge",
  "slug",
  "slut",
  "sluts",
  "sm",
  "small",
  "smaller",
  "smallest",
  "smart",
  "smarter",
  "smartphone",
  "smash",
  "smashing",
  "smb",
  "smc",
  "sme",
  "smell",
  "smells",
  "smes",
  "smf",
  "smile",
  "smiled",
  "smiles",
  "smiley",
  "smilies",
  "smiling",
  "smith",
  "smithsonian",
  "smoke",
  "smoked",
  "smoker",
  "smokers",
  "smoking",
  "smoky",
  "smooth",
  "smoothly",
  "smp",
  "sms",
  "smtp",
  "smugmug",
  "sn",
  "snack",
  "snacks",
  "snake",
  "snakes",
  "snap",
  "snapshot",
  "snapshots",
  "snatch",
  "sneak",
  "sniper",
  "snippets",
  "snmp",
  "snooker",
  "snoop",
  "snorkeling",
  "snow",
  "snowboard",
  "snowboarding",
  "snowmobile",
  "snowy",
  "snp",
  "snr",
  "snyder",
  "so",
  "soa",
  "soak",
  "soap",
  "soaps",
  "soar",
  "soaring",
  "sober",
  "sobre",
  "soc",
  "soccer",
  "social",
  "socialism",
  "socialist",
  "socially",
  "societal",
  "societies",
  "society",
  "socio",
  "sociology",
  "sock",
  "socket",
  "sockets",
  "socks",
  "soda",
  "sodium",
  "sofa",
  "sofas",
  "sofia",
  "soft",
  "softball",
  "softcover",
  "softly",
  "software",
  "soho",
  "soil",
  "soils",
  "sol",
  "solar",
  "solaris",
  "sold",
  "solder",
  "soldier",
  "soldiers",
  "sole",
  "soleil",
  "solely",
  "solicitation",
  "solicitor",
  "solicitors",
  "solid",
  "solidarity",
  "solids",
  "solitaire",
  "solitary",
  "solo",
  "solomon",
  "soluble",
  "solution",
  "solutions",
  "solve",
  "solved",
  "solvent",
  "solving",
  "som",
  "soma",
  "somalia",
  "some",
  "somebody",
  "someday",
  "somehow",
  "someone",
  "somerset",
  "something",
  "sometime",
  "sometimes",
  "somewhat",
  "somewhere",
  "son",
  "sonata",
  "song",
  "songs",
  "songwriter",
  "sonia",
  "sonic",
  "sonny",
  "sonoma",
  "sons",
  "sont",
  "sony",
  "sonyericsson",
  "soo",
  "soon",
  "sooner",
  "soonest",
  "soothing",
  "sophia",
  "sophie",
  "sophisticated",
  "sophomore",
  "soprano",
  "sore",
  "sorority",
  "sorrow",
  "sorry",
  "sort",
  "sorted",
  "sorting",
  "sorts",
  "sos",
  "sought",
  "soul",
  "souls",
  "sound",
  "sounded",
  "sounding",
  "sounds",
  "soundtrack",
  "soundtracks",
  "soup",
  "soups",
  "sour",
  "source",
  "sourceforge",
  "sources",
  "sourcing",
  "south",
  "southampton",
  "southeast",
  "southeastern",
  "southern",
  "southwest",
  "southwestern",
  "souvenir",
  "souvenirs",
  "sovereign",
  "sovereignty",
  "soviet",
  "sox",
  "soy",
  "soybean",
  "sp",
  "spa",
  "space",
  "spacecraft",
  "spaced",
  "spaces",
  "spacing",
  "spacious",
  "spades",
  "spaghetti",
  "spain",
  "spam",
  "spammers",
  "span",
  "spanish",
  "spank",
  "spanking",
  "spanning",
  "spans",
  "sparc",
  "spare",
  "spares",
  "spark",
  "sparkle",
  "sparkling",
  "sparks",
  "sparrow",
  "sparse",
  "spas",
  "spatial",
  "spawn",
  "spc",
  "spd",
  "speak",
  "speaker",
  "speakers",
  "speaking",
  "speaks",
  "spear",
  "spears",
  "spec",
  "special",
  "specialised",
  "specialist",
  "specialists",
  "speciality",
  "specialization",
  "specialize",
  "specialized",
  "specializes",
  "specializing",
  "specially",
  "specials",
  "specialties",
  "specialty",
  "species",
  "specific",
  "specifically",
  "specification",
  "specifications",
  "specificity",
  "specifics",
  "specified",
  "specifies",
  "specify",
  "specifying",
  "specimen",
  "specimens",
  "specs",
  "spectacular",
  "spectator",
  "spectra",
  "spectral",
  "spectroscopy",
  "spectrum",
  "speculation",
  "speech",
  "speeches",
  "speed",
  "speeding",
  "speeds",
  "speedway",
  "speedy",
  "spell",
  "spelled",
  "spelling",
  "spells",
  "spencer",
  "spend",
  "spending",
  "spends",
  "spent",
  "sperm",
  "spermshack",
  "spf",
  "sphere",
  "spheres",
  "spherical",
  "spi",
  "spice",
  "spices",
  "spicy",
  "spider",
  "spiderman",
  "spiders",
  "spies",
  "spike",
  "spikes",
  "spill",
  "spin",
  "spinach",
  "spinal",
  "spindle",
  "spine",
  "spinning",
  "spiral",
  "spires",
  "spirit",
  "spirited",
  "spirits",
  "spiritual",
  "spirituality",
  "spit",
  "spite",
  "splash",
  "splendid",
  "splinter",
  "split",
  "splits",
  "splitter",
  "splitting",
  "spoiler",
  "spoilers",
  "spokane",
  "spoke",
  "spoken",
  "spokesman",
  "spokesperson",
  "sponge",
  "spongebob",
  "sponsor",
  "sponsored",
  "sponsoring",
  "sponsors",
  "sponsorship",
  "spontaneous",
  "spoon",
  "sport",
  "sporting",
  "sports",
  "sportsbook",
  "sportswear",
  "spot",
  "spotlight",
  "spots",
  "spotted",
  "spotting",
  "spouse",
  "spouses",
  "spp",
  "spray",
  "spread",
  "spreading",
  "spreads",
  "spreadsheet",
  "spreadsheets",
  "spring",
  "springer",
  "springfield",
  "springs",
  "sprint",
  "spruce",
  "spun",
  "spur",
  "spurs",
  "spy",
  "spying",
  "spyware",
  "sq",
  "sql",
  "sqrt",
  "squad",
  "squadron",
  "square",
  "squared",
  "squares",
  "squash",
  "squeeze",
  "squid",
  "squirrel",
  "squirt",
  "squirting",
  "sr",
  "src",
  "sri",
  "srl",
  "srs",
  "ss",
  "ssa",
  "ssh",
  "ssi",
  "ssk",
  "ssl",
  "sst",
  "st",
  "sta",
  "staa",
  "stab",
  "stability",
  "stabilization",
  "stable",
  "stacey",
  "stack",
  "stacked",
  "stacks",
  "stacy",
  "stadium",
  "staff",
  "staffing",
  "stafford",
  "staffordshire",
  "stag",
  "stage",
  "staged",
  "stages",
  "staging",
  "stain",
  "staind",
  "stained",
  "staining",
  "stainless",
  "stains",
  "stair",
  "stairs",
  "stake",
  "stakeholder",
  "stakeholders",
  "stakes",
  "stall",
  "stalls",
  "stamford",
  "stamp",
  "stamped",
  "stamping",
  "stamps",
  "stance",
  "stand",
  "standalone",
  "standard",
  "standardization",
  "standardized",
  "standards",
  "standby",
  "standing",
  "standings",
  "standpoint",
  "stands",
  "stanford",
  "stanley",
  "stanton",
  "staple",
  "staples",
  "star",
  "starbucks",
  "starch",
  "stare",
  "stared",
  "stargate",
  "staring",
  "stark",
  "starr",
  "starring",
  "stars",
  "starsmerchant",
  "start",
  "started",
  "starter",
  "starters",
  "starting",
  "starts",
  "startup",
  "stat",
  "state",
  "stated",
  "statement",
  "statements",
  "staten",
  "states",
  "statesman",
  "statewide",
  "static",
  "stating",
  "station",
  "stationary",
  "stationery",
  "stations",
  "statistic",
  "statistical",
  "statistically",
  "statistics",
  "stats",
  "statue",
  "statues",
  "status",
  "statute",
  "statutes",
  "statutory",
  "stay",
  "stayed",
  "staying",
  "stays",
  "std",
  "stderr",
  "ste",
  "steadily",
  "steady",
  "steak",
  "steaks",
  "steal",
  "stealing",
  "steals",
  "stealth",
  "steam",
  "steel",
  "steele",
  "steelers",
  "steep",
  "steer",
  "steering",
  "stefan",
  "stefani",
  "stein",
  "steiner",
  "stella",
  "stellar",
  "stem",
  "stems",
  "step",
  "stephan",
  "stephanie",
  "stephen",
  "stephens",
  "stepped",
  "stepping",
  "steps",
  "stereo",
  "sterile",
  "sterling",
  "stern",
  "steroid",
  "steroids",
  "steve",
  "steven",
  "stevens",
  "stevenson",
  "stevie",
  "stew",
  "stewardship",
  "stewart",
  "sti",
  "stick",
  "sticker",
  "stickers",
  "sticking",
  "sticks",
  "sticky",
  "stiff",
  "still",
  "stills",
  "stimulate",
  "stimulated",
  "stimulating",
  "stimulation",
  "stimuli",
  "stimulus",
  "sting",
  "stir",
  "stirling",
  "stirring",
  "stitch",
  "stl",
  "sto",
  "stochastic",
  "stock",
  "stocked",
  "stockholders",
  "stockholm",
  "stocking",
  "stockings",
  "stocks",
  "stockton",
  "stoke",
  "stokes",
  "stole",
  "stolen",
  "stomach",
  "stone",
  "stones",
  "stony",
  "stood",
  "stool",
  "stools",
  "stop",
  "stopped",
  "stopping",
  "stops",
  "storage",
  "store",
  "stored",
  "stores",
  "storesshop",
  "storey",
  "stories",
  "storing",
  "storm",
  "storms",
  "stormwater",
  "story",
  "storytelling",
  "stout",
  "stove",
  "stoves",
  "stp",
  "str",
  "straight",
  "straightforward",
  "strain",
  "strains",
  "strait",
  "strand",
  "stranded",
  "strands",
  "strange",
  "stranger",
  "strangers",
  "strap",
  "strapon",
  "straps",
  "strategic",
  "strategies",
  "strategy",
  "stratford",
  "strauss",
  "straw",
  "strawberry",
  "stray",
  "streak",
  "stream",
  "streaming",
  "streamline",
  "streams",
  "street",
  "streets",
  "strength",
  "strengthen",
  "strengthened",
  "strengthening",
  "strengths",
  "stress",
  "stressed",
  "stresses",
  "stretch",
  "stretched",
  "stretches",
  "stretching",
  "strict",
  "strictly",
  "strike",
  "strikes",
  "striking",
  "string",
  "stringent",
  "strings",
  "strip",
  "stripe",
  "striped",
  "stripes",
  "stripped",
  "stripper",
  "strippers",
  "stripping",
  "strips",
  "strive",
  "striving",
  "stroke",
  "strokes",
  "stroll",
  "stroller",
  "strollers",
  "strong",
  "stronger",
  "strongest",
  "strongly",
  "struck",
  "struct",
  "structural",
  "structure",
  "structured",
  "structures",
  "struggle",
  "struggled",
  "struggles",
  "struggling",
  "struts",
  "sts",
  "stu",
  "stuart",
  "stub",
  "stuck",
  "stud",
  "student",
  "students",
  "studied",
  "studies",
  "studio",
  "studios",
  "studs",
  "study",
  "studying",
  "stuff",
  "stuffed",
  "stuffing",
  "stunning",
  "stunt",
  "stupid",
  "sturdy",
  "stuttgart",
  "style",
  "styled",
  "styles",
  "stylesheet",
  "styling",
  "stylish",
  "stylus",
  "su",
  "sub",
  "subaru",
  "subcategories",
  "subchapter",
  "subclass",
  "subcommittee",
  "subdivision",
  "subdivisions",
  "subgroup",
  "subject",
  "subjected",
  "subjective",
  "subjects",
  "sublime",
  "sublimedirectory",
  "submarine",
  "submission",
  "submissions",
  "submit",
  "submits",
  "submitted",
  "submitting",
  "subordinate",
  "subparagraph",
  "subpart",
  "subroutine",
  "subs",
  "subscribe",
  "subscribed",
  "subscriber",
  "subscribers",
  "subscribing",
  "subscription",
  "subscriptions",
  "subsection",
  "subsections",
  "subsequent",
  "subsequently",
  "subset",
  "subsidiaries",
  "subsidiary",
  "subsidies",
  "subsidy",
  "substance",
  "substances",
  "substantial",
  "substantially",
  "substantive",
  "substitute",
  "substituted",
  "substitutes",
  "substitution",
  "substrate",
  "substrates",
  "subsystem",
  "subtitle",
  "subtitles",
  "subtle",
  "subtotal",
  "subunit",
  "suburb",
  "suburban",
  "suburbs",
  "subversion",
  "subway",
  "subwoofer",
  "succeed",
  "succeeded",
  "succeeding",
  "success",
  "successes",
  "successful",
  "successfully",
  "succession",
  "successive",
  "successor",
  "such",
  "suche",
  "suck",
  "sucked",
  "sucking",
  "sucks",
  "suction",
  "sudan",
  "sudbury",
  "sudden",
  "suddenly",
  "sudoku",
  "sued",
  "suede",
  "suffer",
  "suffered",
  "suffering",
  "suffers",
  "sufficient",
  "sufficiently",
  "suffix",
  "suffolk",
  "sugababes",
  "sugar",
  "suggest",
  "suggested",
  "suggesting",
  "suggestion",
  "suggestions",
  "suggests",
  "suicide",
  "suit",
  "suitability",
  "suitable",
  "suite",
  "suited",
  "suites",
  "suits",
  "sulfate",
  "sulfur",
  "sullivan",
  "sulphur",
  "sum",
  "summaries",
  "summarize",
  "summarized",
  "summarizes",
  "summary",
  "summer",
  "summers",
  "summit",
  "sums",
  "sun",
  "sundance",
  "sunday",
  "sundays",
  "sunderland",
  "sunflower",
  "sung",
  "sunglasses",
  "sunlight",
  "sunny",
  "sunrise",
  "suns",
  "sunset",
  "sunshine",
  "suny",
  "sup",
  "super",
  "superannuation",
  "superb",
  "superficial",
  "superintendent",
  "superior",
  "superman",
  "supermarket",
  "supermarkets",
  "supernatural",
  "superpages",
  "superstar",
  "superstore",
  "supervise",
  "supervised",
  "supervising",
  "supervision",
  "supervisor",
  "supervisors",
  "supervisory",
  "supp",
  "supper",
  "suppl",
  "supplement",
  "supplemental",
  "supplementary",
  "supplemented",
  "supplements",
  "supplied",
  "supplier",
  "suppliers",
  "supplies",
  "supply",
  "supplying",
  "support",
  "supported",
  "supporter",
  "supporters",
  "supporting",
  "supportive",
  "supports",
  "suppose",
  "supposed",
  "supposedly",
  "suppress",
  "suppressed",
  "suppression",
  "supra",
  "supreme",
  "sur",
  "surcharge",
  "sure",
  "surely",
  "surf",
  "surface",
  "surfaces",
  "surfer",
  "surfers",
  "surfing",
  "surge",
  "surgeon",
  "surgeons",
  "surgery",
  "surgical",
  "suriname",
  "surname",
  "surnames",
  "surplus",
  "surprise",
  "surprised",
  "surprises",
  "surprising",
  "surprisingly",
  "surrender",
  "surrey",
  "surround",
  "surrounded",
  "surrounding",
  "surroundings",
  "surrounds",
  "surveillance",
  "survey",
  "surveyed",
  "surveying",
  "surveyor",
  "surveyors",
  "surveys",
  "survival",
  "survive",
  "survived",
  "surviving",
  "survivor",
  "survivors",
  "sus",
  "susan",
  "susceptibility",
  "susceptible",
  "suse",
  "sushi",
  "susie",
  "suspect",
  "suspected",
  "suspects",
  "suspend",
  "suspended",
  "suspense",
  "suspension",
  "suspicion",
  "suspicious",
  "sussex",
  "sustain",
  "sustainability",
  "sustainable",
  "sustained",
  "sustaining",
  "sutherland",
  "sutton",
  "suv",
  "suvs",
  "suzanne",
  "suzuki",
  "sv",
  "svalbard",
  "svc",
  "svcd",
  "sven",
  "svenska",
  "svg",
  "svn",
  "sw",
  "swallow",
  "swallowing",
  "swamp",
  "swan",
  "swansea",
  "swap",
  "swapping",
  "swarovski",
  "swaziland",
  "swear",
  "sweat",
  "sweater",
  "sweaters",
  "sweatshirt",
  "sweatshirts",
  "sweden",
  "swedish",
  "sweeney",
  "sweep",
  "sweeping",
  "sweepstakes",
  "sweet",
  "sweetheart",
  "sweets",
  "swell",
  "swelling",
  "swept",
  "swf",
  "swift",
  "swim",
  "swimming",
  "swimsuit",
  "swimwear",
  "swindon",
  "swing",
  "swinger",
  "swingers",
  "swinging",
  "swings",
  "swiss",
  "switch",
  "switchboard",
  "switched",
  "switches",
  "switchfoot",
  "switching",
  "switzerland",
  "swivel",
  "sword",
  "swords",
  "sworn",
  "sx",
  "sy",
  "sybase",
  "sydney",
  "syllabus",
  "sylvia",
  "symantec",
  "symbian",
  "symbol",
  "symbolic",
  "symbols",
  "symmetric",
  "symmetry",
  "sympathetic",
  "sympathy",
  "symphony",
  "symposium",
  "symptom",
  "symptoms",
  "syn",
  "sync",
  "synchronization",
  "synchronized",
  "synchronous",
  "syndicate",
  "syndicated",
  "syndication",
  "syndrome",
  "synergy",
  "synonym",
  "synonyms",
  "synopsis",
  "syntax",
  "synth",
  "synthase",
  "synthesis",
  "synthetic",
  "syracuse",
  "syria",
  "syrian",
  "syrup",
  "sys",
  "system",
  "systematic",
  "systematically",
  "systemic",
  "systems",
  "sz",
  "t",
  "ta",
  "tab",
  "table",
  "tables",
  "tablespoons",
  "tablet",
  "tabletop",
  "tablets",
  "tableware",
  "taboo",
  "tabs",
  "tac",
  "tack",
  "tackle",
  "tackles",
  "tackling",
  "taco",
  "tacoma",
  "tactic",
  "tactical",
  "tactics",
  "tad",
  "tag",
  "tagged",
  "tagging",
  "tags",
  "tahiti",
  "tahoe",
  "tai",
  "tail",
  "tailed",
  "tailor",
  "tailored",
  "tails",
  "taipei",
  "taiwan",
  "taj",
  "tajikistan",
  "take",
  "taken",
  "takeover",
  "takes",
  "taking",
  "tal",
  "talbot",
  "tale",
  "talent",
  "talented",
  "talents",
  "tales",
  "taliban",
  "talk",
  "talkback",
  "talked",
  "talking",
  "talks",
  "tall",
  "tallahassee",
  "tally",
  "tam",
  "tamiflu",
  "tamil",
  "tammy",
  "tampa",
  "tan",
  "tandem",
  "tang",
  "tangible",
  "tango",
  "tank",
  "tanks",
  "tanned",
  "tanner",
  "tanning",
  "tanya",
  "tanzania",
  "tao",
  "tap",
  "tape",
  "tapes",
  "tapestry",
  "tapped",
  "tapping",
  "taps",
  "tar",
  "tara",
  "target",
  "targeted",
  "targeting",
  "targets",
  "targus",
  "tariff",
  "tariffs",
  "tarot",
  "tas",
  "task",
  "tasks",
  "tasmania",
  "taste",
  "tastes",
  "tasting",
  "tasty",
  "tata",
  "tate",
  "tattoo",
  "tattoos",
  "tau",
  "taught",
  "taurus",
  "tavern",
  "tawnee",
  "tax",
  "taxable",
  "taxation",
  "taxes",
  "taxi",
  "taxis",
  "taxonomy",
  "taxpayer",
  "taxpayers",
  "taylor",
  "tb",
  "tba",
  "tbd",
  "tc",
  "tcl",
  "tcm",
  "tcp",
  "td",
  "tdk",
  "tds",
  "te",
  "tea",
  "teach",
  "teacher",
  "teachers",
  "teaches",
  "teaching",
  "teachings",
  "teak",
  "teal",
  "team",
  "teamed",
  "teams",
  "teamwork",
  "tear",
  "tears",
  "teas",
  "tease",
  "teaspoon",
  "tec",
  "tech",
  "technical",
  "technically",
  "technician",
  "technicians",
  "technics",
  "technique",
  "techniques",
  "techno",
  "technological",
  "technologies",
  "technology",
  "technorati",
  "techrepublic",
  "techs",
  "teddy",
  "tee",
  "teen",
  "teenage",
  "teenager",
  "teenagers",
  "teens",
  "tees",
  "teeth",
  "teh",
  "tehran",
  "tek",
  "tel",
  "tele",
  "telecharger",
  "telecom",
  "telecommunication",
  "telecommunications",
  "telecoms",
  "teleflora",
  "telefonsex",
  "telegraph",
  "telephone",
  "telephones",
  "telephony",
  "telescope",
  "telescopes",
  "television",
  "televisions",
  "tell",
  "teller",
  "telling",
  "tells",
  "telnet",
  "telstra",
  "tem",
  "temp",
  "tempe",
  "temper",
  "temperature",
  "temperatures",
  "template",
  "templates",
  "temple",
  "temples",
  "tempo",
  "temporal",
  "temporarily",
  "temporary",
  "temps",
  "temptation",
  "tempted",
  "ten",
  "tenacious",
  "tenant",
  "tenants",
  "tend",
  "tended",
  "tendency",
  "tender",
  "tenders",
  "tends",
  "tenerife",
  "tennessee",
  "tennis",
  "tenor",
  "tens",
  "tense",
  "tension",
  "tensions",
  "tent",
  "tentative",
  "tenth",
  "tents",
  "tenure",
  "ter",
  "teresa",
  "term",
  "termed",
  "terminal",
  "terminals",
  "terminate",
  "terminated",
  "termination",
  "terminator",
  "terminology",
  "terms",
  "terra",
  "terrace",
  "terrain",
  "terre",
  "terrestrial",
  "terri",
  "terrible",
  "terribly",
  "terrier",
  "terrific",
  "territorial",
  "territories",
  "territory",
  "terror",
  "terrorism",
  "terrorist",
  "terrorists",
  "terry",
  "tertiary",
  "tes",
  "tesco",
  "test",
  "testament",
  "tested",
  "tester",
  "testers",
  "testified",
  "testify",
  "testimonials",
  "testimony",
  "testing",
  "testosterone",
  "tests",
  "tetris",
  "tex",
  "texans",
  "texas",
  "text",
  "textbook",
  "textbooks",
  "textile",
  "textiles",
  "texts",
  "textual",
  "texture",
  "textured",
  "textures",
  "tf",
  "tft",
  "tg",
  "tgp",
  "th",
  "tha",
  "thai",
  "thailand",
  "thames",
  "than",
  "thank",
  "thanked",
  "thankful",
  "thanks",
  "thanksgiving",
  "thanx",
  "that",
  "thats",
  "thb",
  "the",
  "theater",
  "theaters",
  "theatre",
  "theatres",
  "theatrical",
  "thee",
  "theft",
  "thehun",
  "their",
  "theirs",
  "them",
  "thematic",
  "theme",
  "themed",
  "themes",
  "themselves",
  "then",
  "thence",
  "theo",
  "theodore",
  "theological",
  "theology",
  "theorem",
  "theoretical",
  "theories",
  "theory",
  "ther",
  "therapeutic",
  "therapies",
  "therapist",
  "therapists",
  "therapy",
  "there",
  "thereafter",
  "thereby",
  "therefore",
  "therein",
  "thereof",
  "thereon",
  "theres",
  "theresa",
  "thereto",
  "thermal",
  "thermometer",
  "thesaurus",
  "these",
  "theses",
  "thesis",
  "thessalonians",
  "theta",
  "they",
  "thick",
  "thickness",
  "thief",
  "thieves",
  "thigh",
  "thighs",
  "thin",
  "thing",
  "things",
  "think",
  "thinking",
  "thinkpad",
  "thinks",
  "third",
  "thirds",
  "thirteen",
  "thirty",
  "this",
  "thiscategory",
  "thistle",
  "thn",
  "tho",
  "thomas",
  "thompson",
  "thomson",
  "thong",
  "thongs",
  "thor",
  "thornton",
  "thorough",
  "thoroughly",
  "those",
  "thou",
  "though",
  "thought",
  "thoughtful",
  "thoughts",
  "thousand",
  "thousands",
  "thr",
  "thread",
  "threaded",
  "threads",
  "threat",
  "threaten",
  "threatened",
  "threatening",
  "threatens",
  "threats",
  "three",
  "threesome",
  "threesomes",
  "threshold",
  "thresholds",
  "threw",
  "thrice",
  "thrill",
  "thrilled",
  "thriller",
  "thrillers",
  "thrive",
  "throat",
  "throne",
  "throttle",
  "through",
  "throughout",
  "throughput",
  "throw",
  "throwing",
  "thrown",
  "throws",
  "thru",
  "thrust",
  "ths",
  "thu",
  "thug",
  "thumb",
  "thumbnail",
  "thumbnails",
  "thumbs",
  "thumbzilla",
  "thunder",
  "thunderbird",
  "thurs",
  "thursday",
  "thursdays",
  "thus",
  "thx",
  "thy",
  "thyroid",
  "ti",
  "tia",
  "tiava",
  "tibet",
  "tibetan",
  "tic",
  "tick",
  "tickboxes",
  "ticker",
  "ticket",
  "ticketmaster",
  "tickets",
  "tickling",
  "tidal",
  "tide",
  "tides",
  "tidy",
  "tie",
  "tied",
  "tier",
  "ties",
  "tiff",
  "tiffany",
  "tiger",
  "tigers",
  "tight",
  "tightly",
  "tights",
  "tiki",
  "til",
  "tile",
  "tiles",
  "till",
  "tilt",
  "tim",
  "timber",
  "timberland",
  "time",
  "timed",
  "timeless",
  "timeline",
  "timeliness",
  "timely",
  "timeout",
  "timer",
  "timers",
  "times",
  "timeshare",
  "timeshares",
  "timestamp",
  "timetable",
  "timezone",
  "timing",
  "timor",
  "timothy",
  "tin",
  "tina",
  "tiny",
  "tion",
  "tional",
  "tions",
  "tip",
  "tipping",
  "tips",
  "tire",
  "tired",
  "tires",
  "tis",
  "tissue",
  "tissues",
  "tit",
  "titan",
  "titanic",
  "titanium",
  "titans",
  "title",
  "titled",
  "titles",
  "tits",
  "titten",
  "tittens",
  "titus",
  "tive",
  "tivo",
  "tivoli",
  "tj",
  "tk",
  "tl",
  "tlc",
  "tls",
  "tm",
  "tmp",
  "tn",
  "tnt",
  "to",
  "toast",
  "toaster",
  "tobacco",
  "tobago",
  "toby",
  "toc",
  "today",
  "todays",
  "todd",
  "toddler",
  "toddlers",
  "todo",
  "todos",
  "toe",
  "toes",
  "together",
  "toggle",
  "togo",
  "toilet",
  "toilets",
  "toilette",
  "tokelau",
  "token",
  "tokens",
  "tokyo",
  "told",
  "toledo",
  "tolerance",
  "tolerant",
  "tolerate",
  "tolerated",
  "tolkien",
  "toll",
  "tomato",
  "tomatoes",
  "tomb",
  "tomcat",
  "tome",
  "tommy",
  "tomorrow",
  "tomtom",
  "ton",
  "tone",
  "toner",
  "tones",
  "tonga",
  "tongue",
  "toni",
  "tonight",
  "tonnes",
  "tons",
  "too",
  "took",
  "tool",
  "toolbar",
  "toolbox",
  "toolkit",
  "tools",
  "toon",
  "toons",
  "tooth",
  "top",
  "topaz",
  "topeka",
  "topic",
  "topical",
  "topics",
  "topless",
  "topographic",
  "topology",
  "topped",
  "topps",
  "tops",
  "tor",
  "torah",
  "torch",
  "tori",
  "torino",
  "torn",
  "tornado",
  "toronto",
  "torque",
  "torrent",
  "torres",
  "torso",
  "tort",
  "torture",
  "tortured",
  "tory",
  "tos",
  "toshiba",
  "toss",
  "tossed",
  "tot",
  "total",
  "totaling",
  "totally",
  "totals",
  "tote",
  "touch",
  "touchdown",
  "touched",
  "touches",
  "touching",
  "tough",
  "toulouse",
  "tour",
  "touring",
  "tourism",
  "tourist",
  "tourists",
  "tournament",
  "tournaments",
  "tours",
  "tous",
  "tout",
  "tow",
  "toward",
  "towards",
  "towel",
  "towels",
  "tower",
  "towers",
  "towing",
  "town",
  "townhouse",
  "towns",
  "townsend",
  "township",
  "toxic",
  "toxicity",
  "toxicology",
  "toxins",
  "toy",
  "toyota",
  "toys",
  "tp",
  "tr",
  "tra",
  "trac",
  "trace",
  "traced",
  "traces",
  "tracey",
  "tracing",
  "track",
  "trackback",
  "trackbacks",
  "tracked",
  "tracker",
  "tracking",
  "tracks",
  "tract",
  "traction",
  "tractor",
  "tractors",
  "tracy",
  "trade",
  "traded",
  "trademark",
  "trademarks",
  "trader",
  "traders",
  "trades",
  "trading",
  "tradition",
  "traditional",
  "traditionally",
  "traditions",
  "traffic",
  "trafficking",
  "tragedy",
  "tragic",
  "trail",
  "trailer",
  "trailers",
  "trailing",
  "trails",
  "train",
  "trained",
  "trainee",
  "trainees",
  "trainer",
  "trainers",
  "training",
  "trains",
  "trait",
  "traits",
  "trajectory",
  "tramadol",
  "tran",
  "trance",
  "tranny",
  "trans",
  "transaction",
  "transactions",
  "transcend",
  "transcribed",
  "transcript",
  "transcription",
  "transcripts",
  "transexual",
  "transexuales",
  "transexuals",
  "transfer",
  "transferable",
  "transferred",
  "transferring",
  "transfers",
  "transform",
  "transformation",
  "transformations",
  "transformed",
  "transformer",
  "transformers",
  "transforming",
  "transforms",
  "transgender",
  "transient",
  "transistor",
  "transit",
  "transition",
  "transitional",
  "transitions",
  "translate",
  "translated",
  "translates",
  "translating",
  "translation",
  "translations",
  "translator",
  "translators",
  "transmission",
  "transmissions",
  "transmit",
  "transmitted",
  "transmitter",
  "transmitting",
  "transnational",
  "transparency",
  "transparent",
  "transplant",
  "transplantation",
  "transport",
  "transportation",
  "transported",
  "transporter",
  "transporting",
  "transsexual",
  "transverse",
  "transvestite",
  "transvestites",
  "trap",
  "trapped",
  "traps",
  "trash",
  "trauma",
  "traumatic",
  "travel",
  "traveled",
  "traveler",
  "travelers",
  "traveling",
  "travelled",
  "traveller",
  "travellers",
  "travelling",
  "travelocity",
  "travelodge",
  "travels",
  "traverse",
  "travesti",
  "travestis",
  "travis",
  "tray",
  "trays",
  "tread",
  "treadmill",
  "treasure",
  "treasurer",
  "treasures",
  "treasury",
  "treat",
  "treated",
  "treaties",
  "treating",
  "treatment",
  "treatments",
  "treats",
  "treaty",
  "tree",
  "trees",
  "trek",
  "trekking",
  "trembl",
  "tremendous",
  "trench",
  "trend",
  "trends",
  "trendy",
  "trent",
  "trenton",
  "treo",
  "tres",
  "trevor",
  "tri",
  "trial",
  "trials",
  "triangle",
  "triathlon",
  "tribal",
  "tribe",
  "tribes",
  "tribunal",
  "tribune",
  "tribute",
  "trick",
  "tricks",
  "tricky",
  "tried",
  "tries",
  "trigger",
  "triggered",
  "triggers",
  "trillion",
  "trilogy",
  "trim",
  "trimmed",
  "trina",
  "trinidad",
  "trinity",
  "trio",
  "trip",
  "tripadvisor",
  "triple",
  "tripod",
  "trips",
  "trish",
  "tristan",
  "triumph",
  "trivia",
  "trivial",
  "trivium",
  "trojan",
  "trojans",
  "troll",
  "trolley",
  "trong",
  "troop",
  "troops",
  "trophy",
  "tropical",
  "trouble",
  "troubled",
  "troubles",
  "troubleshooting",
  "trousers",
  "trout",
  "troy",
  "truck",
  "trucking",
  "trucks",
  "true",
  "truly",
  "truman",
  "trump",
  "trumpet",
  "trunk",
  "trust",
  "truste",
  "trusted",
  "trustee",
  "trustees",
  "trustpass",
  "trusts",
  "truth",
  "truths",
  "try",
  "trying",
  "ts",
  "tsn",
  "tsp",
  "tsunami",
  "tt",
  "ttf",
  "ttl",
  "tty",
  "tu",
  "tub",
  "tube",
  "tuberculosis",
  "tubes",
  "tubing",
  "tubs",
  "tubular",
  "tuck",
  "tucker",
  "tucson",
  "tue",
  "tues",
  "tuesday",
  "tuesdays",
  "tuition",
  "tulip",
  "tulsa",
  "tumble",
  "tummy",
  "tumor",
  "tumors",
  "tuna",
  "tune",
  "tuned",
  "tuner",
  "tuners",
  "tunes",
  "tungsten",
  "tuning",
  "tunisia",
  "tunnel",
  "tunnels",
  "turbine",
  "turbo",
  "turbulence",
  "turf",
  "turin",
  "turismo",
  "turkey",
  "turkish",
  "turkmenistan",
  "turks",
  "turn",
  "turnaround",
  "turned",
  "turner",
  "turning",
  "turnout",
  "turnover",
  "turns",
  "turquoise",
  "turtle",
  "turtles",
  "tuscany",
  "tutor",
  "tutorial",
  "tutorials",
  "tutoring",
  "tutors",
  "tuvalu",
  "tv",
  "tvs",
  "tw",
  "twain",
  "tweak",
  "tweed",
  "twelve",
  "twentieth",
  "twenty",
  "twice",
  "twiki",
  "twilight",
  "twin",
  "twink",
  "twinks",
  "twins",
  "twist",
  "twisted",
  "twiztid",
  "two",
  "twp",
  "tx",
  "txt",
  "ty",
  "tycoon",
  "tying",
  "tyler",
  "tyne",
  "type",
  "typed",
  "typedef",
  "typekey",
  "typepad",
  "types",
  "typical",
  "typically",
  "typing",
  "typo",
  "tyr",
  "tyranny",
  "tyre",
  "tyres",
  "tyrosine",
  "tyson",
  "tz",
  "u",
  "ua",
  "uae",
  "ub",
  "ubc",
  "uber",
  "ubiquitous",
  "ubuntu",
  "uc",
  "ucla",
  "ud",
  "udp",
  "ue",
  "uefa",
  "uf",
  "ufo",
  "ug",
  "uganda",
  "ugly",
  "uh",
  "ui",
  "uid",
  "uk",
  "ukraine",
  "ukrainian",
  "ul",
  "ulster",
  "ultima",
  "ultimate",
  "ultimately",
  "ultra",
  "ultram",
  "ultrasonic",
  "ultrasound",
  "ultraviolet",
  "um",
  "uma",
  "umbrella",
  "umd",
  "uml",
  "un",
  "una",
  "unable",
  "unabridged",
  "unacceptable",
  "unanimous",
  "unanimously",
  "unanswered",
  "unauthorized",
  "unavailable",
  "unaware",
  "unbelievable",
  "unbiased",
  "unc",
  "uncategorized",
  "uncensored",
  "uncertain",
  "uncertainties",
  "uncertainty",
  "unchanged",
  "unclassified",
  "uncle",
  "unclear",
  "uncomfortable",
  "uncommon",
  "unconscious",
  "uncover",
  "uncovered",
  "uncut",
  "und",
  "undef",
  "undefined",
  "under",
  "underage",
  "undercover",
  "undergo",
  "undergoing",
  "undergraduate",
  "undergraduates",
  "underground",
  "underline",
  "underlined",
  "underlying",
  "undermine",
  "underneath",
  "underoath",
  "understand",
  "understandable",
  "understanding",
  "understands",
  "understood",
  "undertake",
  "undertaken",
  "undertaking",
  "underwater",
  "underway",
  "underwear",
  "underwood",
  "underworld",
  "underwriting",
  "undo",
  "undoubtedly",
  "undp",
  "une",
  "unemployed",
  "unemployment",
  "unesco",
  "unexpected",
  "unfair",
  "unfamiliar",
  "unfinished",
  "unforgettable",
  "unfortunate",
  "unfortunately",
  "unhappy",
  "uni",
  "unicef",
  "unicode",
  "unidentified",
  "unified",
  "uniform",
  "uniformly",
  "uniforms",
  "uninstall",
  "uninsured",
  "union",
  "unions",
  "uniprotkb",
  "unique",
  "uniquely",
  "unisex",
  "unit",
  "unite",
  "united",
  "units",
  "unity",
  "univ",
  "universal",
  "universe",
  "universidad",
  "universities",
  "university",
  "unix",
  "unknown",
  "unlawful",
  "unleashed",
  "unless",
  "unlike",
  "unlikely",
  "unlimited",
  "unlock",
  "unlocked",
  "unlocking",
  "unnamed",
  "unnecessary",
  "uno",
  "unofficial",
  "unpaid",
  "unpleasant",
  "unprecedented",
  "unpredictable",
  "unpublished",
  "unrated",
  "unread",
  "unreal",
  "unreasonable",
  "unregistered",
  "unrelated",
  "unresolved",
  "unrestricted",
  "unsafe",
  "unsecured",
  "unseen",
  "unsigned",
  "unsolicited",
  "unspecified",
  "unstable",
  "unsubscribe",
  "unsuccessful",
  "unsupported",
  "unsure",
  "until",
  "untitled",
  "unto",
  "unused",
  "unusual",
  "unusually",
  "unveiled",
  "unveils",
  "unwanted",
  "unwilling",
  "unwrap",
  "up",
  "upc",
  "upcoming",
  "update",
  "updated",
  "updates",
  "updating",
  "upgrade",
  "upgraded",
  "upgrades",
  "upgrading",
  "upholstery",
  "upload",
  "uploaded",
  "uploading",
  "uploads",
  "upon",
  "upper",
  "upright",
  "ups",
  "upscale",
  "upset",
  "upside",
  "upskirt",
  "upskirts",
  "upstairs",
  "upstream",
  "uptake",
  "uptime",
  "upto",
  "uptown",
  "upward",
  "upwards",
  "ur",
  "uranium",
  "urban",
  "urbana",
  "urge",
  "urged",
  "urgency",
  "urgent",
  "urges",
  "urging",
  "uri",
  "urinary",
  "urine",
  "url",
  "urls",
  "urn",
  "urology",
  "uruguay",
  "urw",
  "us",
  "usa",
  "usability",
  "usable",
  "usage",
  "usaid",
  "usb",
  "usc",
  "usd",
  "usda",
  "use",
  "used",
  "useful",
  "usefulness",
  "useless",
  "usenet",
  "user",
  "usergroupsusergroups",
  "username",
  "userpic",
  "users",
  "uses",
  "usgs",
  "usher",
  "using",
  "usps",
  "usr",
  "uss",
  "ussr",
  "usual",
  "usually",
  "ut",
  "utah",
  "utc",
  "utensils",
  "utf",
  "util",
  "utilisation",
  "utilities",
  "utility",
  "utilization",
  "utilize",
  "utilized",
  "utilizes",
  "utilizing",
  "utils",
  "utmost",
  "utopia",
  "utp",
  "utter",
  "utterly",
  "uu",
  "uv",
  "uw",
  "ux",
  "uzbekistan",
  "v",
  "va",
  "vac",
  "vacancies",
  "vacancy",
  "vacant",
  "vacation",
  "vacations",
  "vaccination",
  "vaccine",
  "vaccines",
  "vacuum",
  "vagina",
  "vaginal",
  "vaginas",
  "vague",
  "vail",
  "vain",
  "vaio",
  "val",
  "vale",
  "valencia",
  "valentine",
  "valentines",
  "valentino",
  "valerie",
  "valet",
  "valid",
  "validate",
  "validated",
  "validation",
  "validity",
  "valium",
  "vallarta",
  "valley",
  "valleys",
  "valuable",
  "valuation",
  "value",
  "valued",
  "values",
  "valve",
  "valves",
  "vampire",
  "vampires",
  "van",
  "vance",
  "vancouver",
  "vanderbilt",
  "vanessa",
  "vanguard",
  "vanilla",
  "vanity",
  "vans",
  "vantage",
  "vanuatu",
  "vapor",
  "var",
  "variability",
  "variable",
  "variables",
  "variance",
  "variant",
  "variants",
  "variation",
  "variations",
  "varied",
  "varies",
  "varieties",
  "variety",
  "various",
  "varsity",
  "vary",
  "varying",
  "vascular",
  "vase",
  "vases",
  "vast",
  "vat",
  "vatican",
  "vaughan",
  "vaughn",
  "vault",
  "vaults",
  "vauxhall",
  "vb",
  "vbulletin",
  "vc",
  "vcd",
  "vcr",
  "vdata",
  "ve",
  "vector",
  "vectors",
  "vega",
  "vegan",
  "vegas",
  "vegetable",
  "vegetables",
  "vegetarian",
  "vegetation",
  "vehicle",
  "vehicles",
  "veil",
  "vein",
  "veins",
  "vel",
  "velcro",
  "velocity",
  "velvet",
  "vending",
  "vendor",
  "vendors",
  "venetian",
  "venezuela",
  "vengeance",
  "venice",
  "venom",
  "vent",
  "ventilation",
  "ventricular",
  "ventura",
  "venture",
  "ventures",
  "venue",
  "venues",
  "venus",
  "ver",
  "vera",
  "verb",
  "verbal",
  "verbatim",
  "verbs",
  "verde",
  "verdict",
  "verification",
  "verified",
  "verify",
  "verifying",
  "verisign",
  "veritas",
  "verizon",
  "verlag",
  "vermont",
  "vernon",
  "verona",
  "veronica",
  "versa",
  "versace",
  "versatile",
  "verse",
  "verses",
  "version",
  "versions",
  "versus",
  "vertex",
  "vertical",
  "vertically",
  "vertices",
  "very",
  "verzeichnis",
  "vessel",
  "vessels",
  "vest",
  "vested",
  "vests",
  "vet",
  "veteran",
  "veterans",
  "veterinary",
  "veto",
  "vets",
  "vf",
  "vg",
  "vga",
  "vgroup",
  "vhf",
  "vhs",
  "vi",
  "via",
  "viability",
  "viable",
  "viagra",
  "vibe",
  "vibrant",
  "vibrating",
  "vibration",
  "vibrator",
  "vibrators",
  "vic",
  "vice",
  "vicinity",
  "vicious",
  "vicki",
  "vicodin",
  "victim",
  "victims",
  "victor",
  "victoria",
  "victorian",
  "victories",
  "victory",
  "vid",
  "vida",
  "video",
  "videogames",
  "videos",
  "videotape",
  "vids",
  "vie",
  "vienna",
  "viet",
  "vietnam",
  "vietnamese",
  "view",
  "viewed",
  "viewer",
  "viewers",
  "viewing",
  "viewpicture",
  "viewpoint",
  "viewpoints",
  "views",
  "viewsonic",
  "vigorous",
  "vii",
  "viii",
  "viking",
  "vikings",
  "villa",
  "village",
  "villagers",
  "villages",
  "villas",
  "ville",
  "vin",
  "vince",
  "vincent",
  "vinci",
  "vine",
  "vinegar",
  "vines",
  "vineyard",
  "vineyards",
  "vintage",
  "vinyl",
  "viola",
  "violate",
  "violated",
  "violates",
  "violating",
  "violation",
  "violations",
  "violence",
  "violent",
  "violet",
  "violin",
  "vioxx",
  "vip",
  "viper",
  "viral",
  "virgin",
  "virginia",
  "virgins",
  "virtual",
  "virtually",
  "virtue",
  "virtues",
  "virus",
  "viruses",
  "vis",
  "visa",
  "visas",
  "visibility",
  "visible",
  "vision",
  "visionary",
  "visions",
  "visit",
  "visitation",
  "visited",
  "visiting",
  "visitor",
  "visitors",
  "visits",
  "visor",
  "vista",
  "visual",
  "visualization",
  "visually",
  "vita",
  "vitae",
  "vital",
  "vitality",
  "vitamin",
  "vitamins",
  "vitro",
  "viva",
  "vivian",
  "vivid",
  "vivo",
  "viz",
  "vl",
  "vladimir",
  "vlan",
  "vm",
  "vn",
  "vo",
  "voc",
  "vocabulary",
  "vocal",
  "vocals",
  "vocational",
  "vodafone",
  "vodka",
  "vogue",
  "voice",
  "voicemail",
  "voices",
  "void",
  "voip",
  "vol",
  "volatile",
  "volatility",
  "volcanic",
  "volcano",
  "volkswagen",
  "volleyball",
  "vols",
  "volt",
  "voltage",
  "volts",
  "volume",
  "volumes",
  "voluntarily",
  "voluntary",
  "volunteer",
  "volunteering",
  "volunteers",
  "volvo",
  "vomiting",
  "von",
  "vonage",
  "voodoo",
  "voor",
  "vor",
  "vortex",
  "vos",
  "vote",
  "voted",
  "voter",
  "voters",
  "votes",
  "voting",
  "voucher",
  "vouchers",
  "vous",
  "vows",
  "vox",
  "voyage",
  "voyager",
  "voyer",
  "voyeur",
  "voyeurweb",
  "voyuer",
  "vp",
  "vpn",
  "vr",
  "vs",
  "vsnet",
  "vt",
  "vu",
  "vuitton",
  "vulnerabilities",
  "vulnerability",
  "vulnerable",
  "vv",
  "vw",
  "vx",
  "w",
  "wa",
  "wac",
  "wacky",
  "waco",
  "wade",
  "wage",
  "wagering",
  "wages",
  "wagner",
  "wagon",
  "wai",
  "waist",
  "wait",
  "waited",
  "waiting",
  "waits",
  "waive",
  "waived",
  "waiver",
  "wake",
  "wakefield",
  "waking",
  "wal",
  "walden",
  "wales",
  "walk",
  "walked",
  "walker",
  "walking",
  "walkman",
  "walks",
  "wall",
  "wallace",
  "wallet",
  "wallets",
  "wallis",
  "wallpaper",
  "wallpapers",
  "walls",
  "walmart",
  "walnut",
  "walsh",
  "walt",
  "walter",
  "walters",
  "waltham",
  "walton",
  "waltz",
  "wan",
  "wand",
  "wander",
  "wandering",
  "wang",
  "wanna",
  "want",
  "wanted",
  "wanting",
  "wants",
  "wap",
  "war",
  "warcraft",
  "ward",
  "wardrobe",
  "wards",
  "ware",
  "warehouse",
  "warehouses",
  "warehousing",
  "warez",
  "warfare",
  "warm",
  "warmer",
  "warming",
  "warmth",
  "warn",
  "warned",
  "warner",
  "warning",
  "warnings",
  "warns",
  "warp",
  "warrant",
  "warranted",
  "warranties",
  "warrants",
  "warranty",
  "warren",
  "warrior",
  "warriors",
  "wars",
  "warsaw",
  "warwick",
  "warwickshire",
  "was",
  "wash",
  "washable",
  "washed",
  "washer",
  "washers",
  "washing",
  "washington",
  "waste",
  "wasted",
  "wastes",
  "wastewater",
  "wasting",
  "wat",
  "watch",
  "watchdog",
  "watched",
  "watchers",
  "watches",
  "watching",
  "watchlist",
  "water",
  "watercolor",
  "waterfall",
  "waterford",
  "waterfront",
  "watering",
  "waterloo",
  "waterproof",
  "waters",
  "watershed",
  "watersports",
  "watertown",
  "waterways",
  "watkins",
  "watson",
  "watt",
  "watts",
  "wav",
  "wave",
  "waveform",
  "wavelength",
  "waves",
  "wax",
  "way",
  "wayne",
  "ways",
  "wb",
  "wc",
  "wd",
  "we",
  "weak",
  "weaker",
  "weakness",
  "weaknesses",
  "wealth",
  "wealthy",
  "weapon",
  "weapons",
  "wear",
  "wearing",
  "wears",
  "weary",
  "weather",
  "weave",
  "weaver",
  "weaving",
  "web",
  "webb",
  "webcam",
  "webcams",
  "webcast",
  "webcasts",
  "webdesign",
  "weber",
  "webhosting",
  "webinar",
  "weblog",
  "weblogic",
  "weblogs",
  "webmail",
  "webmaster",
  "webmasters",
  "webmd",
  "webmin",
  "webpage",
  "webring",
  "webs",
  "webshots",
  "website",
  "websites",
  "websphere",
  "webster",
  "wed",
  "wedding",
  "weddings",
  "wedge",
  "wednesday",
  "wednesdays",
  "wee",
  "weed",
  "weeds",
  "week",
  "weekday",
  "weekend",
  "weekends",
  "weekly",
  "weeks",
  "weezer",
  "wei",
  "weigh",
  "weighed",
  "weighing",
  "weighs",
  "weight",
  "weighted",
  "weighting",
  "weights",
  "weir",
  "weird",
  "weiss",
  "welch",
  "welcome",
  "welcomed",
  "welcomes",
  "welcoming",
  "weld",
  "welding",
  "welfare",
  "well",
  "wellbutrin",
  "wellington",
  "wellness",
  "wells",
  "welsh",
  "wen",
  "wendy",
  "went",
  "were",
  "werner",
  "wes",
  "wesley",
  "wesleyan",
  "west",
  "westchester",
  "western",
  "westerns",
  "westfield",
  "westin",
  "westlife",
  "westminster",
  "weston",
  "westport",
  "westwood",
  "wet",
  "wetland",
  "wetlands",
  "weymouth",
  "wf",
  "wg",
  "wh",
  "whale",
  "whales",
  "wharf",
  "what",
  "whatever",
  "whats",
  "whatsoever",
  "wheat",
  "wheaton",
  "wheel",
  "wheelchair",
  "wheeled",
  "wheeler",
  "wheels",
  "when",
  "whenever",
  "where",
  "whereas",
  "whereby",
  "wherein",
  "wherever",
  "whether",
  "which",
  "whichever",
  "while",
  "whilst",
  "whip",
  "whipped",
  "whipping",
  "whirlpool",
  "whiskey",
  "whisky",
  "whisper",
  "whispered",
  "whistle",
  "whistler",
  "white",
  "whites",
  "whitewater",
  "whitman",
  "whitney",
  "who",
  "whoever",
  "whois",
  "whole",
  "wholesale",
  "wholesaler",
  "wholesalers",
  "wholly",
  "whom",
  "whore",
  "whores",
  "whose",
  "why",
  "wi",
  "wichita",
  "wicked",
  "wicker",
  "wide",
  "widely",
  "widening",
  "wider",
  "widescreen",
  "widespread",
  "widest",
  "widget",
  "widgets",
  "widow",
  "width",
  "wie",
  "wien",
  "wife",
  "wifi",
  "wig",
  "wigan",
  "wight",
  "wigs",
  "wiki",
  "wikimedia",
  "wikipedia",
  "wil",
  "wilcox",
  "wild",
  "wildcats",
  "wilde",
  "wilder",
  "wilderness",
  "wildlife",
  "wiley",
  "wilhelm",
  "wilkes",
  "wilkins",
  "wilkinson",
  "willard",
  "william",
  "williams",
  "williamsburg",
  "williamson",
  "willie",
  "willing",
  "willingness",
  "willis",
  "willow",
  "wills",
  "willy",
  "wilmington",
  "wilson",
  "wilton",
  "wiltshire",
  "wimbledon",
  "win",
  "winamp",
  "winchester",
  "wind",
  "winding",
  "window",
  "windows",
  "winds",
  "windshield",
  "windsor",
  "windy",
  "wine",
  "winery",
  "wines",
  "wing",
  "winged",
  "wings",
  "wink",
  "winme",
  "winner",
  "winners",
  "winnie",
  "winning",
  "winnipeg",
  "winnt",
  "wins",
  "winston",
  "winter",
  "winters",
  "winxp",
  "wipe",
  "wire",
  "wired",
  "wireless",
  "wires",
  "wiring",
  "wisconsin",
  "wisdom",
  "wise",
  "wisely",
  "wish",
  "wished",
  "wishes",
  "wishing",
  "wishlist",
  "wit",
  "witch",
  "witches",
  "with",
  "withdraw",
  "withdrawal",
  "withdrawn",
  "withheld",
  "withholding",
  "within",
  "without",
  "withstand",
  "witness",
  "witnessed",
  "witnesses",
  "witty",
  "wives",
  "wizard",
  "wizards",
  "wj",
  "wk",
  "wks",
  "wl",
  "wlan",
  "wm",
  "wma",
  "wmd",
  "wmv",
  "wn",
  "wnba",
  "wo",
  "woes",
  "woke",
  "wolf",
  "wolfe",
  "wolfgang",
  "wolverhampton",
  "wolves",
  "woman",
  "women",
  "womens",
  "won",
  "wonder",
  "wondered",
  "wonderful",
  "wonderfully",
  "wondering",
  "wonderland",
  "wonders",
  "wong",
  "wont",
  "woo",
  "wood",
  "wooden",
  "woodland",
  "woodlands",
  "woods",
  "woodstock",
  "woodward",
  "woodworking",
  "woody",
  "wool",
  "worcester",
  "worcestershire",
  "word",
  "wording",
  "wordpress",
  "words",
  "wore",
  "work",
  "workaround",
  "workbook",
  "worked",
  "worker",
  "workers",
  "workflow",
  "workforce",
  "workgroup",
  "working",
  "workload",
  "workout",
  "workplace",
  "works",
  "worksheet",
  "worksheets",
  "workshop",
  "workshops",
  "workspace",
  "workstation",
  "workstations",
  "world",
  "worldcat",
  "worlds",
  "worldsex",
  "worldwide",
  "worm",
  "worms",
  "worn",
  "worried",
  "worries",
  "worry",
  "worrying",
  "worse",
  "worship",
  "worst",
  "worth",
  "worthwhile",
  "worthy",
  "would",
  "wound",
  "wounded",
  "wounds",
  "woven",
  "wow",
  "wp",
  "wr",
  "wrap",
  "wrapped",
  "wrapper",
  "wrapping",
  "wraps",
  "wrath",
  "wreck",
  "wrench",
  "wrestling",
  "wretch",
  "wright",
  "wrist",
  "writ",
  "write",
  "writer",
  "writers",
  "writes",
  "writing",
  "writings",
  "written",
  "wrong",
  "wrongful",
  "wrote",
  "wrought",
  "ws",
  "wsop",
  "wt",
  "wtf",
  "wto",
  "wu",
  "wv",
  "ww",
  "wwe",
  "wwf",
  "wwii",
  "www",
  "wx",
  "wy",
  "wyatt",
  "wyndham",
  "wyoming",
  "x",
  "xa",
  "xanax",
  "xavier",
  "xb",
  "xbox",
  "xc",
  "xd",
  "xda",
  "xe",
  "xemacs",
  "xenical",
  "xeon",
  "xerox",
  "xf",
  "xhtml",
  "xi",
  "xii",
  "xiii",
  "xiv",
  "xl",
  "xlibs",
  "xm",
  "xmas",
  "xml",
  "xnxx",
  "xoops",
  "xp",
  "xpress",
  "xr",
  "xs",
  "xsl",
  "xslt",
  "xt",
  "xtc",
  "xtreme",
  "xu",
  "xv",
  "xvi",
  "xvid",
  "xx",
  "xxl",
  "xxx",
  "xxxx",
  "xy",
  "y",
  "ya",
  "yacht",
  "yachts",
  "yahoo",
  "yakima",
  "yale",
  "yamaha",
  "yan",
  "yang",
  "yankee",
  "yankees",
  "yard",
  "yards",
  "yarn",
  "yates",
  "yay",
  "yd",
  "yds",
  "ye",
  "yea",
  "yeah",
  "year",
  "yearbook",
  "yearly",
  "years",
  "yeast",
  "yell",
  "yellow",
  "yellowstone",
  "yemen",
  "yen",
  "yep",
  "yer",
  "yes",
  "yesterday",
  "yet",
  "yi",
  "yield",
  "yielded",
  "yielding",
  "yields",
  "yin",
  "ymca",
  "yn",
  "yo",
  "yoga",
  "yogurt",
  "york",
  "yorker",
  "yorkshire",
  "yosemite",
  "you",
  "young",
  "younger",
  "youngest",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "youth",
  "youths",
  "yr",
  "yrs",
  "yu",
  "yuan",
  "yugoslav",
  "yugoslavia",
  "yukon",
  "yum",
  "yummy",
  "yup",
  "yves",
  "yy",
  "yyyy",
  "z",
  "za",
  "zach",
  "zaire",
  "zambia",
  "zdnet",
  "zealand",
  "zebra",
  "zelda",
  "zen",
  "zenith",
  "zeppelin",
  "zero",
  "zerodegrees",
  "zeta",
  "zh",
  "zhang",
  "ziff",
  "zimbabwe",
  "zinc",
  "zine",
  "zion",
  "zip",
  "zipper",
  "zirconia",
  "zodiac",
  "zoe",
  "zoloft",
  "zombie",
  "zone",
  "zones",
  "zoning",
  "zoo",
  "zoofilia",
  "zoology",
  "zoom",
  "zoophilia",
  "zope",
  "zshops",
  "zu",
  "zum",
  "zur",
  "zurich",
  "zus",
  "zyban",
  "zz"
]);

// src/LL/LLENDash.ts
var okWords = ["Fritz-John", "Levi-Civita", "Primal-Dual", "Zig-Zag"];
function LLENDash(doc, txt) {
  const ranges = [];
  for (const match of txt.text.matchAll(
    /[A-Z][a-zA-Z]*[a-z](?:-[A-Z][a-zA-Z]*[a-z])+/g
  )) {
    if (okWords.includes(match[0])) continue;
    const words = match[0].split("-");
    if (words.every((word) => wordSet.has(word.toLowerCase()))) continue;
    if (words.some((word) => word.length === 1)) continue;
    if (!txt.isValid(match.index)) continue;
    if (isLabelOrURL(txt.text, match)) continue;
    const i = match.index;
    if (i && i > 0 && /\s/.test(txt.text[i - 1])) {
      let k = i - 2;
      while (k >= 0 && /[a-zA-Z]/.test(txt.text[k])) k--;
      const precedingWord = txt.text.slice(k + 1, i - 1);
      if (precedingWord.length > 1 && !wordSet.has(precedingWord.toLowerCase()))
        continue;
    }
    ranges.push(match2range(doc, match));
  }
  const code = "LLENDash";
  const message = messages[code];
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLEqnarray.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/regex2diagnostics.ts
init_define_LATEXLINT_DEFAULTS();
function regex2diagnostics(doc, txt, code, pattern2) {
  let ranges = [];
  for (const match of txt.text.matchAll(pattern2)) {
    if (!txt.isValid(match.index)) continue;
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, messages[code], ranges);
}

// src/LL/LLEqnarray.ts
function LLEqnarray(doc, txt) {
  return regex2diagnostics(
    doc,
    txt,
    "LLEqnarray",
    /\\begin\{eqnarray\*?\}/g
  );
}

// src/LL/LLErrCompOps.ts
init_define_LATEXLINT_DEFAULTS();
var targetRegex = /(?<![<>=a-zA-Z])(?:<\s*=|=\s*<|\\leq?\s*=|=\s*\\leq?|>\s*=|=\s*>|\\geq?\s*=|=\s*\\geq?)(?![<>=a-zA-Z])/g;
function LLErrCompOps(doc, txt) {
  const code = "LLErrCompOps";
  const message = [];
  const ranges = [];
  for (const match of txt.text.matchAll(targetRegex)) {
    if (!txt.isValid(match.index)) continue;
    if (doc.languageId === "markdown" && (match[0] === "<=" || match[0] === "=>")) continue;
    if (isLabelOrURL(txt.text, match)) continue;
    message.push(messages[code]);
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLFootnote.ts
init_define_LATEXLINT_DEFAULTS();
function LLFootnote(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const code = "LLFootnote";
  let ranges = [];
  let localMessages = [];
  for (const match of txt.text.matchAll(/\s\\footnote{/g)) {
    if (txt.isPreamble(match.index)) continue;
    if (!txt.isValid(match.index)) continue;
    let lineEnd = match.index + 1;
    let isProblematic = false;
    let message = messages[code];
    let lineStart = lineEnd;
    while (lineStart > 0 && txt.text[lineStart - 1] !== "\n") lineStart--;
    const firstLine = txt.text.substring(lineStart, lineEnd);
    if (firstLine.match(/\S/))
      isProblematic = true;
    else
      while (lineEnd > 0) {
        lineEnd = lineStart;
        lineStart = lineEnd - 1;
        while (lineStart > 0 && txt.text[lineStart - 1] !== "\n") lineStart--;
        if (lineStart === 0) break;
        const line = txt.text.substring(lineStart, lineEnd);
        const commentIdx = line.indexOf("%");
        if (commentIdx === -1) {
          isProblematic = true;
          message += " Adding % at the end of the line before the footnote can prevent this issue.";
          break;
        } else {
          const lineValid = txt.text.substring(lineStart, lineStart + commentIdx);
          const SMatches = [...lineValid.matchAll(/\S/g)];
          if (SMatches.length === 0) continue;
          const lastSIdx = SMatches[SMatches.length - 1].index;
          if (lastSIdx !== void 0 && lastSIdx + 1 === commentIdx)
            isProblematic = false;
          else
            isProblematic = true;
          break;
        }
      }
    if (isProblematic) {
      const startPos = doc.positionAt(match.index + 1);
      const endPos = doc.positionAt(match.index + match[0].length);
      ranges.push(new Range(startPos, endPos));
      localMessages.push(message);
    }
  }
  return ranges2diagnostics(code, localMessages, ranges);
}

// src/LL/LLHeading.ts
init_define_LATEXLINT_DEFAULTS();
function LLHeading(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const code = "LLHeading";
  const message = [];
  const ranges = [];
  const headingLevels = {
    "chapter": 1,
    "section": 2,
    "subsection": 3,
    "subsubsection": 4
  };
  const headingNames = ["chapter", "section", "subsection", "subsubsection"];
  let lastLevel = 0;
  const headingRegex = /\\(chapter|section|subsection|subsubsection)\*?\{/g;
  for (const headingMatch of txt.text.matchAll(headingRegex)) {
    const headingType = headingMatch[1];
    const currentLevel = headingLevels[headingType];
    if (!txt.isValid(headingMatch.index)) continue;
    if (lastLevel > 0 && currentLevel - lastLevel > 1) {
      const currentLevelName = headingNames[currentLevel - 1];
      const expectedLevel = lastLevel + 1;
      const expectedLevelName = headingNames[expectedLevel - 1];
      message.push(messages[code].replaceAll("%1", currentLevelName).replaceAll("%2", expectedLevelName));
      ranges.push(match2range(doc, headingMatch));
    }
    lastLevel = currentLevel;
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLLlGg.ts
init_define_LATEXLINT_DEFAULTS();
var correctCommandsLlGg = {
  "<<": "\\ll",
  ">>": "\\gg"
};
function LLLlGg(doc, txt) {
  const code = "LLLlGg";
  let message = [];
  let ranges = [];
  for (const match of txt.text.matchAll(/(?<!<)<<(?!<)|(?<!>)>>(?!>)/g)) {
    if (!txt.isValid(match.index)) continue;
    const i = match.index;
    if (i > 0 && "{,".includes(txt.text[i - 1])) continue;
    if (i + 2 < txt.text.length && "},".includes(txt.text[i + 2])) continue;
    message.push(messages[code].replaceAll("%1", correctCommandsLlGg[match[0]]).replaceAll("%2", match[0]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLMathPunctuation.ts
init_define_LATEXLINT_DEFAULTS();
var MATH_PUNCTUATION_PATTERN = /(?<!\\right)([.,])\s*\\end\{(?:align|alignat|equation|gather)\*?\}\s*([A-Za-z])/g;
var isUppercaseAscii = (char) => {
  const code = char.charCodeAt(0);
  return code >= 65 && code <= 90;
};
var isLowercaseAscii = (char) => {
  const code = char.charCodeAt(0);
  return code >= 97 && code <= 122;
};
function LLMathPunctuation(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const code = "LLMathPunctuation";
  const message = messages[code];
  const ranges = [];
  for (const match of txt.text.matchAll(MATH_PUNCTUATION_PATTERN)) {
    if (match.index === void 0) continue;
    if (!txt.isValid(match.index)) continue;
    const punctuation = match[1];
    const nextCharacter = match[2];
    if (punctuation === "," && !isUppercaseAscii(nextCharacter)) continue;
    if (punctuation === "." && !isLowercaseAscii(nextCharacter)) continue;
    ranges.push(new Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLNonASCII.ts
init_define_LATEXLINT_DEFAULTS();
function LLNonASCII(doc, txt) {
  return regex2diagnostics(
    doc,
    txt,
    "LLNonASCII",
    /[\u3000\uFF01-\uFF07\uFF0A-\uFF0B\uFF0D\uFF0F-\uFF5E]/g
  );
}

// src/LL/LLNonstandard.ts
init_define_LATEXLINT_DEFAULTS();
function LLNonstandard(doc, txt) {
  const ranges = [];
  const regexList = [
    // iff / Iff
    /(?:^|\s)(?:iff|Iff)(?![A-Za-z])/g,
    // \therefore / \because
    /\\(?:therefore|because)(?![a-zA-Z])/g,
    // \fallingdotseq / \risingdotseq
    /\\(?:fallingdotseq|risingdotseq)(?![a-zA-Z])/g,
    // {}_n C_k / {}_n \mathrm{C}_k
    /\{\}_n (?:\\mathrm\{C\}|C)_k/g
  ];
  for (const regex of regexList)
    for (const match of txt.text.matchAll(regex)) {
      if (!txt.isValid(match.index)) continue;
      const startPos = doc.positionAt(match.index);
      const endPos = doc.positionAt(match.index + match[0].length);
      ranges.push(new Range(startPos, endPos));
    }
  const code = "LLNonstandard";
  const message = messages[code];
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLOperator.ts
init_define_LATEXLINT_DEFAULTS();
var operatorCommandPattern = /(?:^|[^_^]\s*)\\mathrm\{([A-Za-z]{2,})\}\s*[0-9A-Za-z]/g;
var operatorDefinitionPattern = /\\newcommand\{\\[A-Za-z]+\}\{\\mathrm\{([A-Za-z]{2,})\}\}/g;
var commandsToDetect = /* @__PURE__ */ new Set([
  // Linear algebra
  "det",
  "rank",
  "tr",
  "trace",
  "span",
  "dim",
  "ker",
  "coker",
  "im",
  "img",
  "null",
  "nullity",
  "diag",
  "spec",
  "spr",
  // spectral radius
  "adj",
  "cof",
  // cofactor
  "minor",
  "char",
  "eig",
  "eigval",
  "eigvec",
  // Algebra / number theory
  "gcd",
  "lcm",
  "sgn",
  "sign",
  "ord",
  "val",
  "disc",
  "res",
  // resultant
  "rad",
  "gal",
  "aut",
  "end",
  "hom",
  "iso",
  "ext",
  "tor",
  "ann",
  "spec",
  "proj",
  // Complex analysis / real-imaginary parts
  "re",
  "im",
  "arg",
  "log",
  "res",
  "supp",
  // Optimization
  "argmax",
  "argmin",
  "esssup",
  "essinf",
  "prox",
  "proj",
  // Probability / statistics
  "pr",
  "var",
  "cov",
  "corr",
  "sd",
  // standard deviation
  "se",
  // standard error
  "bias",
  "mse",
  "med",
  "mode",
  "quantile",
  "exp",
  "kl",
  "tv",
  // Geometry / vector calculus
  "vol",
  "area",
  "diam",
  "dist",
  "length",
  "grad",
  "div",
  "curl",
  "rot",
  "lap",
  "hess",
  "jac",
  "ric",
  "scal",
  // Functional analysis / operators
  "op",
  "ess",
  "dom",
  "ran",
  "graph",
  "id",
  "supp",
  "conv",
  "cl",
  "int",
  "bd",
  "relint",
  // Category theory / logic / CS-adjacent math
  "ob",
  "mor",
  "nat",
  "colim",
  "codim",
  "codom",
  "dom",
  "fix",
  "poly",
  "polylog"
]);
function LLOperator(doc, txt) {
  const code = "LLOperator";
  const message = messages[code];
  const ranges = [];
  for (const pattern2 of [operatorCommandPattern, operatorDefinitionPattern])
    for (const match of txt.text.matchAll(pattern2)) {
      if (match.index === void 0) continue;
      if (!txt.isValid(match.index)) continue;
      if (!commandsToDetect.has(match[1].toLowerCase())) continue;
      ranges.push(new Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length)));
    }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLPeriod.ts
init_define_LATEXLINT_DEFAULTS();
var abbreviations = [
  "[iI]\\.e\\.",
  "[eE]\\.g\\.",
  "[aA]\\.k\\.a\\.",
  "[iI]\\.i\\.d\\.",
  "[wW]\\.r\\.t\\.",
  "[wW]\\.l\\.o\\.g\\.",
  "resp\\.",
  "Mr\\.",
  "Mrs\\.",
  "Ms\\."
];
var pattern = new RegExp(`\\b(?:${abbreviations.join("|")}) `, "g");
function LLPeriod(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const code = "LLPeriod";
  const message = [];
  const ranges = [];
  for (const match of txt.text.matchAll(pattern)) {
    if (!txt.isValid(match.index)) continue;
    const abbreviation = match[0].trim();
    let customizedMessage;
    if (["ie", "Ie", "eg", "Eg", "aka", "Aka"].includes(abbreviation.replaceAll(".", "")))
      customizedMessage = messages[code].replaceAll("%1", abbreviation).slice(0, -1) + ', or a comma "' + abbreviation + '," in American English.';
    else
      customizedMessage = messages[code].replaceAll("%1", abbreviation);
    message.push(customizedMessage);
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLRefEq.ts
init_define_LATEXLINT_DEFAULTS();
function LLRefEq(doc, txt) {
  if (doc.languageId !== "latex") return [];
  return regex2diagnostics(
    doc,
    txt,
    "LLRefEq",
    /\(\\ref\{eq:/g
  );
}

// src/LL/LLSharp.ts
init_define_LATEXLINT_DEFAULTS();
function LLSharp(doc, txt) {
  return regex2diagnostics(
    doc,
    txt,
    "LLSharp",
    /(?<!\^)(?<!_)(?<![A-Za-z])\\sharp(?=\s*(?:[A-Z]|\\\{))/g
  );
}

// src/LL/LLSI.ts
init_define_LATEXLINT_DEFAULTS();
function LLSI(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const ranges = [];
  for (const match of txt.text.matchAll(/B(?![a-zA-Z])/g)) {
    let i = match.index;
    if (!/(?:k|K|M|G|T|P|E|Z|Y|Ki|Mi|Gi|Ti|Pi|Ei|Zi|Yi)$/.test(
      txt.text.slice(Math.max(0, i - 2), i)
    ))
      continue;
    let i2 = txt.text[match.index - 1] === "i" ? match.index - 2 : match.index - 1;
    if (/[a-zA-Z\\]/.test(txt.text[i2 - 1])) continue;
    let is_valid = true;
    while (i > 0 && !/\d/.test(txt.text[i])) {
      if (txt.text[i] === ")") is_valid = false;
      i--;
    }
    if (!is_valid) continue;
    while (i > 0 && /\d/.test(txt.text[i - 1])) i--;
    if (i > 0) {
      const charBeforeNumber = txt.text[i - 1];
      if (["@", "_", "/", "\\"].includes(charBeforeNumber)) continue;
    }
    const j = match.index + 1;
    const match2 = txt.text.slice(i, j).match(/\d\S* ?\S*/);
    if (!match2 || match2[0].length !== j - i) continue;
    const startPos = doc.positionAt(i);
    const endPos = doc.positionAt(j);
    ranges.push(new Range(startPos, endPos));
  }
  const code = "LLSI";
  const message = messages[code];
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLSortedCites.ts
init_define_LATEXLINT_DEFAULTS();
var bibliographyPackagePattern = /\\usepackage(?:\[[^\]]*\])?\{(?:cite|biblatex)\}/;
var subfilesDocumentClassPattern = /\\documentclass(?:\s*\[[^\]]*\])?\s*\{\s*subfiles\s*\}/g;
var bibtexPattern = /\\bibliography\{/g;
var stylePattern = /\\bibliographystyle\{(plain|unsrt|abbrv|plainnat|unsrtnat|abbrvnat)\}/g;
var natbibPattern = /\\usepackage(\[[^\]]*\])?\{natbib\}/g;
var citePattern = /\\cite[tp]?\{/g;
function LLSortedCites(doc, txt) {
  if (doc.languageId !== "latex") return [];
  for (const match of txt.text.matchAll(subfilesDocumentClassPattern))
    if (txt.isValid(match.index)) return [];
  if (bibliographyPackagePattern.test(txt.text))
    return [];
  let firstMatch;
  for (const match of txt.text.matchAll(bibtexPattern)) {
    const idx = match.index;
    if (idx !== void 0 && txt.isValid(idx)) {
      firstMatch = match;
      break;
    }
  }
  if (!firstMatch) return [];
  let hasTargetStyle = false;
  let styleName = "";
  for (const match of txt.text.matchAll(stylePattern)) {
    const idx = match.index;
    if (idx !== null && txt.isValid(idx)) {
      hasTargetStyle = true;
      styleName = match[1]?.trim() ?? "";
      break;
    }
  }
  if (!hasTargetStyle) return [];
  let haveNatbib = false;
  let hasNatbibSort = false;
  let hasNatbibNumbers = false;
  for (const match of txt.text.matchAll(natbibPattern)) {
    const idx = match.index;
    if (idx === null || !txt.isValid(idx)) continue;
    haveNatbib = true;
    const options = match[1];
    if (!options) continue;
    if (options.includes("sort")) hasNatbibSort = true;
    if (options.includes("numbers")) hasNatbibNumbers = true;
  }
  if (haveNatbib && hasNatbibNumbers && hasNatbibSort) return [];
  if (haveNatbib && !hasNatbibNumbers && styleName.includes("nat")) return [];
  let hasCommaInAnyCiteArgument = false;
  for (const match of txt.text.matchAll(citePattern)) {
    const openBraceIndex = (match.index ?? -1) + match[0].length - 1;
    if (openBraceIndex < 0) continue;
    const closeBraceIndex = txt.text.indexOf("}", openBraceIndex);
    const commaIndex = txt.text.indexOf(",", openBraceIndex);
    if (commaIndex !== -1 && (closeBraceIndex === -1 || commaIndex < closeBraceIndex)) {
      hasCommaInAnyCiteArgument = true;
      break;
    }
  }
  if (!hasCommaInAnyCiteArgument) return [];
  const range = match2range(doc, firstMatch);
  const message = messages["LLSortedCites"];
  return ranges2diagnostics("LLSortedCites", [message], [range]);
}

// src/LL/LLSpaceEnglish.ts
init_define_LATEXLINT_DEFAULTS();
function LLSpaceEnglish(doc, txt) {
  const code = "LLSpaceEnglish";
  const ranges = [];
  const text = txt.text;
  const targetRegex2 = /(?<=[a-zA-Z])(\$|\\\(|\\\))(?=[a-zA-Z])/gu;
  for (const match of text.matchAll(targetRegex2)) {
    const token = match[0];
    const start = match.index ?? 0;
    if (!txt.isValid(start)) continue;
    const end = start + token.length;
    const afterTwoChars = text.slice(end, Math.min(end + 2, text.length)).toLowerCase();
    if (afterTwoChars.startsWith("s") && !/[a-zA-Z]/.test(afterTwoChars[1] ?? "")) continue;
    const afterThreeChars = text.slice(end, Math.min(end + 3, text.length)).toLowerCase();
    if (afterThreeChars.startsWith("th") && !/[a-zA-Z]/.test(afterThreeChars[2] ?? "")) continue;
    let i = start - 1;
    while (i >= 0 && /[a-zA-Z]/.test(text[i])) i--;
    if (i < start - 1 && text[i] === "\\") continue;
    ranges.push(new Range(doc.positionAt(start), doc.positionAt(end)));
  }
  return ranges2diagnostics(code, messages[code], ranges);
}

// src/LL/LLSpaceJapanese.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/detectMathSpace.ts
init_define_LATEXLINT_DEFAULTS();
function detectMathSpace(doc, txt) {
  const ranges = [];
  const text = txt.text;
  const REGEXES = [
    new RegExp(`\\$[\u3041-\u3093\u30A1-\u30F6\uFF71-\uFF9D\uFF9E\uFF9F\u4E00-\u9FA0\u30FC]`, "gu"),
    // $日
    new RegExp(`[\u3041-\u3093\u30A1-\u30F6\uFF71-\uFF9D\uFF9E\uFF9F\u4E00-\u9FA0\u30FC]\\$`, "gu"),
    // 日$
    new RegExp(`[\u3041-\u3093\u30A1-\u30F6\uFF71-\uFF9D\uFF9E\uFF9F\u4E00-\u9FA0\u30FC]\\\\\\(`, "gu"),
    // 日\(
    new RegExp(`\\\\\\)[\u3041-\u3093\u30A1-\u30F6\uFF71-\uFF9D\uFF9E\uFF9F\u4E00-\u9FA0\u30FC]`, "gu")
    // \)日
  ];
  for (const regex of REGEXES) {
    const matches = [...text.matchAll(regex)];
    if (!matches) continue;
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index ?? 0;
      if (!txt.isValid(start)) continue;
      const startPos = doc.positionAt(start);
      const endPos = startPos.translate(0, matches[i][0].length);
      ranges.push(new Range(startPos, endPos));
    }
  }
  return ranges;
}

// src/LL/LLSpaceJapanese.ts
function LLSpaceJapanese(doc, txt) {
  const code = "LLSpaceJapanese";
  const ranges = detectMathSpace(doc, txt);
  return ranges2diagnostics(code, messages[code], ranges);
}

// src/LL/LLT.ts
init_define_LATEXLINT_DEFAULTS();
function LLT(doc, txt) {
  return regex2diagnostics(
    doc,
    txt,
    "LLT",
    /(?<!\[|}|\\(?:sum|prod|int)(?:_(?:[0-9A-Za-z]|\\[A-Za-z]+))?)\^T/g
  );
}

// src/LL/LLTextLint.ts
init_define_LATEXLINT_DEFAULTS();

// src/TextLint/usage_error.ts
init_define_LATEXLINT_DEFAULTS();

// src/TextLint/vocabulary_loader.ts
init_define_LATEXLINT_DEFAULTS();

// src/TextLint/my_vocabulary.json
var my_vocabulary_default = {
  comments: [
    "https://blogs.itmedia.co.jp/nagaichika/2011/06/post-af91.html",
    "https://business-textbooks.com/mistakeablejapanese100",
    "https://diamond.jp/articles/-/364058",
    "https://www.kurims.kyoto-u.ac.jp/~gokun/machigai.html",
    "https://www.nhk.or.jp/bunken/research/kotoba/20230901_5.html",
    "https://www.nhk.or.jp/bunken/research/kotoba/20240101_4.html",
    "https://www.sankei.com/article/20190331-S5JDHEJOGRODPOFGYVMADY24AI/",
    "https://www.merriam-webster.com/dictionary/et%20al.",
    "https://salon.mainichi-kotoba.jp/archives/95"
  ],
  entries_ja: [
    {
      yes: "\u3054\u6E05\u8074\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F",
      no: [
        "\u3054\u9759\u8074\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F",
        "\u5FA1\u9759\u8074\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3057\u305F"
      ],
      memo: [
        "\u9759\u8074\u306F\u8B1B\u6F14\u30FB\u8A71\u306A\u3069\u3092\u9759\u304B\u306B\u805E\u304F\u3053\u3068\u3092\u6307\u3057\u3001\u300C\u3054\u9759\u8074\u9858\u3044\u307E\u3059\u300D\u306A\u3069\u3068\u7528\u3044\u3089\u308C\u307E\u3059\u3002\u6E05\u8074\u306F\u4ED6\u4EBA\u304C\u81EA\u5206\u306E\u8A71\u3092\u805E\u304F\u3053\u3068\u3092\u656C\u3063\u3066\u3044\u3046\u8868\u73FE\u3067\u3001\u30D7\u30EC\u30BC\u30F3\u306E\u6700\u5F8C\u306B\u306F\u300C\u3054\u6E05\u8074\u300D\u306E\u65B9\u304C\u9069\u5207\u3068\u3055\u308C\u307E\u3059\u3002"
      ]
    },
    {
      yes: "\u307E\u305A\uFF0F\u7B2C\u4E00",
      no: [
        "\u307E\u305A\u7B2C1",
        "\u307E\u305A\u7B2C\u4E00"
      ],
      memo: [
        "[\u91CD\u8A00]"
      ]
    },
    {
      yes: "\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3",
      no: [
        "\u30B7\u30E5\u30DF\u30EC\u30FC\u30B7\u30E7\u30F3"
      ],
      memo: "\u82F1\u8A9E\u306E\u300Csimulation\u300D\u3092\u30AB\u30BF\u30AB\u30CA\u8868\u8A18\u3057\u305F\u3082\u306E\u3067\u3059\u3002"
    },
    {
      yes: "\u6570\u5B66\u7684\u5E30\u7D0D\u6CD5",
      no: [
        "(?<!\u6570\u5B66\u7684|\u69CB\u9020\u7684|\u8D85\u9650|\u6574\u790E|\u4F59)\u5E30\u7D0D\u6CD5(?:\u3067|\u306B\u3088\u308A|\u306B\u3088\u308B|\u306B\u3088\u3063\u3066)\u8A3C\u660E"
      ],
      memo: "\u4E00\u822C\u7684\u306B\u306F\u300C\u5E30\u7D0D\u6CD5\u300D\u306F\u300C\u6F14\u7E79\u6CD5\u300D\u3068\u5BFE\u6BD4\u3055\u308C\u308B\u8AD6\u7406\u7684\u306A\u63A8\u8AD6\u306E\u65B9\u6CD5\u3092\u6307\u3059\u7528\u8A9E\u3067\u3042\u308A\u3001\u6570\u5B66\u7684\u306A\u8A3C\u660E\u306E\u65B9\u6CD5\u3092\u6307\u3059\u7528\u8A9E\u3067\u306F\u306A\u3044\u3068\u3055\u308C\u308B\u3053\u3068\u304C\u591A\u3044\u3067\u3059\u3002Wikipedia\u306E\u8A18\u4E8B\u300C\u6570\u5B66\u7684\u5E30\u7D0D\u6CD5\u300D\u306B\u306F\u3001\u4EE5\u4E0B\u306E\u3088\u3046\u306A\u8A18\u8FF0\u304C\u3042\u308A\u307E\u3059\u3002\u300C\u6570\u5B66\u7684\u5E30\u7D0D\u6CD5\u3092\u7528\u3044\u305F\u8A3C\u660E\u306F\uFF08\u90E8\u5206\u304B\u3089\u5168\u4F53\u306E\u3042\u308A\u3055\u307E\u3092\u63A8\u5B9A\u3059\u308B\u3068\u3044\u3046\u610F\u5473\u306E\uFF09\u5E30\u7D0D\u3067\u306F\u306A\u304F\u3001\u7D14\u7C8B\u306B\u81EA\u7136\u6570\u306E\u69CB\u9020\u306B\u4F9D\u5B58\u3057\u305F\u6F14\u7E79\u8AD6\u7406\u306E\u4E00\u7A2E\u3067\u3042\u308B\u300D"
    },
    {
      yes: "\u6700\u521D\uFF0F\u4E00\u756A",
      no: [
        "1\u756A\u6700\u521D",
        "\u4E00\u756A\u6700\u521D"
      ],
      memo: [
        "[\u91CD\u8A00]"
      ]
    },
    {
      yes: "\u6700\u5F8C\uFF0F\u4E00\u756A\u5F8C",
      no: [
        "\u4E00\u756A\u6700\u5F8C"
      ],
      memo: [
        "[\u91CD\u8A00]"
      ]
    },
    {
      yes: "\u672A\u5B8C\u6210",
      no: [
        "\u307E\u3060\u672A\u5B8C\u6210"
      ],
      memo: [
        "[\u91CD\u8A00]"
      ]
    },
    {
      yes: "\u672A\u5B9A",
      no: [
        "\u307E\u3060\u672A\u5B9A"
      ],
      memo: [
        "[\u91CD\u8A00]"
      ]
    },
    {
      yes: "\u672A\u89E3\u6C7A",
      no: [
        "\u307E\u3060\u672A\u89E3\u6C7A"
      ],
      memo: [
        "[\u91CD\u8A00]"
      ]
    },
    {
      yes: "\u7B2C$num\u56DE",
      no: [
        "\u7B2C$num\u56DE\u76EE"
      ],
      memo: [
        "\u3053\u308C\u306F\u8A55\u4FA1\u304C\u5206\u304B\u308C\u308B\u8868\u73FE\u306E\u3088\u3046\u3067\u3059\u3002",
        "\u4E09\u7701\u5802\u56FD\u8A9E\u8F9E\u5178\u306E\u3059\u3059\u3081\u300C\u305D\u306E73 \u300E\u7B2C1\u30DA\u30FC\u30B8\u76EE\u300F\u3068\u8A00\u3063\u3066\u3082\u3088\u3055\u305D\u3046\u3002\u300D\u306B\u306F\u3001\u4EE5\u4E0B\u306E\u3088\u3046\u306A\u8A18\u8FF0\u304C\u3042\u308A\u307E\u3059\u3002",
        "\u300C\u300E\u7B2C\uFF5E\u300F\u3068\u300E\uFF5E\u76EE\u300F\u3068\u306F\u610F\u5473\u304C\u5FAE\u5999\u306B\u7570\u306A\u308B\u305F\u3081\u3001\u3044\u3063\u3057\u3087\u306B\u4F7F\u3063\u3066\u3082\u91CD\u8907\u8868\u73FE\u3068\u306F\u8A00\u3044\u306B\u304F\u3044\u3068\u8003\u3048\u307E\u3059\u3002\u300D",
        "\u300C\u300C\u4E09\u7701\u5802\u56FD\u8A9E\u8F9E\u5178 \u7B2C\u516D\u7248\u300D\u3067\u306F\u3001\u300E\u7B2C\uFF5E\u76EE\u300F\u3068\u3044\u3046\u8A00\u3044\u65B9\u3092\u5426\u5B9A\u3057\u3066\u306F\u3044\u307E\u305B\u3093\u3002\u300E\u521D\uFF08\u306F\u3064\uFF09\u300F\u306E\u9805\u76EE\u3067\u306F\u3001\u8A9E\u91C8\u306B\u3008\u6700\u521D\u306E\u3002\u7B2C\u4E00\u56DE\u3081\u306E\u3002\u3009\u3068\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002\u305D\u306E\u307B\u304B\u3001\u300E\u4E00\u4EE3\u96D1\u7A2E\u300F\u300E\u521D\u5237\u308A\u300F\u306A\u3069\u306E\u9805\u76EE\u306B\u3082\u300E\u7B2C\uFF5E\u76EE\u300F\u3068\u3044\u3046\u8868\u73FE\u304C\u3042\u308A\u307E\u3059\u3002\u300D",
        "\u4E00\u65B9\u3067\u3001\u8AAD\u58F2\u30C6\u30EC\u30D3\u300C\u3053\u3068\u3070\u306E\u8A713625\u300E\u306A\u305C\u7B2C\u4E00\u65E5\u76EE\u306F\u30C0\u30E1\u304B\uFF1F\u300F\u300D\u306B\u3088\u308B\u3068\u3001\u65E5\u672C\u65B0\u805E\u5354\u4F1A\u30FB\u65B0\u805E\u7528\u8A9E\u61C7\u8AC7\u4F1A\u653E\u9001\u5206\u79D1\u4F1A\u300E\u653E\u9001\u3067\u6C17\u306B\u306A\u308B\u8A00\u8449\u30FB\u6539\u8A02\u65B0\u7248\u300F\u306B\u4EE5\u4E0B\u306E\u3088\u3046\u306A\u8A18\u8FF0\u304C\u3042\u308B\u305D\u3046\u3067\u3059\u3002",
        "\u300C\u300E\u7B2C\u4E00\u65E5\u300F\u306E\u300E\u7B2C\u300F\u306F\u3001\u6570\u5B57\u304C\u9806\u5E8F\u6570\u8A5E\u3067\u3042\u308B\u3053\u3068\u3092\u793A\u3059\u63A5\u982D\u8A9E\u3001\u300E\u4E00\u65E5\u76EE\u300F\u306E\u300E\u76EE\u300F\u3082\u540C\u69D8\u306E\u610F\u5473\u3092\u8868\u3059\u63A5\u5C3E\u8A9E\u3060\u3002\u3057\u305F\u304C\u3063\u3066\u300E\u7B2C\u4E00\u65E5\u76EE\u300F\u306E\u3088\u3046\u306B\u300E\u7B2C\u300F\u3068\u300E\u76EE\u300F\u306E\u4E21\u65B9\u3092\u3064\u3051\u308B\u306E\u306F\u8868\u73FE\u3068\u3057\u3066\u306F\u91CD\u8907\u3059\u308B\u3002\u610F\u5473\u306F\u901A\u3058\u308B\u306E\u3067\u5B9F\u5BB3\u306F\u5C11\u306A\u3044\u306E\u3060\u304C\u3001\u3053\u3093\u306A\u3053\u3068\u3067\u7121\u77E5\u3068\u601D\u308F\u308C\u308B\u306E\u306F\u3064\u307E\u3089\u306A\u3044\u3002\u300E\u7B2C\xD7\u65E5\u300F\u300E\u7B2C\xD7\u56DE\u300F\u3042\u308B\u3044\u306F\u300E\xD7\u65E5\u76EE\u300F\u300E\xD7\u56DE\u76EE\u300F\u3068\u7C21\u6F54\u3067\u6B63\u78BA\u306A\u8868\u73FE\u3092\u5FC3\u304C\u3051\u3088\u3046\u300D"
      ]
    },
    {
      yes: "\u7B2C$num\u65E5",
      no: [
        "\u7B2C$num\u65E5\u76EE"
      ],
      memo: [
        "\u3053\u308C\u306F\u8A55\u4FA1\u304C\u5206\u304B\u308C\u308B\u8868\u73FE\u306E\u3088\u3046\u3067\u3059\u3002",
        "\u4E09\u7701\u5802\u56FD\u8A9E\u8F9E\u5178\u306E\u3059\u3059\u3081\u300C\u305D\u306E73 \u300E\u7B2C1\u30DA\u30FC\u30B8\u76EE\u300F\u3068\u8A00\u3063\u3066\u3082\u3088\u3055\u305D\u3046\u3002\u300D\u306B\u306F\u3001\u4EE5\u4E0B\u306E\u3088\u3046\u306A\u8A18\u8FF0\u304C\u3042\u308A\u307E\u3059\u3002",
        "\u300C\u300E\u7B2C\uFF5E\u300F\u3068\u300E\uFF5E\u76EE\u300F\u3068\u306F\u610F\u5473\u304C\u5FAE\u5999\u306B\u7570\u306A\u308B\u305F\u3081\u3001\u3044\u3063\u3057\u3087\u306B\u4F7F\u3063\u3066\u3082\u91CD\u8907\u8868\u73FE\u3068\u306F\u8A00\u3044\u306B\u304F\u3044\u3068\u8003\u3048\u307E\u3059\u3002\u300D",
        "\u300C\u300C\u4E09\u7701\u5802\u56FD\u8A9E\u8F9E\u5178 \u7B2C\u516D\u7248\u300D\u3067\u306F\u3001\u300E\u7B2C\uFF5E\u76EE\u300F\u3068\u3044\u3046\u8A00\u3044\u65B9\u3092\u5426\u5B9A\u3057\u3066\u306F\u3044\u307E\u305B\u3093\u3002\u300E\u521D\uFF08\u306F\u3064\uFF09\u300F\u306E\u9805\u76EE\u3067\u306F\u3001\u8A9E\u91C8\u306B\u3008\u6700\u521D\u306E\u3002\u7B2C\u4E00\u56DE\u3081\u306E\u3002\u3009\u3068\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002\u305D\u306E\u307B\u304B\u3001\u300E\u4E00\u4EE3\u96D1\u7A2E\u300F\u300E\u521D\u5237\u308A\u300F\u306A\u3069\u306E\u9805\u76EE\u306B\u3082\u300E\u7B2C\uFF5E\u76EE\u300F\u3068\u3044\u3046\u8868\u73FE\u304C\u3042\u308A\u307E\u3059\u3002\u300D",
        "\u4E00\u65B9\u3067\u3001\u8AAD\u58F2\u30C6\u30EC\u30D3\u300C\u3053\u3068\u3070\u306E\u8A713625\u300E\u306A\u305C\u7B2C\u4E00\u65E5\u76EE\u306F\u30C0\u30E1\u304B\uFF1F\u300F\u300D\u306B\u3088\u308B\u3068\u3001\u65E5\u672C\u65B0\u805E\u5354\u4F1A\u30FB\u65B0\u805E\u7528\u8A9E\u61C7\u8AC7\u4F1A\u653E\u9001\u5206\u79D1\u4F1A\u300E\u653E\u9001\u3067\u6C17\u306B\u306A\u308B\u8A00\u8449\u30FB\u6539\u8A02\u65B0\u7248\u300F\u306B\u4EE5\u4E0B\u306E\u3088\u3046\u306A\u8A18\u8FF0\u304C\u3042\u308B\u305D\u3046\u3067\u3059\u3002",
        "\u300C\u300E\u7B2C\u4E00\u65E5\u300F\u306E\u300E\u7B2C\u300F\u306F\u3001\u6570\u5B57\u304C\u9806\u5E8F\u6570\u8A5E\u3067\u3042\u308B\u3053\u3068\u3092\u793A\u3059\u63A5\u982D\u8A9E\u3001\u300E\u4E00\u65E5\u76EE\u300F\u306E\u300E\u76EE\u300F\u3082\u540C\u69D8\u306E\u610F\u5473\u3092\u8868\u3059\u63A5\u5C3E\u8A9E\u3060\u3002\u3057\u305F\u304C\u3063\u3066\u300E\u7B2C\u4E00\u65E5\u76EE\u300F\u306E\u3088\u3046\u306B\u300E\u7B2C\u300F\u3068\u300E\u76EE\u300F\u306E\u4E21\u65B9\u3092\u3064\u3051\u308B\u306E\u306F\u8868\u73FE\u3068\u3057\u3066\u306F\u91CD\u8907\u3059\u308B\u3002\u610F\u5473\u306F\u901A\u3058\u308B\u306E\u3067\u5B9F\u5BB3\u306F\u5C11\u306A\u3044\u306E\u3060\u304C\u3001\u3053\u3093\u306A\u3053\u3068\u3067\u7121\u77E5\u3068\u601D\u308F\u308C\u308B\u306E\u306F\u3064\u307E\u3089\u306A\u3044\u3002\u300E\u7B2C\xD7\u65E5\u300F\u300E\u7B2C\xD7\u56DE\u300F\u3042\u308B\u3044\u306F\u300E\xD7\u65E5\u76EE\u300F\u300E\xD7\u56DE\u76EE\u300F\u3068\u7C21\u6F54\u3067\u6B63\u78BA\u306A\u8868\u73FE\u3092\u5FC3\u304C\u3051\u3088\u3046\u300D"
      ]
    },
    {
      yes: "\u968E\u5C0E\u95A2\u6570",
      no: [
        "\u56DE\u5C0E\u95A2\u6570"
      ],
      memo: "\u660E\u78BA\u306B\u8AA4\u308A\u3068\u3055\u308C\u308B\u8868\u73FE\u3067\u306F\u306A\u3044\u304B\u3082\u77E5\u308C\u307E\u305B\u3093\u304C\u3001\u4E00\u822C\u7684\u306B\u306F\u300C\u4E8C\u968E\u5C0E\u95A2\u6570\u300D\u306A\u3069\u3068\u8868\u73FE\u3055\u308C\u308B\u3053\u3068\u304C\u591A\u304F\u3001Wikipedia\u306E\u898B\u51FA\u3057\u8A9E\u3082\u305D\u3046\u306A\u3063\u3066\u3044\u307E\u3059\u3002\u540C\u69D8\u306B\u3001\u300C2\u56DE\u5FAE\u5206\u3059\u308B\u300D\u3068\u52D5\u8A5E\u7684\u306B\u7528\u3044\u308B\u304B\u300C\u4E8C\u968E\u5FAE\u5206\u53EF\u80FD\u3067\u3042\u308B\u300D\u3068\u540D\u8A5E\u7684\u306B\u7528\u3044\u308B\u304B\u306A\u3069\u3067\u3001\u8868\u8A18\u304C\u7570\u306A\u308B\u3053\u3068\u3082\u3042\u308A\u307E\u3059\u3002"
    }
  ],
  entries_en: [
    {
      yes: "et al.",
      no: [
        "et. al."
      ],
      memo: 'The first period is incorrect. The correct form is "et al." which comes from the Latin phrase "et alii", "et aliae", or "et alia" meaning "and others."'
    },
    {
      yes: "YouTube",
      no: [
        "Youtube",
        "youTube"
      ],
      memo: `The correct capitalization is "YouTube" with a capital 'Y' and 'T'.`
    },
    {
      yes: "GitHub",
      no: [
        "Github",
        "gitHub"
      ],
      memo: `The correct capitalization is "GitHub" with a capital 'G' and 'H'.`
    },
    {
      yes: "VS Code",
      no: [
        "VSCode",
        "VScode",
        "VsCode",
        "Vscode",
        "VS code",
        "Vs Code",
        "Vs code"
      ],
      memo: `The correct capitalization is "VS Code" with a capital 'V', 'S', and 'C'. There is an space between VS and Code.`
    },
    {
      yes: "LaTeX",
      no: [
        "LaTex",
        "LateX",
        "Latex"
      ],
      memo: `The correct capitalization is "LaTeX" with a capital 'L', 'T', and 'X'.`
    }
  ]
};

// src/TextLint/vocabulary_loader.ts
var cachedVocabularyData = null;
function preprocessMemo(memo) {
  if (!memo) return "";
  const memoList = Array.isArray(memo) ? memo : [memo];
  if (memoList.length === 0) return "";
  const processedMemo = [...memoList];
  if (processedMemo[0] === "[\u91CD\u8A00]")
    processedMemo[0] = "\u3053\u306E\u8868\u73FE\u306F\u91CD\u8A00\u306E\u53EF\u80FD\u6027\u304C\u3042\u308A\u3001\u4FEE\u8F9E\u6280\u6CD5\u3068\u3057\u3066\u610F\u56F3\u3055\u308C\u3066\u3044\u308C\u3070\u554F\u984C\u3042\u308A\u307E\u305B\u3093\u304C\u3001\u8AA4\u7528\u306E\u53EF\u80FD\u6027\u3082\u3042\u308B\u306E\u3067\u6CE8\u610F\u304C\u5FC5\u8981\u3067\u3059\u3002";
  return processedMemo.join("\n");
}
function getVocabularyData() {
  if (cachedVocabularyData) return cachedVocabularyData;
  const convertEntries = (entries) => entries.map((entry) => ({
    yes: entry.yes,
    no: entry.no,
    memo: preprocessMemo(entry.memo)
  }));
  cachedVocabularyData = {
    entries_ja: convertEntries(my_vocabulary_default.entries_ja ?? []),
    entries_en: convertEntries(my_vocabulary_default.entries_en ?? [])
  };
  return cachedVocabularyData;
}

// src/TextLint/usage_error.ts
var NUMBER_PLACEHOLDER = "__LLTEXTLINT_NUM_PLACEHOLDER__";
function escapeRegexLiteral(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function isRegexStylePattern(pattern2) {
  return /\\|\(\?|\[[^\]]*\]|\|/.test(pattern2);
}
function toPatternSource(noPattern) {
  const withPlaceholder = noPattern.replace(/\$num/g, NUMBER_PLACEHOLDER);
  const source = isRegexStylePattern(withPlaceholder) ? withPlaceholder : escapeRegexLiteral(withPlaceholder);
  return source.replace(
    new RegExp(NUMBER_PLACEHOLDER, "g"),
    "(\\d+|[\u3007\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\u5343\u4E07\u5104\u5146]+)"
  );
}
function compileUsageRegex(noPattern, disallowWordContinuation) {
  const patternSource = toPatternSource(noPattern);
  const pattern2 = disallowWordContinuation ? `(?<![A-Za-z0-9_-])(?:${patternSource})(?![A-Za-z0-9_-])` : patternSource;
  return new RegExp(pattern2, "g");
}
function formatEnglishUsageError(wrong, correct, memo) {
  return `The phrase "${wrong}" may be better written as "${correct}". ${memo}`;
}
function formatJapaneseUsageError(wrong, correct, memo) {
  return `\u300C${wrong}\u300D\u3068\u3044\u3046\u7B87\u6240\u306F\u300C${correct}\u300D\u306E\u65B9\u304C\u6B63\u3057\u3044\u304B\u3082\u77E5\u308C\u307E\u305B\u3093\u3002${memo}`;
}
function compileUsageRules() {
  const dict = getVocabularyData();
  const entriesEn = [];
  const entriesJa = [];
  for (const entry of dict.entries_en) {
    const noPatterns = Array.isArray(entry.no) ? entry.no : [entry.no];
    for (const noPattern of noPatterns)
      entriesEn.push({
        regex: compileUsageRegex(noPattern, true),
        yesPattern: entry.yes,
        memo: entry.memo,
        messageFormatter: formatEnglishUsageError
      });
  }
  for (const entry of dict.entries_ja) {
    const noPatterns = Array.isArray(entry.no) ? entry.no : [entry.no];
    for (const noPattern of noPatterns)
      entriesJa.push({
        regex: compileUsageRegex(noPattern, false),
        yesPattern: entry.yes,
        memo: entry.memo,
        messageFormatter: formatJapaneseUsageError
      });
  }
  return { entriesEn, entriesJa };
}
var COMPILED_USAGE_RULES = compileUsageRules();
function regexCheck(text, rule, errors, matchedRanges) {
  const { regex, yesPattern, memo, messageFormatter } = rule;
  regex.lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const index = match.index;
    const endIndex = index + match[0].length;
    if (!matchedRanges.some(([rStart, rEnd]) => index < rEnd && endIndex > rStart)) {
      errors.push({
        startOffset: index,
        endOffset: endIndex,
        message: messageFormatter(
          match[0],
          yesPattern.replace("$num", match[1] ?? ""),
          memo
        ),
        code: "usage-error"
      });
      matchedRanges.push([index, endIndex]);
    }
    if (match[0].length === 0)
      regex.lastIndex++;
  }
}
function finalizeErrors(errors) {
  errors.sort((a, b) => a.startOffset - b.startOffset);
  return errors;
}
function checkUsageError(text) {
  const errors = [];
  const matchedRanges = [];
  const hasJapaneseHiragana = /[ぁ-ん]/.test(text);
  for (const rule of COMPILED_USAGE_RULES.entriesEn)
    regexCheck(text, rule, errors, matchedRanges);
  if (!hasJapaneseHiragana)
    return finalizeErrors(errors);
  for (const rule of COMPILED_USAGE_RULES.entriesJa)
    regexCheck(text, rule, errors, matchedRanges);
  return finalizeErrors(errors);
}

// src/LL/LLTextLint.ts
function LLTextLint(doc, txt) {
  if (!txt.text.trim()) return [];
  const messages2 = [];
  const ranges = [];
  for (const error of checkUsageError(txt.text)) {
    if (!txt.isValid(error.startOffset)) continue;
    messages2.push(error.message);
    ranges.push(new Range(doc.positionAt(error.startOffset), doc.positionAt(error.endOffset)));
  }
  return ranges2diagnostics(
    "LLTextLint",
    messages2,
    ranges
  );
}

// src/LL/LLThousands.ts
init_define_LATEXLINT_DEFAULTS();
function LLThousands(doc, txt) {
  if (doc.languageId !== "latex") return [];
  if (txt.text.includes("\n\\usepackage{icomma}")) return [];
  const code = "LLThousands";
  let message = [];
  let ranges = [];
  for (const match of txt.text.matchAll(/(\d{1,3}),(\d{3})(?=\$|\\\))/g)) {
    if (!txt.isValid(match.index)) continue;
    message.push(messages[code].replaceAll("%1", match[1]).replaceAll("%2", match[2]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLTitle.ts
init_define_LATEXLINT_DEFAULTS();

// src/util/toTitleCase.ts
init_define_LATEXLINT_DEFAULTS();
function toTitleCase(input) {
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
  const alphanumericPattern = /([A-Za-z0-9\\])/;
  const wordSeparators = /([ :-])/;
  return input.split(wordSeparators).map((current, index, array) => {
    if (
      /* Check for small words */
      current.search(smallWords) > -1 && /* Skip first and last word */
      index !== 0 && index !== array.length - 1 && /* Ignore small words that start a hyphenated phrase */
      (array[index + 1] !== "-" || array[index - 1] === "-" && array[index + 1] === "-")
    )
      return current.toLowerCase();
    if (current.substring(1).search(/[A-Z]|\../) > -1) return current;
    return current.replace(alphanumericPattern, (match) => match.toUpperCase());
  }).join("");
}

// src/LL/LLTitle.ts
var REGEXPS2 = [
  /\\title{/g,
  /\\section\*?{/g,
  /\\subsection\*?{/g,
  /\\subsubsection\*?{/g,
  /\\paragraph\*?{/g,
  /\\subparagraph\*?{/g
];
function LLTitle(doc, txt) {
  if (doc.languageId !== "latex") return [];
  const code = "LLTitle";
  const diagnostics = [];
  for (const regexp of REGEXPS2)
    for (const match of txt.text.matchAll(regexp)) {
      let index = match.index + match[0].length;
      const beginIndex = index;
      let braceCount = 1;
      while (braceCount > 0 && index < txt.text.length) {
        if (txt.text[index] === "{") braceCount++;
        else if (txt.text[index] === "}") braceCount--;
        index++;
      }
      const endIndex = index - 1;
      const sectionText = txt.text.slice(beginIndex, endIndex);
      if (sectionText === sectionText.toUpperCase()) continue;
      if (sectionText.includes("\\") || sectionText.includes("$")) continue;
      const titleCaseText = toTitleCase(sectionText);
      if (sectionText === titleCaseText) continue;
      const L = doc.positionAt(beginIndex);
      const R = doc.positionAt(endIndex);
      const range = new Range(L, R);
      diagnostics.push({
        code: getCodeWithURI(code),
        message: messages[code].replaceAll("%1", titleCaseText),
        range,
        severity: severity[code],
        source: extensionDisplayName
      });
    }
  return diagnostics;
}

// src/LL/LLUnRef.ts
init_define_LATEXLINT_DEFAULTS();
function LLUnRef(doc, txt) {
  if (doc.languageId !== "latex") return [];
  if (txt.idxOfBeginDocument === -1 && isTableOnlyFragment(txt)) return [];
  const code = "LLUnRef";
  const message = [];
  const ranges = [];
  const collectRefs = () => {
    const foundRefs = /* @__PURE__ */ new Set();
    const refRegex = /\\[a-zA-Z]*(?:ref|Ref|REF)[a-zA-Z]*\{/g;
    for (const refMatch of findLatexCommandMatches(txt.text, refRegex)) {
      if (!txt.isValid(refMatch.index)) continue;
      const refNames = refMatch.content.split(",").map((name) => name.trim());
      for (const refName of refNames) foundRefs.add(refName);
    }
    return foundRefs;
  };
  const findNextValidMatch = (regex, start) => {
    regex.lastIndex = start;
    let match;
    while ((match = regex.exec(txt.text)) !== null) {
      if (!txt.isValid(match.index)) continue;
      return match;
    }
    return null;
  };
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const processEnvironmentLabels = (envName) => {
    const escapedEnvName = escapeRegExp(envName);
    const beginRegex = new RegExp(`\\\\begin\\{${escapedEnvName}\\}`, "g");
    const endRegex = new RegExp(`\\\\end\\{${escapedEnvName}\\}`, "g");
    const envHeaderLength = `\\begin{${envName}}`.length;
    let beginMatch;
    while ((beginMatch = beginRegex.exec(txt.text)) !== null) {
      if (!txt.isValid(beginMatch.index)) continue;
      const endMatch = findNextValidMatch(endRegex, beginMatch.index);
      if (!endMatch) continue;
      const envContent = txt.text.substring(beginMatch.index + envHeaderLength, endMatch.index);
      const labelRegex = /\\label\{/g;
      for (const labelMatch of findLatexCommandMatches(envContent, labelRegex)) {
        const labelName = labelMatch.content;
        const absoluteIndex = beginMatch.index + envHeaderLength + labelMatch.index;
        if (!txt.isValid(absoluteIndex)) continue;
        if (allRefs.has(labelName)) continue;
        message.push(messages[code].replaceAll("%1", labelName).replaceAll("%2", envName));
        ranges.push(new Range(
          doc.positionAt(absoluteIndex),
          doc.positionAt(beginMatch.index + envHeaderLength + labelMatch.fullEnd)
        ));
      }
    }
  };
  const allRefs = collectRefs();
  ["figure", "table", "figure*", "table*"].forEach(processEnvironmentLabels);
  return ranges2diagnostics(code, message, ranges);
}
function isTableOnlyFragment(txt) {
  const tableRanges = collectEnvironmentRanges(txt, ["table", "table*"]);
  if (tableRanges.length === 0) return false;
  let tableRangeIndex = 0;
  for (const [validStart, validEnd] of txt.validRanges) {
    let cursor = validStart;
    while (tableRangeIndex < tableRanges.length && tableRanges[tableRangeIndex][1] <= cursor)
      tableRangeIndex++;
    let scanIndex = tableRangeIndex;
    while (scanIndex < tableRanges.length && tableRanges[scanIndex][0] < validEnd) {
      const [tableStart, tableEnd] = tableRanges[scanIndex];
      if (cursor < tableStart && /\S/.test(txt.text.slice(cursor, tableStart))) return false;
      cursor = Math.max(cursor, tableEnd);
      scanIndex++;
    }
    if (cursor < validEnd && /\S/.test(txt.text.slice(cursor, validEnd))) return false;
  }
  return true;
}
function collectEnvironmentRanges(txt, envNames) {
  const ranges = [];
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const envName of envNames) {
    const escapedEnvName = escapeRegExp(envName);
    const beginRegex = new RegExp(`\\\\begin\\{${escapedEnvName}\\}`, "g");
    const endRegex = new RegExp(`\\\\end\\{${escapedEnvName}\\}`, "g");
    let beginMatch;
    while ((beginMatch = beginRegex.exec(txt.text)) !== null) {
      if (!txt.isValid(beginMatch.index)) continue;
      const endMatch = findNextValidMatchInText(txt, endRegex, beginMatch.index);
      if (!endMatch) continue;
      ranges.push([beginMatch.index, endMatch.index + endMatch[0].length]);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  return ranges;
}
function findNextValidMatchInText(txt, regex, start) {
  regex.lastIndex = start;
  let match;
  while ((match = regex.exec(txt.text)) !== null) {
    if (!txt.isValid(match.index)) continue;
    return match;
  }
  return null;
}

// src/LL/LLURL.ts
init_define_LATEXLINT_DEFAULTS();
function LLURL(doc, txt) {
  const code = "LLURL";
  let message = [];
  let ranges = [];
  for (const match of txt.text.matchAll(
    /\?(utm_[^&=\s]*|sessionid)=/gi
  )) {
    if (!txt.isValid(match.index)) continue;
    message.push(messages[code].replaceAll("%1", match[1]));
    ranges.push(match2range(doc, match));
  }
  return ranges2diagnostics(code, message, ranges);
}

// src/LL/LLUserDefined.ts
init_define_LATEXLINT_DEFAULTS();
function LLUserDefined(doc, txt, userDefinedRules) {
  if (!userDefinedRules || userDefinedRules.length === 0) return [];
  const diagnostics = [];
  for (let rule of userDefinedRules) {
    let regex;
    try {
      regex = new RegExp(rule, "g");
    } catch (e) {
      window.showErrorMessage(`'${rule}' in userDefinedRules is invalid. Please check the regex in the settings.json.`);
      continue;
    }
    const code = "LLUserDefined";
    let message = [];
    let ranges = [];
    for (const match of txt.text.matchAll(regex)) {
      message.push(messages[code].replaceAll("%1", regex.source));
      ranges.push(match2range(doc, match));
    }
    diagnostics.push(...ranges2diagnostics(code, message, ranges));
  }
  return diagnostics;
}

// src/util/rules.ts
var standardRules = {
  LLAlignAnd,
  LLAlignEnd,
  LLAlignSingleLine,
  LLArticle,
  LLBig,
  LLBracketCurly,
  LLBracketMissing,
  LLBracketRound,
  LLColonEqq,
  LLColonForMapping,
  LLDots,
  LLDoubleQuotes,
  LLENDash,
  LLEqnarray,
  LLErrCompOps,
  LLFootnote,
  LLHeading,
  LLLlGg,
  LLMathPunctuation,
  LLNonASCII,
  LLNonstandard,
  LLOperator,
  LLPeriod,
  LLRefEq,
  LLSharp,
  LLSI,
  LLSortedCites,
  LLSpaceEnglish,
  LLSpaceJapanese,
  LLT,
  LLTextLint,
  LLThousands,
  LLTitle,
  LLUnRef,
  LLURL
};
var configuredRules = {
  LLCref: {
    rule: LLCref,
    configKey: "LLCrefExceptions"
  },
  LLUserDefined: {
    rule: LLUserDefined,
    configKey: "userDefinedRules"
  }
};

// src/util/filterDisabledLineDiagnostics.ts
init_define_LATEXLINT_DEFAULTS();
function filterDisabledLineDiagnostics(sortedDiagnostics, sortedDisabledLines) {
  if (sortedDiagnostics.length === 0 || sortedDisabledLines.length === 0)
    return sortedDiagnostics;
  const filteredDiagnostics = [];
  let i = 0;
  for (const diag of sortedDiagnostics) {
    const line = diag.range.start.line;
    while (i < sortedDisabledLines.length && sortedDisabledLines[i] < line)
      i += 1;
    if (i < sortedDisabledLines.length && sortedDisabledLines[i] === line)
      continue;
    filteredDiagnostics.push(diag);
  }
  return filteredDiagnostics;
}

// src/util/formatException.ts
init_define_LATEXLINT_DEFAULTS();
function formatException(exception) {
  exception = exception.replace(/\s+/g, " ");
  exception = exception.trim();
  return exception;
}

// src/util/lintWithPerformanceTracking.ts
function lintWithPerformanceTracking(options) {
  const { doc, disabledRules, getConfigValue, onRuleError } = options;
  const timings = [];
  const createLLTextStart = performance.now();
  const [txt, diagnostics] = createLLTextVSCode(doc);
  const createLLTextEnd = performance.now();
  timings.push({
    name: "createLLText",
    time: createLLTextEnd - createLLTextStart
  });
  for (const [ruleName2, rule] of Object.entries(standardRules)) {
    if (disabledRules.includes(ruleName2)) continue;
    const ruleStart = performance.now();
    try {
      const diags = rule(doc, txt);
      diagnostics.push(...diags);
    } catch (error) {
      if (onRuleError) onRuleError(ruleName2, error);
      else throw error;
    }
    const ruleEnd = performance.now();
    timings.push({ name: ruleName2, time: ruleEnd - ruleStart });
  }
  for (const [ruleName2, { rule, configKey }] of Object.entries(
    configuredRules
  )) {
    if (disabledRules.includes(ruleName2)) continue;
    const ruleStart = performance.now();
    try {
      const diags = rule(doc, txt, getConfigValue(configKey));
      diagnostics.push(...diags);
    } catch (error) {
      if (onRuleError) onRuleError(ruleName2, error);
      else throw error;
    }
    const ruleEnd = performance.now();
    timings.push({ name: ruleName2, time: ruleEnd - ruleStart });
  }
  diagnostics.sort(compareDiagnosticsByPosition);
  return { diagnostics, disabledLines: txt.disabledLines, timings };
}
function lintDocument(options) {
  const result = lintWithPerformanceTracking(options);
  const diagnostics = filterDisabledLineDiagnostics(result.diagnostics, result.disabledLines).filter((diag) => !options.exceptions.includes(formatException(options.doc.getText(diag.range))));
  return { ...result, diagnostics };
}
function compareDiagnosticsByPosition(a, b) {
  if (a.range.start.line !== b.range.start.line) return a.range.start.line - b.range.start.line;
  if (a.range.start.character !== b.range.start.character) return a.range.start.character - b.range.start.character;
  if (a.range.end.line !== b.range.end.line) return a.range.end.line - b.range.end.line;
  return a.range.end.character - b.range.end.character;
}

// src/util/fixJapaneseSpace.ts
init_define_LATEXLINT_DEFAULTS();
function fixJapaneseSpace(document, ranges) {
  const insertOffsets = /* @__PURE__ */ new Set();
  for (const range of ranges) {
    const matchText = document.getText(range);
    if (matchText.includes("$") || matchText.endsWith("\\("))
      insertOffsets.add(document.offsetAt(range.start) + 1);
    else if (matchText.startsWith("\\)"))
      insertOffsets.add(document.offsetAt(range.start) + 2);
    else throw new Error("Unexpected Japanese spacing match: " + matchText);
  }
  const originalText = document.getText();
  const chunks = [];
  let cursor = 0;
  let count = 0;
  for (const offset of [...insertOffsets].sort((a, b) => a - b)) {
    chunks.push(originalText.slice(cursor, offset));
    if (originalText[offset] !== " ") {
      chunks.push(" ");
      count++;
    }
    cursor = offset;
  }
  chunks.push(originalText.slice(cursor));
  return { text: chunks.join(""), count };
}

// src/cli/engine.ts
function ruleName(diagnostic) {
  const code = diagnostic.code;
  return String(typeof code === "object" ? code.value : code ?? "LLParse");
}
function diagnose(text, languageId, config) {
  return lintDocument({
    doc: createDocument(text, languageId),
    disabledRules: config.disabledRules,
    exceptions: config.exceptions,
    getConfigValue: (key) => config[key]
  }).diagnostics;
}
function fix(text, languageId, diagnostics) {
  return fixJapaneseSpace(createDocument(text, languageId), diagnostics.filter((diagnostic) => ruleName(diagnostic) === "LLSpaceJapanese").map((diagnostic) => diagnostic.range)).text;
}

// src/cli/main.ts
var help = `Usage: latexlint [options] [files|directories|globs...]

Options:
  -c, --config <file>       JSON configuration (default: .latexlint.json in cwd)
  -f, --fix                 Fix active LLSpaceJapanese diagnostics in place
  --enable <rules...>       Enable rules; end the list with -- before files
  --disable <rules...>      Disable rules (takes precedence over --enable)
  -i, --ignore <pattern>    Exclude a file/directory/glob (repeatable)
  -p, --ignore-path <file>  Gitignore-style exclusions (default: .latexlintignore)
  -d, --dot                 Include dotfiles/directories during discovery
  -q, --quiet               Suppress diagnostic output, preserving exit status
  -V, --version             Print version
  -h, --help                Print help

Exit codes: 0 no remaining diagnostics; 1 diagnostics remain; 4 execution error.
Input: UTF-8 .tex and .md files. --fix preserves BOM and line endings.
Only explicitly enabled Japanese spacing is fixed; --fix does not enable rules.
`;
function parseArguments(args) {
  const parsed = (0, import_node_util.parseArgs)({
    args,
    allowPositionals: true,
    tokens: true,
    options: {
      config: { type: "string", short: "c" },
      fix: { type: "boolean", short: "f" },
      enable: { type: "string", multiple: true },
      disable: { type: "string", multiple: true },
      ignore: { type: "string", short: "i", multiple: true },
      "ignore-path": { type: "string", short: "p" },
      dot: { type: "boolean", short: "d" },
      quiet: { type: "boolean", short: "q" },
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "V" }
    }
  });
  const files = [];
  const enable = [];
  const disable = [];
  let rules;
  for (const token of parsed.tokens)
    if (token.kind === "option-terminator") rules = void 0;
    else if (token.kind === "option") {
      rules = token.name === "enable" ? enable : token.name === "disable" ? disable : void 0;
      if (rules) rules.push(token.value);
    } else if (rules) rules.push(token.value);
    else files.push(token.value);
  return { ...parsed.values, files, enable, disable };
}
function main(args) {
  try {
    const options = parseArguments(args);
    if (options.version) {
      console.log(version);
      return 0;
    }
    if (options.help || args.length === 0) {
      console.log(help);
      return 0;
    }
    if (options.files.length === 0) throw new Error("No input files specified. Use --help for usage.");
    const cwd = process.cwd();
    const config = readConfiguration(cwd, options.config, options.enable, options.disable);
    const files = collectFiles(options.files, { ...options, cwd });
    if (options.fix && config.disabledRules.includes("LLSpaceJapanese") && !options.quiet)
      console.error("LLSpaceJapanese is disabled; use --enable LLSpaceJapanese -- to enable spacing fixes.");
    let status = 0;
    for (const filename of files) {
      const display = (0, import_node_path3.relative)(cwd, filename) || filename;
      try {
        const extension = (0, import_node_path3.extname)(filename).toLowerCase();
        if (extension !== ".tex" && extension !== ".md")
          throw new Error("Expected a .tex or .md file");
        const bytes = (0, import_node_fs3.readFileSync)(filename);
        const bom = bytes.subarray(0, 3).equals(Buffer.from([239, 187, 191]));
        let text = new import_node_util.TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bom ? bytes.subarray(3) : bytes);
        const language = extension === ".md" ? "markdown" : "latex";
        let diagnostics = diagnose(text, language, config);
        if (options.fix) {
          const updated = fix(text, language, diagnostics);
          if (updated !== text) {
            diagnostics = diagnose(updated, language, config);
            (0, import_node_fs3.writeFileSync)(filename, (bom ? "\uFEFF" : "") + updated, "utf8");
            text = updated;
          }
        }
        if (diagnostics.length && status !== 4) status = 1;
        if (!options.quiet)
          for (const diagnostic of diagnostics) {
            const { line, character } = diagnostic.range.start;
            console.error(`${display}:${line + 1}:${character + 1} ${ruleName(diagnostic)} ${diagnostic.message.replace(/[\r\n]+/g, " ")}`);
          }
      } catch (error) {
        console.error(`${display}: ${error instanceof Error ? error.message : String(error)}`);
        status = 4;
      }
    }
    return status;
  } catch (error) {
    console.error(`latexlint: ${error instanceof Error ? error.message : String(error)}`);
    return 4;
  }
}
if (require.main === module) process.exitCode = main(process.argv.slice(2));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});

const { series } = require("gulp");

function foo(cb) {
  setTimeout(() => {
    console.log("foo");
    cb();
  }, 100);
}

function bar(cb) {
  setTimeout(() => {
    console.log("bar");
    cb();
  }, 100);
}

module.exports = { run: series(foo, bar) };

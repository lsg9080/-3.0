(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
      (global.__ce = factory())
})(this, (function () {
  return {
    _: {},
    debug: true,
    baseURL: 'http://xxxxx.com' // 接口地址
  }
}));

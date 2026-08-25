"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@radix-ui+react-use-previou_e9b847be3e14bd4a50395d2a7763d0b4";
exports.ids = ["vendor-chunks/@radix-ui+react-use-previou_e9b847be3e14bd4a50395d2a7763d0b4"];
exports.modules = {

/***/ "(ssr)/../node_modules/.pnpm/@radix-ui+react-use-previou_e9b847be3e14bd4a50395d2a7763d0b4/node_modules/@radix-ui/react-use-previous/dist/index.mjs":
/*!***************************************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@radix-ui+react-use-previou_e9b847be3e14bd4a50395d2a7763d0b4/node_modules/@radix-ui/react-use-previous/dist/index.mjs ***!
  \***************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   usePrevious: () => (/* binding */ usePrevious)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/../node_modules/.pnpm/next@15.5.14_@babel+core@7._a5f5006bc280d60ae3b6ce5516666801/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\");\n// packages/react/use-previous/src/use-previous.tsx\n\nfunction usePrevious(value) {\n  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef({ value, previous: value });\n  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {\n    if (ref.current.value !== value) {\n      ref.current.previous = ref.current.value;\n      ref.current.value = value;\n    }\n    return ref.current.previous;\n  }, [value]);\n}\n\n//# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0ByYWRpeC11aStyZWFjdC11c2UtcHJldmlvdV9lOWI4NDdiZTNlMTRiZDRhNTAzOTVkMmE3NzYzZDBiNC9ub2RlX21vZHVsZXMvQHJhZGl4LXVpL3JlYWN0LXVzZS1wcmV2aW91cy9kaXN0L2luZGV4Lm1qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQytCO0FBQy9CO0FBQ0EsY0FBYyx5Q0FBWSxHQUFHLHdCQUF3QjtBQUNyRCxTQUFTLDBDQUFhO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFHRTtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEIgVkVOS0FUIENIT1dEQVJZXFxEb3dubG9hZHNcXGFyanVubWFpbjEyICgzKVxcbm9kZV9tb2R1bGVzXFwucG5wbVxcQHJhZGl4LXVpK3JlYWN0LXVzZS1wcmV2aW91X2U5Yjg0N2JlM2UxNGJkNGE1MDM5NWQyYTc3NjNkMGI0XFxub2RlX21vZHVsZXNcXEByYWRpeC11aVxccmVhY3QtdXNlLXByZXZpb3VzXFxkaXN0XFxpbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFja2FnZXMvcmVhY3QvdXNlLXByZXZpb3VzL3NyYy91c2UtcHJldmlvdXMudHN4XG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcbmZ1bmN0aW9uIHVzZVByZXZpb3VzKHZhbHVlKSB7XG4gIGNvbnN0IHJlZiA9IFJlYWN0LnVzZVJlZih7IHZhbHVlLCBwcmV2aW91czogdmFsdWUgfSk7XG4gIHJldHVybiBSZWFjdC51c2VNZW1vKCgpID0+IHtcbiAgICBpZiAocmVmLmN1cnJlbnQudmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICByZWYuY3VycmVudC5wcmV2aW91cyA9IHJlZi5jdXJyZW50LnZhbHVlO1xuICAgICAgcmVmLmN1cnJlbnQudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHJlZi5jdXJyZW50LnByZXZpb3VzO1xuICB9LCBbdmFsdWVdKTtcbn1cbmV4cG9ydCB7XG4gIHVzZVByZXZpb3VzXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXgubWpzLm1hcFxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/.pnpm/@radix-ui+react-use-previou_e9b847be3e14bd4a50395d2a7763d0b4/node_modules/@radix-ui/react-use-previous/dist/index.mjs\n");

/***/ })

};
;
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hasFired = void 0,
    baseUrl = '';

/**
 * @class
 */

var Crawler = function () {
    function Crawler() {
        _classCallCheck(this, Crawler);

        // get the target url
        Crawler.getBaseUrl();

        hasFired = false;

        // try prevent window.close() because it will terminate everything
        // Then again if you do this on your website, you should get dinged
        Crawler.appendCodeFragment('window.onbeforeunload = null');

        // get robots meta
        var robots = Crawler.getRobotsMeta();

        // remove this url from sitemap if noindex is set
        if (robots.indexOf('noindex') >= 0) {
            window.chrome.runtime.sendMessage({ noindex: window.location.href });
        }

        // don't follow links on this page if no follow is set
        if (robots.indexOf('nofollow') >= 0) {
            return window.chrome.runtime.sendMessage({ urls: [] });
        }

        // wait for onload
        window.onload = Crawler.findLinks;

        // but ensure the function will ultimately run
        setTimeout(Crawler.findLinks, 500);
    }

    /**
     * @ignore
     */


    _createClass(Crawler, null, [{
        key: 'appendCodeFragment',


        /**
         * @ignore
         * @description Append some js code fragment in current document DOM
         * @param {String} jsCodeFragment - the code you want to execute in the document context
         */
        value: function appendCodeFragment(jsCodeFragment) {
            (function _appendToDom(domElem, elem, type, content) {
                var e = document.createElement(elem);

                e.type = type;
                e.textContent = content;
                document.getElementsByTagName(domElem)[0].append(e);
            })('body', 'script', 'text/javascript', jsCodeFragment);
        }

        /**
         * @description Look for 'robots' meta tag in the page header and if found return its contents
         */

    }, {
        key: 'getRobotsMeta',
        value: function getRobotsMeta() {
            var metas = document.getElementsByTagName('meta');

            for (var i = 0; i < metas.length; i++) {
                if ((metas[i].getAttribute('name') || '').toLowerCase() === 'robots') {
                    return (metas[i].getAttribute('content') || '').toLowerCase();
                }
            }
            return '';
        }

        /**
         * @description request the app path that is being crawled
         * so we can narrow down the matches when checking links on current page
         */

    }, {
        key: 'getBaseUrl',
        value: function getBaseUrl() {
            window.chrome.runtime.sendMessage({ crawlUrl: true }, Crawler.baseUrl);
        }

        /**
         * @description Looks for links on the page, then send a message with findings to background page
         */

    }, {
        key: 'findLinks',
        value: function findLinks() {
            if (!hasFired) {
                hasFired = true;

                var result = {},
                    message = [];

                [].forEach.call(document.querySelectorAll('a[href]'), function (link) {
                    result[Crawler.getAbsoluteHref(link)] = 1;
                });
                Object.keys(result).map(function (u) {
                    if (u.indexOf(baseUrl) === 0) {
                        message.push(u);
                    }
                });

                window.chrome.runtime.sendMessage({ urls: message });
            }
        }

        /*
         * @ignore
         * @description given an anchro tag, return its href in abs format
         * @param anchorTag
         */

    }, {
        key: 'getAbsoluteHref',
        value: function getAbsoluteHref(anchorTag) {
            var href = anchorTag.getAttribute('href');

            if (href.indexOf('http') < 0) {
                var link = document.createElement('a');

                link.href = href;
                href = link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
            }
            return encodeURI(href);
        }
    }, {
        key: 'baseUrl',
        set: function set(value) {
            baseUrl = encodeURI(value);
        }
    }]);

    return Crawler;
}();

(function () {
    return new Crawler();
})();

exports.default = Crawler;
module.exports = exports['default'];

/***/ })
/******/ ]);
//# sourceMappingURL=8fccc5175a7cd9885d12.js.map
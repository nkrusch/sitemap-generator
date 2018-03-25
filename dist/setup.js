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

/**
 * @class
 * @description This module is used to configure runtime params for sitemap generation
 */
var Setup = function () {
    function Setup() {
        _classCallCheck(this, Setup);

        var siteUrl = Setup.getParameterByName('u', window.location.href),
            siteUrlInput = document.getElementsByName('url')[0],
            startButton = document.getElementById('start');

        // the initial url will be active tab url if available
        siteUrl = Setup.removePageFromUrl(siteUrl);
        siteUrlInput.value = siteUrl;
        startButton.onclick = Setup.onStartButtonClick;
    }

    /**
     * @ignore
     * @description Get property from window url
     */


    _createClass(Setup, null, [{
        key: 'getParameterByName',
        value: function getParameterByName(name, url) {
            name = name.replace(/[\[\]]/g, '\\$&');
            var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);

            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        /**
         * @ignore
         * @description Handle start button click -> this will check user inputs
         * and if successful, send message to background page to initiate crawling.
         * @param {Object} e - click event
         */

    }, {
        key: 'onStartButtonClick',
        value: function onStartButtonClick(e) {

            var urlValidation = Setup.validateUrl();

            if (urlValidation.error) {
                return;
            }

            var url = urlValidation.url,
                requestDomain = (url + '/*').replace('//*', '/*'),
                config = {
                url: url,
                requestDomain: requestDomain,
                contenttypePatterns: ['text/html', 'text/plain'],
                excludeExtension: ['.png', '.json', '.jpg', '.jpeg', '.js', '.css', '.zip', '.mp3', '.mp4', '.ogg', '.avi', '.wav', '.webm', '.gif', '.ico'],
                successCodes: [200, 201, 202, 203, 304],
                maxTabCount: 25
            };

            window.chrome.runtime.sendMessage({ start: config });
            e.target.innerText = 'Starting....';
            document.getElementById('start').onclick = false;
        }

        /**
         * @ignore
         * @description if url ends with page e.g. "index.html" we want to remove
         * this and just keep the application path
         * @param {String} appPath - url
         */

    }, {
        key: 'removePageFromUrl',
        value: function removePageFromUrl(appPath) {
            if (appPath && appPath.lastIndexOf('/') > 8) {
                var parts = appPath.split('/'),
                    last = parts[parts.length - 1];

                if (!last.length || last.indexOf('.') > 0 || last.indexOf('#') >= 0 || last.indexOf('?') >= 0) {
                    parts.pop();
                }
                appPath = parts.join('/');
            }
            return appPath;
        }

        /**
         * @ignore
         * @description Make sure url input is correct
         * @returns {Object} - validation response
         */

    }, {
        key: 'validateUrl',
        value: function validateUrl() {
            var siteUrlInput = document.getElementsByName('url')[0],
                siteUrlInputError = document.getElementById('url-error'),
                url = Setup.removePageFromUrl(siteUrlInput.value || '').trim(),
                message = '';

            if (url.length < 1) {
                message = 'Url value is required';
            } else if (url.split('/').shift().indexOf('http') !== 0) {
                message = 'Url must start with http:// or https://';
            }
            var error = message.length,
                className = 'is-invalid',
                result = { url: url, error: error };

            siteUrlInputError.innerText = message;
            if (error) {
                siteUrlInput.className += ' ' + className;
            } else {
                siteUrlInput.classList.remove(className);
            }
            return result;
        }
    }]);

    return Setup;
}();

(function () {
    return new Setup();
})();

exports.default = Setup;
module.exports = exports['default'];

/***/ })
/******/ ]);
//# sourceMappingURL=827a2bccaddd5525062b.js.map
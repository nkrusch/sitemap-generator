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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
*/
var CenteredPopup = function () {
    function CenteredPopup() {
        _classCallCheck(this, CenteredPopup);
    }

    _createClass(CenteredPopup, null, [{
        key: "center",


        /**
         * @description Compute offset for element to center it within some space
         * @param {Number} max max width
         * @param {Number} size element width
         * @return {Number}
         */
        value: function center(max, size) {
            return parseInt(Math.max(0, Math.round(0.5 * (max - size))), 0);
        }

        /**
         * @description Request viewport dimensions from chrome runtime
         * @returns {Promise}
         */

    }, {
        key: "getBounds",
        value: function getBounds() {
            return new Promise(function (resolve) {
                window.chrome.system.display.getInfo(resolve);
            });
        }

        /**
         * @description Create centered popup window in the middle of user's monitor viewport.
         * If user has multiple monitors this method launches window in the first/leftmost monitor.
         * This method requires `system.display` permission in `manifest.json`
         * @param {number} width - width of the new window (px)
         * @param {number} height - height of the new window (px)
         * @param {String} url - url to open
         * @param {String} type - enum "popup" or "normal" - defaults to popup
         * @returns {Promise}
         */

    }, {
        key: "open",
        value: function open(width, height, url, type) {

            return new Promise(function (resolve) {
                function openWindow(info) {
                    var area = info[0].workArea;

                    window.chrome.windows.create({
                        url: url,
                        width: width,
                        height: height,
                        focused: true,
                        type: type,
                        left: CenteredPopup.center(area.width, width),
                        top: CenteredPopup.center(area.height, height)
                    }, resolve);
                }

                CenteredPopup.getBounds().then(openWindow).catch(function () {
                    openWindow([{ workArea: { width: 0, height: 0 } }]);
                });
            });
        }
    }]);

    return CenteredPopup;
}();

exports.default = CenteredPopup;
module.exports = exports["default"];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const downloadsPage = 'chrome://downloads';

/**
 * @class
 */
var GeneratorUtils = function () {
    function GeneratorUtils() {
        _classCallCheck(this, GeneratorUtils);
    }

    _createClass(GeneratorUtils, null, [{
        key: 'download',


        /**
         * @description Download file
         * @param {String} filename - output filename
         * @param {String} text - base64 file content
         */
        value: function download(filename, text) {

            var myblob = new Blob([text], {
                type: 'text/xml'
            }),
                fileObjectURL = URL.createObjectURL(myblob);

            window.open(fileObjectURL);
            window.chrome.downloads.download({
                url: fileObjectURL,
                filename: filename
            });
        }

        /**
         * @description this function creates the sitemap and downloads it,
         * then opens or activates downloads tab
         */

    }, {
        key: 'makeSitemap',
        value: function makeSitemap(url, successUrls) {

            if (!successUrls || !successUrls.length) {
                return;
            }
            var entries = successUrls.sort().map(function (u) {
                return '<url><loc>{u}</loc></url>'.replace('{u}', encodeURI(u));
            });

            var sitemap = ['<?xml version=\'1.0\' encoding=\'UTF-8\'?>', '<urlset xmlns=\'http://www.sitemaps.org/schemas/sitemap/0.9\'>', '\r\n', entries.join('\r\n'), '</urlset>'].join('');

            var lastmod = Date.now(),
                fnameUrl = url.replace(/[\/:.]/g, '_'),
                filename = fnameUrl + '_sitemap_' + lastmod + '.xml';

            GeneratorUtils.download(filename, sitemap);
        }

        /**
         * @description Load content script in some tab
         * @param {id} tabId
         * @param {function} errorCallback
         */

    }, {
        key: 'loadContentScript',
        value: function loadContentScript(tabId, errorCallback) {
            return window.chrome.tabs.executeScript(tabId, {
                file: 'content.js',
                runAt: 'document_end'
            }, function () {
                return !window.chrome.runtime.lastError || errorCallback();
            });
        }

        /**
         * @description Launch tab for specific url
         * @param {Number} windowId - parent window
         * @param {String} url
         * @param {function} errorCallback - handler if this request fails
         */

    }, {
        key: 'launchTab',
        value: function launchTab(windowId, url, errorCallback) {
            window.chrome.tabs.create({
                url: url,
                windowId: windowId,
                active: false
            }, function () {
                if (window.chrome.runtime.lastError) {
                    errorCallback();
                }
            });
        }

        /**
         * @description Read headers array looking for specified key
         * @param {Array<Object>} headers - http headers
         * @param {String} key - header name
         * @example  let contentTypeValue = getHeaderValue(headerArray, "content-type");
         */

    }, {
        key: 'getHeaderValue',
        value: function getHeaderValue(headers, key) {
            if (!headers || !headers.length) {
                return '';
            }
            for (var i = 0; i < headers.length; ++i) {
                if (headers[i].name.toLowerCase() === key) {
                    return headers[i].value;
                }
            }
            return '';
        }

        /**
         * @description Remove tabs
         * @param {Array<Object>} tabArray - chrome.tabs
         */

    }, {
        key: 'closeTabs',
        value: function closeTabs(tabArray) {
            if (tabArray && tabArray.length) {
                for (var i = 0; i < tabArray.length; i++) {
                    window.chrome.tabs.remove(tabArray[i].id);
                }
            }
        }

        /**
         * @description Get all existing tabs based on window id
         * @param {Number} windowId
         * @param {String} domain - limit matches by domain
         * @param {function} callback - response handler
         */

    }, {
        key: 'getExistingTabs',
        value: function getExistingTabs(windowId, domain, callback) {
            window.chrome.tabs.query({
                windowId: windowId,
                url: domain
            }, function (tabs) {
                callback(tabs || []);
            });
        }

        /**
         * @description Check if url should be excluded based on its file type
         * @param {String} test - uri string to test
         * @param {Array<String>} excludedTypes - file types that should be excluded
         */

    }, {
        key: 'testFileExtension',
        value: function testFileExtension(test, excludedTypes) {

            var badFileExtension = false;

            if (test.indexOf('/') > -1) {
                var parts = test.split('/'),
                    last = parts[parts.length - 1];

                if (last.length) {
                    badFileExtension = excludedTypes.filter(function (f) {
                        return last.indexOf(f) > 0;
                    }).length > 0;
                }
            }

            return badFileExtension;
        }

        /**
         * @description Formatter for urls that contain shebang
         */

    }, {
        key: 'shebangHandler',
        value: function shebangHandler(u, lists) {
            var page = u.substr(0, u.indexOf('#!')),
                success = lists.success.contains(page),
                error = lists.error.contains(page);

            if (success || error) {
                lists.complete.add(u);
            }
            if (success) {
                lists.success.add(u);
            }
            if (error) {
                lists.error.add(u);
            }
        }

        /**
         * @description When urls are discovered, run them
         * through this url formatter
         * @param {String} u
         * @param {Object} lists
         * @returns {string|*}
         */

    }, {
        key: 'urlFormatter',
        value: function urlFormatter(u, lists) {
            // make sure all urls are encoded
            u = encodeURI(u);

            // if SHEBANG
            if (u.indexOf('#!') > 0) {
                GeneratorUtils.shebangHandler(u, lists);
            } else if (u.indexOf('#') > 0) {
                // clear all other Hashes
                u = u.substr(0, u.indexOf('#'));
            }
            return u;
        }
    }]);

    return GeneratorUtils;
}();

exports.default = GeneratorUtils;
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _centeredPopup = __webpack_require__(0);

var _centeredPopup2 = _interopRequireDefault(_centeredPopup);

var _generator = __webpack_require__(3);

var _generator2 = _interopRequireDefault(_generator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var generator = void 0;
var setupPageURI = void 0;

/**
 * @class
 */

var BackgroundApi = function () {
    function BackgroundApi() {
        _classCallCheck(this, BackgroundApi);

        setupPageURI = window.chrome.extension.getURL('setup.html');
        window.chrome.runtime.onMessage.addListener(BackgroundApi.launchRequest);
        window.chrome.browserAction.onClicked.addListener(BackgroundApi.openSetupPage);
    }

    /**
     * @description Determine what url to launch when setup page should launch
     */


    _createClass(BackgroundApi, null, [{
        key: 'resolveSetupPageUrl',
        value: function resolveSetupPageUrl(url) {

            var appPath = '';

            if (url && url.indexOf('http') === 0) {
                appPath = url;
            }

            return setupPageURI + '?u=' + appPath;
        }

        /**
         * @description When user clicks extension icon, launch the session configuration page.
         * Also read the url of the active tab and provide that as the default url to crawl on the setup page.
         * @param {Object} tab - current active tab,
         * @see {@link https://developer.chrome.com/extensions/browserAction#event-onClicked|onClicked}
         */

    }, {
        key: 'openSetupPage',
        value: function openSetupPage(tab) {
            if (generator) {
                return false;
            }

            var windowUrl = BackgroundApi.resolveSetupPageUrl(tab.url);

            return _centeredPopup2.default.open(600, 600, windowUrl, 'popup').then(BackgroundApi.setupWindowId);
        }

        /**
         * @description Request to start new generator instance.
         * This function gets called when user is ready to start new crawling session.
         * At this point in time the extension will make sure the extension has been granted all necessary
         * permissions, then start the generator.
         * @see {@link https://developer.chrome.com/apps/runtime#event-onMessage|onMessage event}.
         * @param {Object} request - message content
         * @param {Object} request.start - configuration options
         * @param {Object} sender - chrome runtime provided sender information
         * @see {@link https://developer.chrome.com/extensions/runtime#type-MessageSender|MessageSender}
         */

    }, {
        key: 'launchRequest',
        value: function launchRequest(request, sender) {
            if (!request.start) {
                return false;
            }

            var config = request.start,
                callback = function callback(granted) {
                return BackgroundApi.handleGrantResponse(granted, config, sender);
            };

            window.chrome.permissions.request({
                permissions: ['tabs', 'downloads'],
                origins: [config.requestDomain]
            }, callback);
            return true;
        }

        /**
         * @ignore
         * @description when permission request resolves, take action based on the output
         * @param {boolean} granted - true if permission granted
         * @param {Object} config - runtime settings
         */

    }, {
        key: 'handleGrantResponse',
        value: function handleGrantResponse(granted, config, sender) {
            if (sender && sender.tab) {
                window.chrome.tabs.remove(sender.tab.id);
            }
            if (granted) {
                BackgroundApi.onStartGenerator(config);
            } else {
                window.alert(window.chrome.i18n.getMessage('permissionNotGranted'));
            }
            return granted;
        }

        /**
         * @ignore
         * @description When craawl session ends, clear the variable
         */

    }, {
        key: 'onCrawlComplete',
        value: function onCrawlComplete() {
            generator = null;
        }

        /**
         * @ignore
         * @description Start new generator instance
         * @param {Object} config - generator configuration
         */

    }, {
        key: 'onStartGenerator',
        value: function onStartGenerator(config) {
            if (generator) {
                return false;
            }
            config.callback = BackgroundApi.onCrawlComplete;
            generator = new _generator2.default(config);
            generator.start();
            return generator;
        }
    }]);

    return BackgroundApi;
}();

exports.default = BackgroundApi;
module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _centeredPopup = __webpack_require__(0);

var _centeredPopup2 = _interopRequireDefault(_centeredPopup);

var _generatorUtils = __webpack_require__(1);

var _generatorUtils2 = _interopRequireDefault(_generatorUtils);

var _webRequests = __webpack_require__(4);

var _webRequests2 = _interopRequireDefault(_webRequests);

var _queueManager = __webpack_require__(5);

var _queueManager2 = _interopRequireDefault(_queueManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var url = void 0,
    requestDomain = void 0,
    initialCrawlCompleted = void 0,
    onCompleteCallback = void 0,
    contenttypePatterns = void 0,
    excludeExtension = void 0,
    successCodes = void 0,
    maxTabCount = void 0,
    terminating = void 0,
    targetRenderer = void 0,
    progressInterval = void 0,
    requestListener = void 0,
    lists = void 0;

/**
 * @class
 * @description This module crawls some website and generates a sitemap
 * for it. The process works as follows:
 *
 * 1. on start the generator will create a rendering window and
 * open a tab for the start url; then wait for http headers response.
 * 2. If received headers indicate success, generator will load a
 * crawling script in the tab that will scan the page looking for a-tag urls.
 * 3. The content script will send a message back to the generator with a
 * list of urls found on the page.
 * the generator will add all new urls to the queue and close the tab
 * 4. After the initial url has been processed new tabs will open on a
 * set interval to account for possible
 * errors and non-response until all urls in the processing queue have been checked
 * 5. After everything has been cheked the generator will close the window and provide
 * the results to the end user
 *
 * @param {Object} config - configuration options
 * @param {string} config.url - the website/app path we want to crawl
 * -- all sitemap entries will be such that they include this base url
 * @param {String} config.requestDomain - Chrome url match pattern for above url
 * @see {@link https://developer.chrome.com/apps/match_patterns|Match Patterns}
 * @param {Array<string>} config.contenttypePatterns - http response content
 * types we want to include in the sitemap
 * @param {Array<string>} config.excludeExtension - file extensions which should
 * be automatically excluded, example: `['.png','.zip']`
 * @param {Array<number>} config.successCodes - http response status codes which
 * should be regarded as successful
 * @param {number} config.maxTabCount - max number of tabs allowed to be open any
 * given time
 * @param {function} config.callback - *(optional)* function to call when sitemap
 * generation has completed
 */

var Generator = function () {
    function Generator(config) {
        _classCallCheck(this, Generator);

        url = config.url;
        requestDomain = config.requestDomain;
        onCompleteCallback = config.callback;
        contenttypePatterns = config.contenttypePatterns || [];
        excludeExtension = config.excludeExtension || [];
        successCodes = config.successCodes || [];
        maxTabCount = Math.max(1, config.maxTabCount);
        terminating = false;
        progressInterval = null;
        lists = new _queueManager2.default();

        this.generatorApi = this.generatorApi.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.navigateToNext = this.navigateToNext.bind(this);
        this.processDiscoveredUrls = this.processDiscoveredUrls.bind(this);
    }

    /**
     * @description Initiates crawling of some website
     */


    _createClass(Generator, [{
        key: 'start',
        value: function start() {
            var _this = this;

            var launchPage = window.chrome.extension.getURL('process.html');
            var onError = function onError(u) {
                lists.error.add(u);
            },
                onSuccess = function onSuccess(u) {
                lists.success.add(u);
            };

            initialCrawlCompleted = false;
            requestListener = new _webRequests2.default(requestDomain, successCodes, contenttypePatterns, {
                onMessage: this.generatorApi,
                onNext: this.navigateToNext,
                onUrls: this.processDiscoveredUrls,
                onTerminate: this.onComplete,
                onError: onError,
                onSuccess: onSuccess
            });

            _centeredPopup2.default.open(800, 800, launchPage, 'normal').then(function (window) {
                targetRenderer = window.id;
                // 1. add the first url to processing queue
                lists.pending.add(url);
                // 2. navigate to first url
                _this.navigateToNext();
                // 3. start interval that progressively works through the queue
                progressInterval = setInterval(_this.navigateToNext, 500);
            });
        }

        /**
         * @description Listen to messages from the browser tabs
         * @see {@link https://developer.chrome.com/apps/runtime#event-onMessage|onMessage event}.
         * @param request - message parameters
         * @param request.terminate - stops generator
         * @param request.status - gets current processing status
         * @param request.urls - receive list of urls from crawler
         * @param request.noindex - tells generator not to index some url, see
         * @param {Object} sender -  message sender
         * @param {function?} sendResponse - callback function
         */

    }, {
        key: 'generatorApi',
        value: function generatorApi(request, sender, sendResponse) {
            if (request.terminate) {
                this.onComplete();
            } else if (request.noindex) {
                Generator.excludeFromIndex(request.noindex);
            } else if (request.urls) {
                this.urlMessageReceived(request.urls, sender);
            } else if (request.status) {
                return sendResponse(Generator.status());
            } else if (request.crawlUrl) {
                return sendResponse(url);
            }
            return false;
        }

        /**
         * @description When url message is received, process urls,
         * then close tab that sent the message
         */

    }, {
        key: 'urlMessageReceived',
        value: function urlMessageReceived(urls, sender) {
            this.processDiscoveredUrls(urls);
            if (sender && sender.tab) {
                window.chrome.tabs.remove(sender.tab.id);
            }
            initialCrawlCompleted = true;
        }

        /**
         * @description when urls are discovered through some means, this function determines
         * how they should be handled
         * @param {Array<String>} urls - the urls to process
         */

    }, {
        key: 'processDiscoveredUrls',
        value: function processDiscoveredUrls(urls) {
            (urls || []).map(function (u) {

                // format received urls
                return _generatorUtils2.default.urlFormatter(u, lists);
            }).filter(function (u) {

                var test = u.replace(url, '');
                var badFileExtension = _generatorUtils2.default.testFileExtension(test, excludeExtension);

                // filter down to new urls in target domain
                // + exclude everything that is clearly not html/text
                return u.indexOf(url) === 0 && !lists.complete.contains(u) && !lists.pending.contains(u) && !badFileExtension;
            }).map(function (u) {
                lists.pending.add(u);
            });
        }

        /**
         * @description this method will kill any ongoing
         * generator and/or wrap up when processing is done
         */

    }, {
        key: 'onComplete',
        value: function onComplete() {
            if (terminating) {
                return;
            }
            terminating = true;
            clearInterval(progressInterval);
            var sitemap = function sitemap() {
                return _generatorUtils2.default.makeSitemap(url, lists.success.items);
            };

            (function closeRenderer() {
                _generatorUtils2.default.getExistingTabs(targetRenderer, requestDomain, function (result) {
                    if (result.length) {
                        _generatorUtils2.default.closeTabs(result);
                        setTimeout(closeRenderer, 250);
                    } else {
                        requestListener.destroy();
                        onCompleteCallback();
                        window.chrome.windows.remove(targetRenderer, sitemap);
                    }
                });
            })();
        }

        /**
         * @description take first queued url and create new tab for that url
         */

    }, {
        key: 'navigateToNext',
        value: function navigateToNext() {
            var _this2 = this;

            if (terminating) {
                return;
            }

            _generatorUtils2.default.getExistingTabs(targetRenderer, requestDomain, function (tabs) {
                Generator.nextAction(!!tabs.length, lists.pending.empty, _this2.onComplete);
            });
        }

        /**
         * @description Determine if it is time to launch new tab, terminate, or wait
         * @param {boolean} openTabs - number of open tabs
         * @param {boolean} emptyQueue - true if no pending urls
         */

    }], [{
        key: 'nextAction',
        value: function nextAction(openTabs, emptyQueue, onComplete) {
            if (!openTabs && emptyQueue && initialCrawlCompleted) {
                onComplete();
            }
            if (emptyQueue || openTabs > maxTabCount) {
                return;
            }

            var nextUrl = lists.pending.first;

            if (!lists.complete.contains(nextUrl)) {
                lists.complete.add(nextUrl);
                _generatorUtils2.default.launchTab(targetRenderer, nextUrl, onComplete);
            }
        }

        /**
         * @description Get stats about ongoing processing status
         */

    }, {
        key: 'status',
        value: function status() {
            return {
                url: url,
                queue: lists.pending.length,
                completed: lists.complete.length,
                success: lists.success.length,
                error: lists.error.length
            };
        }

        /**
         * @description Exclude discovered url from sitemap
         * @param {String} url - the url that should not be included in the sitemap
         */

    }, {
        key: 'excludeFromIndex',
        value: function excludeFromIndex(url) {
            url = encodeURI(url);
            lists.complete.add(url);
            lists.success.remove(url);
        }
    }]);

    return Generator;
}();

exports.default = Generator;
module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _generatorUtils = __webpack_require__(1);

var _generatorUtils2 = _interopRequireDefault(_generatorUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var successStatusCodes = void 0,
    validContentTypes = void 0,
    requestDomain = void 0,
    onMessageCallback = void 0,
    onNextCallback = void 0,
    onUrlsCallback = void 0,
    onErrorCallback = void 0,
    onSuccessCallback = void 0,
    onTerminate = void 0;

/**
 * @class
 * @description creating this class will attach webrequest listerers to runtime
 * allowing monitoring http request and tab load state.
 * Once all processing is done call `destroy()` method to detact the listeners.
 * @param {String} requestDomain - base url to monitor
 * @param {Array<Number>} successCodes - list of http status codes that are considered successsful
 * @param {Array<String>} contenttypePatterns - list of content types that should be crawled;
 * when content type is detected that falls outside this list, the tab will immediately close
 * @param {Object} callbacks - callback functions to handle various events
 * @param {function} callbacks.onMessage - when chrome.runtime.onMessage occurs
 * @param {function} callback.onNext - when next url should launch
 * @param {function} callback.onUrls - when some url has been discovered
 * @param {function} callback.onTerminate - when contentScript fails to load we should terminate
 * @param {function} callback.onError - handler when some individual url returns error response
 * @param {function} callback.onUrlError - handler when some individual url returns success response
 */

var WebRequestListeners = function () {
    function WebRequestListeners(domain, statusCodes, contentTypes, callbacks) {
        _classCallCheck(this, WebRequestListeners);

        requestDomain = domain;
        successStatusCodes = statusCodes;
        validContentTypes = contentTypes;
        onMessageCallback = callbacks.onMessage;
        onNextCallback = callbacks.onNext;
        onUrlsCallback = callbacks.onUrls;
        onErrorCallback = callbacks.onError;
        onSuccessCallback = callbacks.onSuccess;
        onTerminate = callbacks.onTerminate;
        this.listeners(true);
    }

    /**
     * @description remove all requestListeners
     */


    _createClass(WebRequestListeners, [{
        key: 'destroy',
        value: function destroy() {
            this.listeners(false);
        }

        /**
         * @description Add or remove runtime event handlers
         * @param {boolean} add - true to add, false to remove
         */

    }, {
        key: 'listeners',
        value: function listeners(add) {

            var action = add ? 'addListener' : 'removeListener';

            var modifyListener = function modifyListener(event, callback, filters) {
                window.chrome.webRequest[event][action](callback, { urls: [requestDomain], types: ['main_frame'] }, filters);
            };

            window.chrome.runtime.onMessage[action](onMessageCallback);
            modifyListener('onHeadersReceived', WebRequestListeners.onHeadersReceivedHandler, ['blocking', 'responseHeaders']);
            modifyListener('onBeforeRedirect', WebRequestListeners.onBeforeRedirect, ['responseHeaders']);
            modifyListener('onCompleted', WebRequestListeners.onTabLoadListener, ['responseHeaders']);

            window.chrome.webRequest.onErrorOccurred[action](WebRequestListeners.onTabErrorHandler, { urls: [requestDomain], types: ['main_frame'] });
        }

        /**
         * @description listen to headers to determine type and cancel
         * and close tab immediately if the detected content type is not
         * on the list of target types
         * @param {Object} details - provided by Chrome
         * @see {@link https://developer.chrome.com/extensions/webRequest#event-onHeadersReceived | onHeadersReceived}
         */

    }], [{
        key: 'onHeadersReceivedHandler',
        value: function onHeadersReceivedHandler(details) {

            var contentType = _generatorUtils2.default.getHeaderValue(details.responseHeaders, 'content-type');

            contentType = contentType.split(';')[0].trim().toLowerCase();

            var cancel = false,
                validType = validContentTypes.indexOf(contentType) >= 0;

            if (!validType) {
                window.chrome.tabs.remove(details.tabId);
                cancel = true;
            }

            return { cancel: cancel };
        }

        /**
         * @description Listen to incoming webrequest headers
         * @param {Object} details - provided by chrome
         * @see {@link https://developer.chrome.com/extensions/webRequest#event-onCompleted | OnComplete}
         */

    }, {
        key: 'onTabLoadListener',
        value: function onTabLoadListener(details) {
            if (successStatusCodes.indexOf(details.statusCode) < 0) {
                onErrorCallback(details.url);
                WebRequestListeners.onTabErrorHandler(details);
            } else {
                onSuccessCallback(details.url);
                _generatorUtils2.default.loadContentScript(details.tabId, onTerminate);
            }
        }

        /**
         * @description whenever request causes redirect, put the
         * new url in queue and terminate current request
         */

    }, {
        key: 'onBeforeRedirect',
        value: function onBeforeRedirect(details) {
            onUrlsCallback([details.redirectUrl]);
            window.chrome.tabs.remove(details.tabId);
            return { cancel: true };
        }

        /**
         * @description if tab errors, close it and load next one
         */

    }, {
        key: 'onTabErrorHandler',
        value: function onTabErrorHandler(details) {
            window.chrome.tabs.remove(details.tabId, onNextCallback);
        }
    }]);

    return WebRequestListeners;
}();

exports.default = WebRequestListeners;
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleQueue = function () {
    function SimpleQueue() {
        _classCallCheck(this, SimpleQueue);

        this.queue = [];
    }

    _createClass(SimpleQueue, [{
        key: "contains",


        /**
         * @description Check if queue contains some item
         * @param {String} url
         * @returns {boolean}
         */
        value: function contains(url) {
            return this.queue.indexOf(url) >= 0;
        }

        /**
         * @description Add item to queue
         * @param {String} url
         */

    }, {
        key: "add",
        value: function add(url) {
            if (this.queue.indexOf(url) < 0) {
                this.queue.push(url);
            }
        }
    }, {
        key: "remove",


        /**
         * @description Remove item from queue
         * @param {String} url
         */
        value: function remove(url) {
            var index = this.queue.indexOf(url);

            if (index >= 0) {
                this.queue.splice(index, 1);
            }
        }
    }, {
        key: "length",
        get: function get() {
            return this.queue.length;
        }
    }, {
        key: "empty",
        get: function get() {
            return this.queue.length === 0;
        }
    }, {
        key: "items",
        get: function get() {
            return this.queue.slice();
        }
    }, {
        key: "first",
        get: function get() {
            return this.queue.shift();
        }
    }]);

    return SimpleQueue;
}();

var QueueManager = function () {
    function QueueManager() {
        _classCallCheck(this, QueueManager);

        this.processQueue = new SimpleQueue();
        this.completedUrls = new SimpleQueue();
        this.errorHeaders = new SimpleQueue();
        this.successUrls = new SimpleQueue();
    }

    _createClass(QueueManager, [{
        key: "success",
        get: function get() {
            return this.successUrls;
        }
    }, {
        key: "pending",
        get: function get() {
            return this.processQueue;
        }
    }, {
        key: "error",
        get: function get() {
            return this.errorHeaders;
        }
    }, {
        key: "complete",
        get: function get() {
            return this.completedUrls;
        }
    }]);

    return QueueManager;
}();

exports.default = QueueManager;
module.exports = exports["default"];

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class
 * @description Listens and responds to interesting Chrome runtime events
 */
var BackgroundEvents = function () {
    function BackgroundEvents() {
        _classCallCheck(this, BackgroundEvents);

        window.chrome.runtime.onInstalled.addListener(BackgroundEvents.onInstalledEvent);
    }

    /**
     * @description When user first installs extension,
     * launch Google image search page
     * @param {Object} details - @see {@link https://developer.chrome.com/apps/runtime#event-onInstalled|OnIstalled}
     */


    _createClass(BackgroundEvents, null, [{
        key: 'onInstalledEvent',
        value: function onInstalledEvent(details) {
            if (details.reason === 'install') {
                var introUrl = window.chrome.runtime.getURL('intro.html');

                window.chrome.tabs.create({ url: introUrl });
            }
        }
    }]);

    return BackgroundEvents;
}();

exports.default = BackgroundEvents;
module.exports = exports['default'];

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(0);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(3);
__webpack_require__(1);
__webpack_require__(5);
module.exports = __webpack_require__(4);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _backgroundApi = __webpack_require__(2);

var _backgroundApi2 = _interopRequireDefault(_backgroundApi);

var _events = __webpack_require__(6);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  return new _backgroundApi2.default();
})();
(function () {
  return new _events2.default();
})();

/***/ })
/******/ ]);
//# sourceMappingURL=190b35a3b37059146f20.js.map
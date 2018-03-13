import GeneratorUtils from './generatorUtils';

let successStatusCodes,
    validContentTypes,
    requestDomain,
    onMessageCallback,
    onNextCallback,
    onUrlsCallback,
    onErrorCallback,
    onSuccessCallback,
    onTerminate;

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
class WebRequestListeners {

    constructor(domain, statusCodes, contentTypes, callbacks) {
        requestDomain = domain;
        successStatusCodes = statusCodes;
        validContentTypes = contentTypes;
        onMessageCallback = callbacks.onMessage.bind(this);
        onNextCallback = callbacks.onNext.bind(this);
        onUrlsCallback = callbacks.onUrls.bind(this);
        onErrorCallback = callbacks.onError.bind(this);
        onSuccessCallback = callbacks.onSuccess.bind(this);
        onTerminate = callbacks.onTerminate.bind(this);
        this.listeners(true);
    }

    /**
     * @description remove all requestListeners
     */
    destroy() {
        this.listeners(false);
    }
    /**
     * @ignore
     * @description Add or remove runtime event handlers
     * @param {boolean} add - true to add, false to remove
     */
    listeners(add) {
        let action = add ? 'addListener' : 'removeListener';

        window.chrome.runtime.onMessage[action](onMessageCallback);

        window.chrome.webRequest.onHeadersReceived[action](this.onHeadersReceivedHandler,
            { urls: [requestDomain], types: ['main_frame'] }, ['blocking', 'responseHeaders']);

        window.chrome.webRequest.onBeforeRedirect[action](this.onBeforeRedirect,
            { urls: [requestDomain], types: ['main_frame'] }, ['responseHeaders']);

        window.chrome.webRequest.onCompleted[action](this.onTabLoadListener,
            { urls: [requestDomain], types: ['main_frame'] }, ['responseHeaders']);

        window.chrome.webRequest.onErrorOccurred[action](this.onTabErrorHandler,
            { urls: [requestDomain], types: ['main_frame'] });
    }
    /**
     * @ignore
     * @description listen to headers to determine type and cancel
     * and close tab immediately if the detected content type is not
     * on the list of target types
     * @param {Object} details - provided by Chrome
     * @see {@link https://developer.chrome.com/extensions/webRequest#event-onHeadersReceived | onHeadersReceived}
     */
    onHeadersReceivedHandler(details) {

        let contentType = GeneratorUtils.getHeaderValue(
            details.responseHeaders, 'content-type');

        contentType = contentType
            .split(';')[0].trim().toLowerCase();

        let cancel = false,
            validType = validContentTypes
                .indexOf(contentType) >= 0;

        if (!validType) {
            window.chrome.tabs.remove(details.tabId);
            cancel = true;
        }

        return { cancel: cancel };
    }
    /**
     * @ignore
     * @description Listen to incoming webrequest headers
     * @param {Object} details - provided by chrome
     * @see {@link https://developer.chrome.com/extensions/webRequest#event-onCompleted | OnComplete}
     */
    onTabLoadListener(details) {

        let status = GeneratorUtils
            .getHeaderValue(details.responseHeaders, 'status');

        if (successStatusCodes.indexOf(parseInt(status, 0)) < 0) {
            onErrorCallback(details.url);
            this.onTabErrorHandler(details);
            return;
        }

        onSuccessCallback(details.url);
        GeneratorUtils.loadContentScript(details.tabId, onTerminate);
    }
    /**
     * @ignore
     * @description whenever request causes redirect, put the
     * new url in queue and terminate current request
     */
    onBeforeRedirect(details) {
        onUrlsCallback([details.redirectUrl]);
        window.chrome.tabs.remove(details.tabId);
        return { cancel: true };
    }
    /**
     * @ignore
     * @description if tab errors, close it and load next one
     */
    onTabErrorHandler(details) {
        window.chrome.tabs.remove(details.tabId, onNextCallback);
    }
}

export default WebRequestListeners;

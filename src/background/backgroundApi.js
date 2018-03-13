import CenteredPopup from './centeredPopup.js';
import Generator from './generator.js';

let generator;
let setupPageURI;

/**
 * @class
 */
class BackgroundApi {

    constructor() {
        setupPageURI = window.chrome.extension.getURL('setup.html');
        window.chrome.runtime.onMessage.addListener(BackgroundApi.launchRequest);
        window.chrome.browserAction.onClicked.addListener(BackgroundApi.openSetupPage);
    }

    /**
     * @description Determine what url to launch when setup page should launch
     */
    static resolveSetupPageUrl(url) {

        let appPath = '';

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
    static openSetupPage(tab) {
        if (generator) {
            return false;
        }

        let windowUrl = BackgroundApi.resolveSetupPageUrl(tab.url);

        return CenteredPopup.open(600, 600, windowUrl, 'popup')
            .then(BackgroundApi.setupWindowId);
    }

    /**
     * @description Request to start new generator instance.
     * This function gets called when user is ready to start new crawling session.
     * At this point in time the extension will make sure the extension has been granted all necessary
     * permissions, then start the generator.
     * @see {@link https://developer.chrome.com/apps/runtime#event-onMessage|onMessage event}.
     * @param request.start - configuration options
     * @param {Object} sender -
     * @see {@link https://developer.chrome.com/extensions/runtime#type-MessageSender|MessageSender}
     */
    static launchRequest(request, sender) {
        if (!request.start) {
            return false;
        }

        let config = request.start,
            callback = (granted) => BackgroundApi
                .handleGrantResponse(granted, config, sender);

        window.chrome.permissions.request({
            permissions: ['tabs'],
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
    static handleGrantResponse(granted, config, sender) {
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
    static onCrawlComplete() {
        generator = null;
    }

    /**
     * @ignore
     * @description Start new generator instance
     * @param {Object} config - generator configuration
     */
    static onStartGenerator(config) {
        if (generator) {
            return false;
        }
        config.callback = BackgroundApi.onCrawlComplete;
        generator = new Generator(config);
        generator.start();
        return generator;
    }
}

export default BackgroundApi;

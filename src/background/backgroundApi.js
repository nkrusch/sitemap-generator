import CenteredPopup from './centeredPopup.js';
import Generator from './generator.js';

let setupWindow, generator;

/**
 * @class
 */
class BackgroundApi {

    constructor() {
        window.chrome.runtime.onMessage.addListener(BackgroundApi.launchRequest);
        window.chrome.browserAction.onClicked.addListener(BackgroundApi.openSetupPage);
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

        let appPath = tab.url.indexOf('http') === 0 ? tab.url : '',
            setupPage = window.chrome.extension.getURL('setup.html');

        return CenteredPopup.open(600, 600, setupPage + '?u=' + appPath, 'popup')
            .then((window) => {
                setupWindow = window.id;
            });
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
    static launchRequest(request) {
        if (generator || !request.start) {
            return false;
        }

        let config = request.start;

        window.chrome.permissions.request({
            permissions: ['tabs'],
            origins: [config.requestDomain]
        }, (granted) => BackgroundApi.handleGrantResponse(granted, config));
        return true;
    }

    /**
     * @ignore
     * @description when permission request resolves, take action based on the output
     * @param {boolean} granted - true if permission granted
     * @param {Object} config - runtime settings
     */
    static handleGrantResponse(granted, config) {
        BackgroundApi.closeSetupWindow();
        if (granted) {
            return BackgroundApi.onStartGenerator(config);
        }
        window.alert(window.chrome.i18n.getMessage('permissionNotGranted'));
        return false;
    }

    /**
     * @ignore
     * @description Try close the setup window
     */
    static closeSetupWindow() {
        if (setupWindow) {
            window.chrome.windows.remove(setupWindow, () => {
                if (window.chrome.runtime.lastError) ;
                setupWindow = null;
            });
        }
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
        if (!generator) {
            config.callback = BackgroundApi.onCrawlComplete;
            generator = new Generator(config);
            generator.start();
            return generator;
        }
        return false;
    }
}

export default BackgroundApi;

/**
 * @class
 * @description Listens and responds to interesting Chrome runtime events
 */
class BackgroundEvents {

    constructor() {
        window.chrome.runtime.onInstalled.addListener(
            BackgroundEvents.onInstalledEvent);
    }

    /**
     * @description When user first installs extension,
     * launch Google image search page
     * @param {Object} details - @see {@link https://developer.chrome.com/apps/runtime#event-onInstalled|OnIstalled}
     */
    static onInstalledEvent(details) {
        if (details.reason === 'install') {
            let introUrl = window.chrome.runtime.getURL('intro.html');

            window.chrome.tabs.create({ url: introUrl });
        }
    }
}

export default BackgroundEvents;

/**
 * @namespace
 * @description Listens and responds to interesting Chrome runtime events
 */
export default class backgroundEvents {

    constructor() {
        window.chrome.runtime.onInstalled.addListener(
            backgroundEvents.onInstalledEvent);
    }

    /**
     * @description When user first installs extension,
     * launch Google image search page
     * @param {Object} details - @see {@link https://developer.chrome.com/apps/runtime#event-onInstalled|OnIstalled}
     */
    static onInstalledEvent(details) {
        if (details.reason === 'install') {
            let introUrl = 'https://sneeakco.github.io/sitemap-generator/intro';

            window.chrome.tabs.create({ url: introUrl });
        }
    }
}

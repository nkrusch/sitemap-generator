/**
 * @class
 * @classdesc Attach handler for Chrome install
 */
class OnInstallHandler {

    static get options() {
        return {
            openUri: 'openUri',
            demo: 'demo',
            custom: 'custom'
        };
    }

    static launchDemo(config) {
        const {url, css, js} = config;

        window.chrome.tabs.create({url: url}, tab => {
            window.chrome.tabs.insertCSS(tab.id, {
                    file: css[0],
                    runAt: 'document_end'
                }, window.chrome.tabs.executeScript(tab.id, {
                    file: js[0],
                    runAt: 'document_end'
                })
            );
        });
    }

    static openUrl(uri) {
        return window.chrome.tabs.create({url: uri});
    }

    constructor(options) {
        window.chrome.runtime.onInstalled.addListener(details => {
            if (details.reason === 'install') {
                switch (options.action) {
                    case OnInstallHandler.options.openUri:
                        return OnInstallHandler.openUrl(options.uri);
                    case OnInstallHandler.options.demo:
                        return OnInstallHandler.launchDemo(options.config);
                    default:
                        options.handler();
                }
            }
            return false;
        });
    }
}

export default OnInstallHandler;

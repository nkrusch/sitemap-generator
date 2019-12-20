/**
 * @class
 * @description This module is used to configure runtime parameters
 * before generating a sitemap.
 */
class Setup {

    constructor() {

        let siteUrl = Setup.getParameterByName('u', window.location.href),
            siteUrlInput = document.getElementsByName('url')[0],
            startButton = document.getElementById('start');

        /**
         * Initialize input and bind click actions;
         * The initial crawl url will be active tab url if url is available
         **/
        siteUrl = Setup.removePageFromUrl(siteUrl);
        siteUrlInput.value = siteUrl;
        startButton.onclick = Setup.onStartButtonClick;
    }

    /**
     * @static
     * @description Searches for and returns queryString value
     * by key. If key does not exist or has no value, this method
     * returns an empty string.
     * @param {string} name - query string key
     * @param {string} url - url or querystring to search
     * @returns {string} - value if exists; otherwise empty string
     */
    static getParameterByName(name, url) {
        const i = url.indexOf('?') + 1;

        const urlParams = new URLSearchParams(url.substr(i));

        return urlParams.has(name) ? urlParams.get(name) : '';
    }

    /**
     * @description Handle start button click -> this will check user inputs
     * and if successful, send message to background page to initiate crawling.
     * @param {Object} e - click event
     */
    static onStartButtonClick(e) {

        let urlValidation = Setup.validateUrl();

        if (urlValidation.error) {
            return;
        }

        let url = urlValidation.url,
            requestDomain = (url + '/*').replace('//*', '/*'),
            config = {
                url: url,
                requestDomain: requestDomain,
                contenttypePatterns: ['text/html', 'text/plain'],
                excludeExtension: [
                    '.png', '.json', '.jpg', '.jpeg', '.js', '.css',
                    '.zip', '.mp3', '.mp4', '.ogg', '.avi', '.wav',
                    '.webm', '.gif', '.ico'],
                successCodes: [200, 201, 202, 203, 304],
                maxTabCount: 25
            };

        window.chrome.runtime.sendMessage({start: config});
        e.target.innerText = 'Starting....';
        document.getElementById('start').onclick = false;
    }

    /**
     * @description if url ends with page e.g. "index.html" we want to remove
     * this and just keep the application path
     * @param {String} appPath - url
     */
    static removePageFromUrl(appPath) {
        if (appPath && appPath.lastIndexOf('/') > 8) {
            let parts = appPath.split('/'),
                last = parts[parts.length - 1];

            if (last.indexOf('.') > 0 ||
                last.indexOf('#') >= 0 ||
                last.indexOf('?') >= 0) {
                parts.pop();
            }
            appPath = parts.join('/');
        }
        return appPath;
    }

    /**
     * @description Make sure url input is correct
     * @returns {Object} - validation response
     */
    static validateUrl() {
        let siteUrlInput = document.getElementsByName('url')[0],
            siteUrlInputError = document.getElementById('url-error'),
            url = Setup.removePageFromUrl((siteUrlInput.value || '')).trim(),
            message = '';

        if (url.length < 1) {
            message = 'Url value is required';
        } else if (url.split('/').shift().indexOf('http') !== 0) {
            message = 'Url must start with http:// or https://';
        }
        let error = message.length,
            className = 'is-invalid',
            result = {url: url, error: error};

        siteUrlInputError.innerText = message;
        if (error) {
            siteUrlInput.className += ' ' + className;
        } else {
            siteUrlInput.classList.remove(className);
        }
        return result;
    }
}

export default Setup;

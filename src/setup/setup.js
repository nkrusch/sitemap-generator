/**
 * @class
 * @description This module is used to configure runtime params for sitemap generation
 */
class Setup {

    constructor() {

        let siteUrl = Setup.getParameterByName('u', window.location.href),
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
    static getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name +
            '(=([^&#]*)|&|#|$)'), results = regex.exec(url);

        if (!results || !results[2]) return '';
        return decodeURIComponent(results[2]
            .replace(/\+/g, ' '));
    }

    /**
     * @ignore
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
                excludeExtension: ['.png', '.json', '.jpg', '.jpeg', '.js', '.css',
                    '.zip', '.mp3', '.mp4', '.ogg', '.avi', '.wav', '.webm', '.gif', '.ico'],
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
     * @ignore
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
            result = { url: url, error: error };

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

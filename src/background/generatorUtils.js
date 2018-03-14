const downloadsPage = 'chrome://downloads';

/**
 * @class
 */
class GeneratorUtils {

    /**
     * @description move url to a specific processing queue
     */
    static listAdd(url, list) {
        if (list.indexOf(url) < 0) list.push(url);
    };

    /**
     * @description Download file
     * @param {String} filename - output filename
     * @param {String} text - base64 file content
     */
    static download(filename, text) {
        let element = document.createElement('a');

        element.setAttribute('href',
            'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();

        window.chrome.tabs.query({url: downloadsPage + '/*'},
            function (result) {
                if (result && result.length) {
                    window.chrome.tabs.reload(result[0].id, null, function () {
                        window.chrome.tabs.update(result[0].id, {active: true});
                    });
                } else {
                    window.chrome.tabs.create(
                        {url: downloadsPage, active: true});
                }
            });
    }

    /**
     * @description this function creates the sitemap and downloads it,
     * then opens or activates downloads tab
     */
    static makeSitemap(url, successUrls) {

        if (!successUrls || !successUrls.length) {
            return;
        }

        // for (var list in lists)
        //     console.log(list + '\r\n' + lists[list].join('\r\n'));

        let entries = successUrls.sort().map((u) => {
            return '<url><loc>{u}</loc></url>'
                .replace('{u}', encodeURI(u));
        });

        let sitemap = [
            '<?xml version=\'1.0\' encoding=\'UTF-8\'?>',
            '<urlset xmlns=\'http://www.sitemaps.org/schemas/sitemap/0.9\'>',
            '\r\n',
            entries.join('\r\n'),
            '</urlset>']
            .join('');

        let lastmod = Date.now(),
            fnameUrl = url.replace(/[\/:.]/g, '_'),
            filename = fnameUrl + '_sitemap_' + lastmod + '.xml';

        GeneratorUtils.download(filename, sitemap);
    }

    /**
     * @description Load content script in some tab
     * @param {id} tabId
     * @param {function} errorCallback
     */
    static loadContentScript(tabId, errorCallback) {
        return window.chrome.tabs.executeScript(tabId, {
            file: 'content.js',
            runAt: 'document_end'
        }, () => {
            return (!window.chrome.runtime.lastError ||
                errorCallback());
        });
    }

    /**
     * @description Launch tab for specific url
     * @param {Number} windowId - parent window
     * @param {String} url
     * @param {function} errorCallback - handler if this request fails
     */
    static launchTab(windowId, url, errorCallback) {
        window.chrome.tabs.create({
            url: url,
            windowId: windowId,
            active: false
        }, () => {
            return !window.chrome.runtime.lastError ||
                errorCallback();
        });
    }

    /**
     * @description Read headers array looking for specified key
     * @param {Array<Object>} headers - http headers
     * @param {String} key - header name
     * @example  let contentTypeValue = getHeaderValue(headerArray, "content-type");
     */
    static getHeaderValue(headers, key) {
        if (!headers || !headers.length) {
            return '';
        }
        for (let i = 0; i < headers.length; ++i) {
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
    static closeTabs(tabArray) {
        if (tabArray && tabArray.length) {
            for (let i = 0; i < tabArray.length; i++) {
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
    static getExistingTabs(windowId, domain, callback) {
        window.chrome.tabs.query({
            windowId: windowId,
            url: domain
        }, callback);
    }
}

export default GeneratorUtils;

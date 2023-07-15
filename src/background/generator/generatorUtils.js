
/**
 * @class
 */
class GeneratorUtils {

    /**
     * @description Download file
     * @param {String} filename - output filename
     * @param {String} text - base64 file content
     */
    static download(filename, text) {

        let myblob = new Blob([text], {
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
    static makeSitemap(url, successUrls) {

        if (!successUrls || !successUrls.length) {
            return;
        }
        let entries = successUrls.sort().map((u) => {
            return '<url><loc>{u}</loc></url>'
                .replace('{u}', encodeURI(u)
                         .replace(/&/g, '&amp;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;')
                         .replace(/"/g, '&quot;')
                         .replace(/'/g, '&apos;'));
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

    /**
     * @description Check if url should be excluded based on its file type
     * @param {String} test - uri string to test
     * @param {Array<String>} excludedTypes - file types that should be excluded
     */
    static testFileExtension(test, excludedTypes) {

        let badFileExtension = false;

        if (test.indexOf('/') > -1) {
            let parts = test.split('/'),
                last = parts[parts.length - 1];

            if (last.length) {
                badFileExtension = excludedTypes.filter(function (f) {
                    return (last.indexOf(f) > 0);
                }).length > 0;
            }
        }

        return badFileExtension;
    }

    /**
     * @description Formatter for urls that contain shebang
     */
    static shebangHandler(u, lists) {
        let page = u.substr(0, u.indexOf('#!')),
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
    static urlFormatter(u, lists) {
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
}

export default GeneratorUtils;

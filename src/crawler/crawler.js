let hasFired, baseUrl = '';

/**
 * @class
 * @description This script inspects the current page and looks for href's on
 * the page. It also checks page headers for noindex and nofollow.
 */
class Crawler {

    constructor() {

        // get the target url
        Crawler.getBaseUrl();

        hasFired = false;

        // try prevent window.close() because it will terminate everything
        // Then again if you do this on your website, you should get dinged
        Crawler.appendCodeFragment('window.onbeforeunload = null');

        // get robots meta
        let robots = Crawler.getRobotsMeta();

        // remove this url from sitemap if noindex is set
        if (robots.indexOf('noindex') >= 0) {
            window.chrome.runtime.sendMessage({noindex: window.location.href});
        }

        // don't follow links on this page if no follow is set
        if (robots.indexOf('nofollow') >= 0) {
            return window.chrome.runtime.sendMessage({urls: []});
        }

        // wait for onload
        window.onload = Crawler.findLinks;

        // but ensure the function will ultimately run
        window.setTimeout(Crawler.findLinks, 500);
    }

    /**
     * @ignore
     * @description Append some js code fragment in current document DOM
     * @param {String} jsCodeFragment - the code to execute
     */
    static appendCodeFragment(jsCodeFragment) {
        (function _appendToDom(domElem, elem, type, content) {
            let e = document.createElement(elem);

            e.type = type;
            e.textContent = content;
            document.getElementsByTagName(domElem)[0].append(e);
        }('body', 'script', 'text/javascript', jsCodeFragment));
    }

    /**
     * @description Look for 'robots' meta tag in the page header
     * and if found return its contents
     */
    static getRobotsMeta() {
        let metas = document.getElementsByTagName('meta');

        for (let i = 0; i < metas.length; i++) {
            if ((metas[i].getAttribute('name') || '')
                    .toLowerCase() === 'robots' &&
                metas[i].getAttribute('content')) {
                return metas[i].getAttribute('content')
                    .toLowerCase();
            }
        }
        return '';
    }

    /**
     * @description request the app path that is being crawled
     * so we can narrow down the matches when checking links on current page
     */
    static getBaseUrl() {
        window.chrome.runtime.sendMessage({crawlUrl: true}, value => {
            baseUrl = encodeURI(value);
        });
    }

    /**
     * @description Looks for links on the page, then send a message
     * with findings to background page
     */
    static findLinks() {
        if (!hasFired) {
            hasFired = true;

            let result = {}, message = [];

            [].forEach.call(document.querySelectorAll('a[href]'),
                (link) => {
                    result[Crawler.getAbsoluteHref(link)] = 1;
                });
            Object.keys(result).map(function (u) {
                if (u.indexOf(baseUrl) > -1) {
                    message.push(u);
                }
            });
            window.chrome.runtime.sendMessage({urls: message});
        }
    }

    /**
     * @description given an anchor tag, return its href in absolute format
     * @param anchorTag
     */
    static getAbsoluteHref(anchorTag) {
        let href = anchorTag.getAttribute('href');

        if (href.indexOf('http') !== 0) {
            let link = document.createElement('a');

            link.href = href;
            href = (link.protocol + '//' + link.host +
                link.pathname + link.search + link.hash);
        }
        return encodeURI(href);
    }
}

export default Crawler;

import Crawler from '../src/crawler/crawler';
import Libs from "./_mock";

describe('Page Crawler', () => {

    /**
     * Change page DOM
     * @param html - any html to load as page DOM
     */
    function pageHTML(html) {
        document.documentElement.innerHTML = html;
    }

    beforeEach(function () {
        const url = "https://www.google.com";

        // crawlUrl returns base domain
        chrome.runtime.sendMessage.withArgs({crawlUrl: true}).yields(url);

        // override timeout behavior
        Libs.bindTimeoutBehavior();
    });

    it('findLinks dispatches a message with hrefs', () => {
        pageHTML("<html><head></head><body>" +
            "<a href='home.html'>Home</a>" +
            "<a href='https://www.google.com/images'>Google images</a>" +
            "<a href='//www.google.com/app/path'>no protocol</a>" +
            "</body></html>");

        // this assumes page is about:blank;
        // TODO: need to be able to change page location href
        const urls = ['://', 'https://www.google.com/images'];

        chrome.runtime.sendMessage.flush();
        new Crawler();

        expect(chrome.runtime.sendMessage.withArgs({urls})
            .calledOnce, 'message sent once').to.be.true;

        Crawler.findLinks();
        expect(chrome.runtime.sendMessage.withArgs({urls})
            .calledOnce, 'only executes 1 time').to.be.true;
    });

    it('correctly handles pages with nofollow header', () => {
        pageHTML("<html><head>" +
            "<meta content='badmetatag'/>" +
            "<meta name='robots' content='nofollow' />" +
            "</head><body></body></html>");

        chrome.runtime.sendMessage.flush();
        new Crawler();

        expect(window.chrome.runtime.sendMessage
            .withArgs({urls: []}).called).to.be.true;
    });

    it('correctly handles pages with noindex header', () => {
        pageHTML("<html><head>" +
            "<meta name='robots'/>" +
            "<meta name='robots' content='noindex' />" +
            "</head><body></body></html>");
        new Crawler();
        expect(window.chrome.runtime.sendMessage
            .withArgs({ noindex: window.location.href })
            .calledOnce).to.be.true;
    });

});

import Crawler from '../src/crawler/crawler';

describe('Page Crawler', () => {

    before(function () {
        global.pageHTML = (html) => { document.documentElement.innerHTML = html }
    });

    beforeEach(function () {
        chrome.runtime.sendMessage.withArgs({ crawlUrl: true })
            .yields("https://www.google.com");
    })

    afterEach(function () {
        chrome.flush();
        sandbox.restore();
    })

    after(function () {
        delete global.pageHTML;
    })

    it('findLinks dispatches a message with hrefs', () => {
        pageHTML("<html><head></head><body>" +
            "<a href='home.html'>Home</a>" +
            "<a href='https://www.google.com/images'>Google images</a>" +
            "<a href='//www.google.com/app/path'>no protocol</a></body></html>");
        new Crawler();
        chrome.runtime.sendMessage.flush();

        expect(chrome.runtime.sendMessage.notCalled, 'message not sent').to.be.true;
        window.onload();
        expect(chrome.runtime.sendMessage.calledOnce, 'message sent once').to.be.true;
        Crawler.findLinks();
        expect(chrome.runtime.sendMessage.calledOnce, 'only executes 1 time').to.be.true;
    });

    it('correctly handles pages with nofollow header', () => {
        pageHTML("<html><head>" +
            "<meta content='badmetatag'/>" +
            "<meta name='robots' content='nofollow' />" +
            "</head><body></body></html>");
        new Crawler();
        expect(window.chrome.runtime.sendMessage.withArgs({ urls: [] }).calledOnce).to.be.true;
    });

    it('correctly handles pages with noindex header', () => {
        pageHTML("<html><head>" +
            "<meta name='robots'/>" +
            "<meta name='robots' content='noindex' />" +
            "</head><body></body></html>");
        new Crawler();
        expect(window.chrome.runtime.sendMessage.withArgs({ noindex: window.location.href }).calledOnce).to.be.true;
    });

});

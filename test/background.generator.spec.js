import chrome from 'sinon-chrome';
import chai from 'chai';
import Generator from '../src/background/generator';
 
const expect = chai.expect;

let generator, url = "https://www.test.com/",
    requestDomain = url + "/*",
    testPages = {
        a: "https://www.test.com/index.html",
        b: "https://www.test.com/about.html",
        c: "https://www.test.com/home.html",
        d: "https://www.nottest.com/index.html"
    },
    defaultConfig = { url: url, requestDomain: requestDomain },
    defaultSender = { tab: { id: 1 } }


describe('Generator', () => {
    before(() => {
        window.chrome = chrome;
    });
    beforeEach(() => {
        window.chrome.flush();
        generator = new Generator(defaultConfig);
        generator.start();
    });
    it('should start and stop without error', () => {
        expect(() => { generator.start() }).to.not.throw();
        expect(() => { generator.onComplete() }).to.not.throw();
    });
    it('should report status without error', () => {
        expect(() => { generator.status() }).to.not.throw();
    });
    it('should handle noindex without error', () => {
        expect(() => { generator.noindex(url) }).to.not.throw();
    });
    it('should receive urls without error', () => {
        expect(() => { generator.urlMessage([testPages.a, testPages.d], defaultSender) }).to.not.throw();
    });
    it('api should return false if no method matches', () => {
        expect(generator.generatorApi({ badRequest: true })).to.be.false;
    });
    it('api crawlurl should return base url', (done) => {
        generator.generatorApi({ crawlUrl: true }, defaultSender, (resp) => {
            expect(resp).to.equal(defaultConfig.url);
            done();
        })
    });
    afterEach(() => { 
        generator.onComplete();
    });
});
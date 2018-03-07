import chrome from 'sinon-chrome';
import chai from 'chai';
import BackgroundEvents from '../src/background/events';
import BackgroundApi from '../src/background/backgroundApi';
import Generator from '../src/background/generator';
import backgroundApi from '../src/background/backgroundApi';

chai.expect();
require('jsdom-global')();
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

describe('Event pages', () => {

    describe('Background Events', () => {
        before(() => {
            window.chrome = chrome;
        });
        it('constructor should register chrome onInstall listener', () => {
            expect(window.chrome.runtime.onInstalled.addListener.notCalled).to.be.true;
            new BackgroundEvents();
            expect(window.chrome.runtime.onInstalled.addListener.notCalled).to.not.be.true;
        });
        it('should open intro page on install', () => {
            expect(() => {
                BackgroundEvents.onInstalledEvent({ reason: "install" })
            }).to.not.throw();
        });
        it('should ignore updates', () => {
            expect(() => {
                BackgroundEvents.onInstalledEvent({ reason: "update" })
            }).to.not.throw();
        });
    });

    describe('Background Api', () => {
        before(() => {
            window.chrome = chrome;
            window.alert = () => { };
        });
        it('constructor should register chrome listeners', () => {
            expect(window.chrome.runtime.onMessage.addListener.notCalled).to.be.true;
            expect(window.chrome.browserAction.onClicked.addListener.notCalled).to.be.true;
            new BackgroundApi();
            expect(window.chrome.runtime.onMessage.addListener.notCalled).to.not.be.true;
            expect(window.chrome.browserAction.onClicked.addListener.notCalled).to.not.be.true;
        });
        it('openSetupPage launches only if generator does not exist', () => {
            backgroundApi.onStartGenerator(defaultConfig);
            expect(BackgroundApi.openSetupPage({ url: testPages.a })).to.be.false;
            backgroundApi.onCrawlComplete();
            expect(BackgroundApi.openSetupPage({ url: testPages.a })).to.not.be.false;
        });
        it('launchRequest executes without error', () => {
            expect(BackgroundApi.launchRequest({ start: defaultConfig }, defaultSender)).to.be.true;
        });
        it('generator does not try to start when config not provided', () => {
            expect(BackgroundApi.launchRequest({ incorrect: defaultConfig }, defaultSender)).to.be.false;
        });
        it('generator does not try to start when permission not granted', () => {
            expect(BackgroundApi.handleGrantResponse(false)).to.be.false;
        });
        it('generator does not try to start when already exists', () => {
            backgroundApi.onStartGenerator(defaultConfig);
            expect(backgroundApi.onStartGenerator(defaultConfig)).to.be.false;
        });
        it('generator does not try to start when does not exist, permission granted, and config provided', () => {
            backgroundApi.onCrawlComplete(); // kill any existing intanse
            expect(BackgroundApi.handleGrantResponse(true, defaultConfig)).to.not.be.false;
        });
    });

    describe('Generator', () => {
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
            generator.generatorApi({ crawlUrl: true }, defaultSender, (resp)=>{
                expect(resp).to.equal(defaultConfig.url);
                done();
            })
        });
        afterEach(() => {
            backgroundApi.onCrawlComplete();
            generator.onComplete();
        });
    });
});
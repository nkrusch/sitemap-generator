// import chrome from 'sinon-chrome';
// import chai from 'chai';
// import BackgroundApi from '../src/background/backgroundApi';
//
// require('jsdom-global')();
// const expect = chai.expect;
//
// let url = "https://www.test.com/",
//     requestDomain = url + "/*",
//     testPages = {
//         a: "https://www.test.com/index.html",
//         b: "https://www.test.com/about.html",
//         c: "https://www.test.com/home.html",
//         d: "https://www.nottest.com/index.html"
//     },
//     defaultConfig = {url: url, requestDomain: requestDomain},
//     defaultSender = {tab: {id: 1}};
//
// describe('Background Api', () => {
//     before(() => {
//         window.chrome = chrome;
//         window.alert = () => {
//         };
//     });
//     beforeEach(() => {
//         chrome.flush();
//     });
//     it('constructor should register onmessage listener', () => {
//         expect(window.chrome.runtime.onMessage.addListener.notCalled).to.be.true;
//         new BackgroundApi();
//         expect(window.chrome.runtime.onMessage.addListener.notCalled).to.not.be.true;
//     });
//     it('constructor should register browseraction listener', () => {
//         expect(window.chrome.browserAction.onClicked.addListener.notCalled).to.be.true;
//         new BackgroundApi();
//         expect(window.chrome.browserAction.onClicked.addListener.notCalled).to.not.be.true;
//     });
//     it('resolveSetupPageUrl should include active tab url if it starts with http', () => {
//         let result = BackgroundApi.resolveSetupPageUrl(testPages.a);
//         expect(result).to.contain(testPages.a);
//     });
//     it('resolveSetupPageUrl should not include active tab url if it does not start with http', () => {
//         let result = BackgroundApi.resolveSetupPageUrl("chrome://about");
//         expect(result).to.not.contain("chrome://about");
//     });
//     it('openSetupPage launches only if generator does not exist', () => {
//         BackgroundApi.onStartGenerator(defaultConfig);
//         expect(BackgroundApi.openSetupPage({url: testPages.a})).to.be.false;
//         BackgroundApi.onCrawlComplete();
//         expect(BackgroundApi.openSetupPage({url: ''})).to.not.be.false;
//     });
//     it('launchRequest starts generator without error', () => {
//         expect(BackgroundApi.launchRequest({start: defaultConfig}, defaultSender)).to.be.true;
//     });
//     it('launchRequest does not try to start when config not provided', () => {
//         expect(BackgroundApi.launchRequest({incorrect: defaultConfig}, defaultSender)).to.be.false;
//     });
//     it('handleGrantResponse does starts when permission granted', () => {
//         BackgroundApi.onCrawlComplete(); // kill any existing intanse
//         expect(BackgroundApi.handleGrantResponse(true, defaultConfig, defaultSender)).to.be.true;
//     });
//     it('handleGrantResponse does NOT start when permission not granted', () => {
//         expect(BackgroundApi.handleGrantResponse(false, defaultConfig)).to.be.false;
//     });
//     it('generator does not try to start when already exists', () => {
//         BackgroundApi.onStartGenerator(defaultConfig);
//         expect(BackgroundApi.onStartGenerator(defaultConfig)).to.be.false;
//     });
// });

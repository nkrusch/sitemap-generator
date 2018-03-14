import chrome from 'sinon-chrome';
import chai from 'chai';
import Generator from '../src/generator/generator';
import QueueManager from '../src/generator/queueManager';
import WebRequests from '../src/generator/webRequests';
import GeneratorUtils from '../src/generator/generatorUtils';

const expect = chai.expect;

let generator, queue, wr, wr_test,
    url = "https://www.test.com/",
    requestDomain = url + "/*",
    testPages = {
        a: "https://www.test.com/index.html",
        b: "https://www.test.com/about.html",
        c: "https://www.test.com/home.html",
        d: "https://www.nottest.com/index.html"
    },
    defaultConfig = {
        url: url,
        requestDomain: requestDomain
    },
    defaultSender = { tab: { id: 1 } };

describe('Generator Modules', () => {
    before(() => {
        window.chrome = chrome;
    });

    describe('Generator', () => {
        it('should start and stop without error', () => {
            window.chrome.windows.create.yields({});
            window.chrome.tabs.query.yields([]);
            defaultConfig.callback = () => { wr_test = 'hello'; }
            wr_test = '';

            generator = new Generator(defaultConfig);
            generator.start();
            generator.generatorApi({ terminate: true }, defaultSender);
            expect(wr_test).to.equal('hello');
        });
        describe('Generator api', () => {
            generator = new Generator(defaultConfig);
            it('noindex should not throw', () => {
                expect(() => generator
                    .generatorApi({ noindex: 'https://www.google.com' }))
                    .to.not.throw();
            });
            it('urls should not throw', () => {
                expect(() => generator.generatorApi({ urls: [] })).to.not.throw();
            });
            it('crawlUrl should return base url', (done) => {
                generator.generatorApi({ crawlUrl: true }, defaultSender, (resp) => {
                    expect(resp).to.equal(defaultConfig.url);
                    done();
                });
            });
            it('status should return object', (done) => {
                generator.generatorApi({ status: true }, defaultSender, (status) => {
                    expect(status).to.be.an('Object')
                        .and.to.have.all.keys('url', 'queue',
                            'completed', 'success', 'error');
                    done();
                });
            });
            it('fall through case should return false', () => {
                expect(generator.generatorApi({ badRequest: true })).to.be.false;
            });
        });
        describe('Next action', () => {
            it('navigateToNext should execute without error', () => {
                generator = new Generator(defaultConfig);
                window.chrome.tabs.query.yields(null);
                expect(() => {
                    generator.navigateToNext()
                }).to.not.throw();
                generator.onComplete();
                expect(() => {
                    generator.navigateToNext()
                }).to.not.throw();
            });
            it('base case should call result in termination', () => {
                // initial crawl complete
                generator = new Generator(defaultConfig);
                generator.urlMessageReceived(['x'], defaultSender);
                let openTabs = false, emptyQueue = true, test = null;
                let onComplete = () => {
                    test = 1;
                };
                Generator.nextAction(false, true, onComplete);
                expect(test).to.equal(1);
            });
            it('when more urls exist continue processing', () => {
                generator = new Generator(defaultConfig);
                expect(() => {
                    Generator.nextAction(true, false, () => {
                    });
                })
                    .to.not.throw();
            });
        });
        it('processDiscoveredUrls should add urls to list', () => {
            generator = new Generator(defaultConfig);
            generator.start();
            generator.processDiscoveredUrls([testPages.a, testPages.b]);
            let status = Generator.status()
            expect(status.queue).to.equal(2);
        });
    });

    describe('Utilities', () => {
        it('makeSitemap executes without error for empty list', () => {
            expect(() => {
                GeneratorUtils.makeSitemap(url, [])
            }).to.not.throw();
        });
        it('makeSitemap activates DL page if already exists', () => {
            window.chrome.tabs.query.yields([1]);
            window.chrome.tabs.reload.yields([]);
            let urls = [testPages.a, testPages.b, testPages.c];

            expect(window.chrome.tabs.update.notCalled).to.be.true;
            expect(() => {
                GeneratorUtils.makeSitemap(url, urls)
            }).to.not.throw();
            expect(window.chrome.tabs.update.notCalled).to.be.false;
        });
        it('makeSitemap create tab for DL page if it doesnt exist', () => {
            window.chrome.tabs.query.yields([]);
            expect(window.chrome.tabs.create.notCalled).to.be.true;
            let urls = [testPages.a, testPages.b, testPages.c];
            expect(() => {
                GeneratorUtils.makeSitemap(url, urls)
            }).to.not.throw();
            expect(window.chrome.tabs.create.notCalled).to.be.false;
        });
        it('closeTabs closes array of tabs', () => {
            expect(window.chrome.tabs.remove.notCalled).to.be.true;
            GeneratorUtils.closeTabs([]);
            expect(window.chrome.tabs.remove.notCalled).to.be.true;
            GeneratorUtils.closeTabs([{ id: 1 }, { id: 2 }]);
            expect(window.chrome.tabs.remove.notCalled).to.be.false;
            expect(window.chrome.tabs.remove.calledOnce).to.be.false;
        });
        it('getExistingTabs returns array of tabs', (done) => {
            window.chrome.tabs.query.yields([1, 2]);
            GeneratorUtils.getExistingTabs(null, null, (result) => {
                expect(result.length).to.equal(2);
                done();
            });
        });
        it('getExistingTabs returns array even if no matches', (done) => {
            window.chrome.tabs.query.yields(null);
            GeneratorUtils.getExistingTabs(null, null, (result) => {
                expect(result).to.be.an('array').with.length(0);
                done();
            });
        });
        it('loadContentScript calls error handler on failure', () => {
            window.chrome.tabs.executeScript.yields([1, 2]);
            window.chrome.runtime.lastError = { message: 'Error' };
            let errorCallback = () => { wr_test = 'load_error' };
            wr_test = '';

            expect(window.chrome.tabs.executeScript.notCalled).to.be.true;
            GeneratorUtils.loadContentScript(1, errorCallback);
            expect(window.chrome.tabs.executeScript.notCalled).to.be.false;
            expect(wr_test).to.equal('load_error');
        });
        it('launchTab calls error handler on failure', () => {
            window.chrome.tabs.create.yields([1, 2]);
            window.chrome.runtime.lastError = { message: 'Error' };
            let errorCallback = () => { wr_test = 'tab_error' };
            wr_test = '';

            expect(window.chrome.tabs.create.notCalled).to.be.true;
            GeneratorUtils.launchTab(1, testPages.a, errorCallback);
            expect(window.chrome.tabs.create.notCalled).to.be.false;
            expect(wr_test).to.equal('tab_error');
        });
        it('launchTab does not call error handler without failure', () => {
            window.chrome.tabs.create.yields([1, 2]);
            window.chrome.runtime.lastError = null;
            let errorCallback = () => { wr_test = 'tab_error' };
            wr_test = 'not_called';
            expect(window.chrome.tabs.create.notCalled).to.be.true;
            GeneratorUtils.launchTab(1, testPages.a, errorCallback);
            expect(window.chrome.tabs.create.notCalled).to.be.false;
            expect(wr_test).to.equal('not_called');
        });
        it('getHeaderValue return empty string if not found', () => {
            expect(GeneratorUtils.getHeaderValue([{ name: 'x' }], "whatever")).to.be.empty;
        });
        it('testFileExtension detects e.g. text vs. binary file types', () => {
            let excludeTypes = ['.zip']
            let matchTest = url + "file.zip";
            let noMatchtest = url + ".garbage/";
            expect(GeneratorUtils.testFileExtension(matchTest, excludeTypes)).to.be.true;
            expect(GeneratorUtils.testFileExtension(noMatchtest, excludeTypes)).to.be.false;
        });
        it('shebangHandler detects previously checked app path', () => {
            let lists = new QueueManager();
            let successTest = testPages.a + "#!" + "findMe";
            let errorTest = testPages.b + "#!" + "imbad";
            lists.success.add(testPages.a);
            lists.error.add(testPages.b);
            GeneratorUtils.urlFormatter(successTest, lists);
            GeneratorUtils.urlFormatter(errorTest, lists);
            expect(lists.success.contains(successTest)).to.be.true;
            expect(lists.error.contains(errorTest)).to.be.true;
        });
        it('urlFormatter removes hash if it is not shebang', () => {
            let lists = new QueueManager();
            let keepTest = testPages.a + "#!keepMe";
            let stripTest = testPages.a + "#stripMe";
            expect(GeneratorUtils.urlFormatter(keepTest, lists)).to.equal(keepTest);
            expect(GeneratorUtils.urlFormatter(stripTest, lists)).to.equal(testPages.a);
        });
    });

    describe('Queue Manager', () => {
        beforeEach(() => {
            queue = new QueueManager();
        });
        it('should report empty state correctly', () => {
            expect(queue.success.empty).to.be.true;
            queue.success.add(1);
            expect(queue.success.empty).to.not.be.true;
        });
        it('should return items in queue', () => {
            queue.success.add(1);
            queue.success.add(2);
            expect(queue.success.items).to.contain(1);
            expect(queue.success.items).to.contain(2);
        });
        it('add should add item if it does not exist', () => {
            queue.success.add(1);
            queue.success.add(1);
            expect(queue.success.length).to.equal(1);
        });
        it('remove should remove item if it exists', () => {
            queue.success.add(1);
            queue.success.add(2);
            queue.success.add(3);
            expect(queue.success.length).to.equal(3);
            queue.success.remove(2);
            expect(queue.success.length).to.equal(2);
            queue.success.remove('x');
            expect(queue.success.length).to.equal(2);
        });
    });

    describe('WebRequests', () => {
        before(() => {
            wr = new WebRequests("google", [200], ["text/html"], {
                onUrls: (x) => {
                    wr_test = x;
                },
                onError: () => {
                    wr_test = 'error'
                },
                onSuccess: () => {
                    wr_test = 'success'
                }
            });
        });
        it('onHeadersReceivedHandler cancels invalid requests', () => {
            let badRequest = WebRequests.onHeadersReceivedHandler({ responseHeaders: [] });
            let goodRequest = WebRequests.onHeadersReceivedHandler({ responseHeaders: [{ name: 'content-type', value: 'text/html' }] });
            expect(badRequest.cancel).to.be.true;
            expect(goodRequest.cancel).to.be.false;
        });
        it('onTabLoadListener handles error and success correctly', () => {
            WebRequests.onTabLoadListener({});
            expect(wr_test).to.equal('error');
            WebRequests.onTabLoadListener({ statusCode: 200 })
            expect(wr_test).to.equal('success');
        });
        it('onBeforeRedirect queues redirect url and cancels', () => {
            let result = WebRequests
                .onBeforeRedirect({ redirectUrl: testPages.a });
            expect(wr_test).to.contain(testPages.a);
            expect(result.cancel).to.be.true;
        });
        it('onTabErrorHandler closes tab', () => {
            expect(window.chrome.tabs.remove.notCalled).to.be.true;
            WebRequests.onTabErrorHandler({})
            expect(window.chrome.tabs.remove.calledOnce).to.be.true;
        });
        it('destroy executes without error', () => {
            expect(() => { wr.destroy() }).to.not.throw();
        });
    });

    afterEach(() => {
        window.chrome.flush();
    });
});

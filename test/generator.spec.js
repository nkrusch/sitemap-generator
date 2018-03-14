import chrome from 'sinon-chrome';
import chai from 'chai';
import Generator from '../src/generator/generator';
import QueueManager from '../src/generator/queueManager';
import WebRequests from '../src/generator/webRequests';
import genUtils from '../src/generator/generatorUtils';

const expect = chai.expect;

let generator, queue, wr,
    url = "https://www.test.com/",
    requestDomain = url + "/*",
    testPages = {
        a: "https://www.test.com/index.html",
        b: "https://www.test.com/about.html",
        c: "https://www.test.com/home.html",
        d: "https://www.nottest.com/index.html"
    },
    defaultConfig = {url: url, requestDomain: requestDomain},
    defaultSender = {tab: {id: 1}};

describe('Generator', () => {
    before(() => {
        window.chrome = chrome;
    });
    it('should start and stop without error', (done) => {
        generator = new Generator(defaultConfig);
        generator.start();
        generator.onComplete();
        done();
    });

    describe('Generator api', () => {
        generator = new Generator(defaultConfig);
        it('noindex should not throw', () => {
            expect(() => generator
                .generatorApi({noindex: 'https://www.google.com'}))
                .to.not.throw();
        });
        it('urls should not throw', () => {
            expect(() => generator.generatorApi({urls: []})).to.not.throw();
        });
        it('crawlUrl should return base url', (done) => {
            generator.generatorApi({crawlUrl: true}, defaultSender, (resp) => {
                expect(resp).to.equal(defaultConfig.url);
                done();
            });
        });
        it('status should return object', (done) => {
            generator.generatorApi({status: true}, defaultSender, (status) => {
                expect(status).to.be.an('Object')
                    .and.to.have.all.keys('url', 'queue',
                    'completed', 'success', 'error');
                done();
            });
        });
        it('fall through case should return false', () => {
            expect(generator.generatorApi({badRequest: true})).to.be.false;
        });
    });

    describe('Next action', () => {
        it('navigateToNext should execute without error', () => {
            generator = new Generator(defaultConfig);
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
                onUrls: () => {
                },
                onError: () => {
                }
            });
        });
        it('onHeadersReceivedHandler executes without error', () => {
            expect(() => WebRequests.onHeadersReceivedHandler({})).to.not.throw();
        });
        it('onTabLoadListener executes without error', () => {
            expect(() => WebRequests.onTabLoadListener({})).to.not.throw();
        });
        it('onBeforeRedirect executes without error', () => {
            expect(() => WebRequests.onBeforeRedirect({})).to.not.throw();
        });
        it('onTabErrorHandler executes without error', () => {
            expect(() => WebRequests.onTabErrorHandler({})).to.not.throw();
        });
        it('destroy executes without error', () => {
            expect(() => {
                wr.destroy()
            }).to.not.throw();
        });
    });

    afterEach(() => {
        window.chrome.flush();
    });
});

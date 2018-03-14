import chrome from 'sinon-chrome';
import chai from 'chai';
import Generator from '../src/generator/generator';
import QueueManager from '../src/generator/queueManager';

const expect = chai.expect;

let generator, queue, url = "https://www.test.com/",
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
    beforeEach(() => {
        window.chrome.flush();
        generator = new Generator(defaultConfig);
        generator.start();
    });
    it('should start and stop without error', () => {
        expect(() => {
            generator.start()
        }).to.not.throw();
        expect(() => {
            generator.onComplete()
        }).to.not.throw();
    });
    it('should report status without error', () => {
        expect(() => {
            Generator.status()
        }).to.not.throw();
    });
    it('should handle noindex without error', () => {
        expect(() => {
            Generator.excludeFromIndex(url)
        }).to.not.throw();
    });
    it('should receive urls without error', () => {
        expect(() => {
            generator.urlMessageReceived([testPages.a, testPages.d], defaultSender)
        }).to.not.throw();
    });
    it('api should return false if no method matches', () => {
        expect(generator.generatorApi({badRequest: true})).to.be.false;
    });
    it('api crawlurl should return base url', (done) => {
        generator.generatorApi({crawlUrl: true}, defaultSender, (resp) => {
            expect(resp).to.equal(defaultConfig.url);
            done();
        })
    });
    afterEach(() => {
        generator.onComplete();
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
        it('first should return and remove first item', () => {
            queue.success.add(1);
            queue.success.add(2);
            let item = queue.success.first;
            expect(item).to.equal(1);
            expect(queue.success.length).to.equal(1);
        });
        it('add should add item if it does not exist', () => {
            queue.success.add(1);
            expect(queue.success.length).to.equal(1);
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
});

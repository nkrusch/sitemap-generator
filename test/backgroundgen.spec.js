import Generator from '../src/background/generator/generator';
import Libs from './_mock';

describe('Background Generator', () => {

    /**
     * Sender represents a chrome tab sending messages to background
     * @returns {{tab: {id: number}}}
     */
    function sender() {
        return {tab: {id: 1}};
    }

    /**
     * Default configuration for generator while unit testing
     * @returns {{requestDomain: string, callback: callback, url: string}}
     */
    function config() {
        return {
            url: "https://www.google.com/",
            requestDomain: "https://www.google.com/*",
            callback: () => {
            }
        }
    }

    beforeEach(function () {
        window.chrome.windows.create.yields({});
        window.chrome.windows.remove.yields({});
        window.chrome.tabs.query.yields([]);
        window.chrome.system.display = Libs.systemDisplay;

        // override timeout behavior
        Libs.bindTimeoutBehavior();

        // simulate message passing
        window.request = (value, cb) => global.generator.generatorApi(value, sender(), cb);

        // for each test: generator is already running
        global.generator = new Generator(config());
        global.generator.start();
    });

    afterEach(function () {
        // terminate generator after each individual test
        global.generator.onComplete();
        delete window.request;
        delete global.generator;
    });

    it('API noindex handled without error', () => {
        expect(() => window.request({
            noindex: 'https://www.google.com'
        }, null)).to.not.throw();
    });

    it('API crawlUrl returns base url', done => {
        window.request({crawlUrl: true}, response => {
            expect(response).to.equal(config().url);
            done();
        });
    });

    it('API status returns session stats', done => {
        window.request({status: true}, response => {
            expect(response).to.be.an('Object').and.to.have.all.keys(
                'url', 'queue', 'completed', 'success', 'error');
            done();
        });
    });

    it('API urls handles submitted urls then terminates', () => {
        let urls = [
            "https://www.google.com/index.html",
            "https://www.google.com?about.html",
            "https://www.google.com/home/#hashed"
        ];

        var spy = sinon.spy(Generator, "nextAction");
        var sp2 = sinon.spy(global.generator, "onComplete");

        window.request({urls});

        // interval is disabled; perform interval action manually
        global.generator.navigateToNext();
        expect(spy.calledOnce, 'processes first url').to.be.true;

        // handle next url
        global.generator.navigateToNext();
        expect(spy.calledTwice, 'processes second url').to.be.true;

        // handle next url
        global.generator.navigateToNext();
        expect(spy.calledThrice, 'processes third url').to.be.true;

        // complete occurs at least once
        expect(sp2.notCalled, 'complete must occur').to.be.false;

    });
});

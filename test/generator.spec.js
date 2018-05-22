import Generator from '../src/background/generator/generator';
import { CenteredPopup } from 'pm-components';


describe('Generator', () => {

    before(() => {
        window.URL.createObjectURL = () => { };
        global.config = {
            url: "https://www.google.com/",
            requestDomain: "https://www.google.com/*",
            callback: () => { }
        };
        global.sender = { tab: { id: 1 } };
        global.generator = null;
        global.request = (value, cb) => {
            return global.generator.generatorApi(value, sender, cb);
        }
    });

    beforeEach(function () {
        sandbox.stub(CenteredPopup, 'open');
        CenteredPopup.open.resolves(1);
        window.chrome.windows.create.yields({});
        window.chrome.tabs.query.yields([]);
        window.chrome.windows.remove.yields({});
        generator = new Generator(config);
        generator.start();
    });

    afterEach(function () {
        generator.generatorApi({ terminate: true }, sender);
        chrome.flush();
        sandbox.restore();
    });

    after(function () {
        delete global.config;
        delete global.sender;
        delete global.request;
        delete global.generator;
    })

    it('API noindex handled without error', () => {
        expect(() => request({ noindex: 'https://www.google.com' })).to.not.throw();
    });

    it('API crawlUrl returns base url', (done) => {
        request({ crawlUrl: true }, (response) => {
            expect(response).to.equal(config.url);
            done();
        });
    });

    it('API status returns session stats', (done) => {
        request({ status: true }, (response) => {
            expect(response).to.be.an('Object')
                .and.to.have.all.keys('url', 'queue',
                    'completed', 'success', 'error');
            done();
        });
    });

    it('API urls handled without error', () => {
        let u = {
            a: "https://www.google.com/index.html",
            b: "https://www.google.com?about.html",
            c: "https://www.google.com/home/#hashed",
            d: "https://www.nottest.com/index.html"
        }
        expect(() => request({ urls: [u.a, u.b] })).to.not.throw();
        expect(() => generator.navigateToNext()).to.not.throw();
        window.chrome.tabs.query.yields([{ id: 2 }]);
        expect(() => request({ urls: [u.a, u.c, u.d] })).to.not.throw();
        expect(() => generator.navigateToNext()).to.not.throw();
        generator.onComplete();
        window.chrome.tabs.query.yields(null);
        generator.onComplete();

    });

});
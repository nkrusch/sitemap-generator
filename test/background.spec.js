import BackgroundApi from '../src/background/backgroundApi';
import { Generator } from '../src/background/generator/generator';
import { CenteredPopup } from 'pm-components';

let launchSpy;
let launchRequest;
let alertValue;
let alertCalled;


describe('Background Api', () => {

    before(() => {
        launchRequest = (sender) => {
            window.chrome.runtime.onMessage.dispatch(
                { start: { requestDomain: 'http://www.google.com' } }, sender);
        };
        alertCalled = 'called';
        window.alert = () => { alertValue = alertCalled }
    });
    beforeEach(() => {
        new BackgroundApi();
        alertValue = null;
        launchSpy = sinon.spy(BackgroundApi, "onStartGenerator");
    })
    afterEach(() => {
        if (launchSpy) launchSpy.restore();
        BackgroundApi.onCrawlComplete();
    })

    it('clicking browser action opens setup page', () => {
        sinon.stub(CenteredPopup, 'open');
        CenteredPopup.open.resolves(1);
        expect(CenteredPopup.open.notCalled, 'window not opened').to.be.true;
        window.chrome.browserAction.onClicked.dispatch({ url: "https://www.google.com" });
        expect(CenteredPopup.open.calledOnce, 'window opened').to.be.true;
        window.chrome.browserAction.onClicked.dispatch(null)
        expect(CenteredPopup.open.calledTwice, '2nd window opened').to.be.true;
    });

    it('launch request starts generator', () => {
        window.chrome.permissions.request.yields(true);
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        window.chrome.runtime.onMessage.dispatch({ wrongLaunchRequest: true });
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch only on start request').to.be.true;
        launchRequest({ tab: { id: 1 } });
        expect(window.chrome.permissions.request.calledOnce, 'permissions').to.be.true;
        expect(BackgroundApi.onStartGenerator.calledOnce, 'launch method').to.be.true;
    });

    it('launch does not occur when permission not granted', () => {
        window.chrome.permissions.request.yields(false);
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        launchRequest();
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        expect(alertValue, 'window alert shows').to.equal(alertCalled);
    });

    it('only 1 generator can run at a time', () => {
        window.chrome.permissions.request.yields(true);
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        launchRequest();
        expect(BackgroundApi.onStartGenerator.calledOnce, 'launch occurred').to.be.true;
        launchRequest();
        expect(BackgroundApi.onStartGenerator.calledOnce, '2nd launch does not occur').to.be.true;
        expect(alertValue, 'window alert shows').to.equal(alertCalled);
    });

});
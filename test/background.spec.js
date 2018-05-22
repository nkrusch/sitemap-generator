import BackgroundApi from '../src/background/backgroundApi';
import { Generator } from '../src/background/generator/generator';
import { CenteredPopup } from 'pm-components';

describe('Background Api', function () {

    before(function () {
        window.alert = function () { alertValue = alertCalled }
        global.alertCalled = 'window alert called';
        global.alertValue = null;
        global.launchRequest = (sender) => {
            chrome.runtime.onMessage.dispatch(
                { start: { requestDomain: 'http://www.google.com' } }, sender
            );
        };
    });

    beforeEach(function () {
        new BackgroundApi(); 
        chrome.permissions.request.yields(true);
        sandbox.spy(BackgroundApi, "onStartGenerator");
        sandbox.stub(CenteredPopup, 'open');
        CenteredPopup.open.resolves(1);
        alertValue = null;
    });

    afterEach(function () {
        BackgroundApi.onCrawlComplete();
        chrome.flush();
        sandbox.restore();
    });

    after(function () {
        delete global.alertCalled;
        delete global.launchRequest;
        delete global.alertValue;
    });

    it('clicking browser action opens setup page', function () {
        expect(CenteredPopup.open.notCalled, 'window not opened').to.be.true;
        chrome.browserAction.onClicked.dispatch({ url: "https://www.google.com" });
        expect(CenteredPopup.open.calledOnce, 'window opened').to.be.true;
        chrome.browserAction.onClicked.dispatch(null)
        expect(CenteredPopup.open.calledTwice, '2nd window opened').to.be.true;
    });

    it('launch request starts generator', function () {
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        chrome.runtime.onMessage.dispatch({ wrongLaunchRequest: true });
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch only on start request').to.be.true;
        launchRequest({ tab: { id: 1 } });
        expect(chrome.permissions.request.calledOnce, 'permissions requested').to.be.true;
        expect(BackgroundApi.onStartGenerator.calledOnce, 'method launched').to.be.true;
    });

    it('launch does not occur when permission not granted', function () {
        chrome.permissions.request.yields(false);
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        launchRequest();
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        expect(alertValue, 'window alert shows').to.equal(alertCalled);
    });

    it('only 1 generator can run at a time', function () {
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        launchRequest();
        expect(BackgroundApi.onStartGenerator.calledOnce, 'launch occurred').to.be.true;
        launchRequest();
        expect(BackgroundApi.onStartGenerator.calledOnce, '2nd launch does not occur').to.be.true;
        expect(alertValue, 'window alert shows').to.equal(alertCalled);
    });
    
});
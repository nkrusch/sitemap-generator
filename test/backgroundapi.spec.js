import BackgroundApi from '../src/background/backgroundApi';
import {Generator} from '../src/background/generator/generator';
import CenteredPopup from '../src/components/centeredPopup';
import Libs from "./_mock";

describe('Background Api', function () {

    function getCalled(){
        return 'window alert called';
    }

    function onAlert(){
        window.alertValue = getCalled()
    }

    function launchRequest(sender){
        window.chrome.runtime.onMessage.dispatch({
            start: {requestDomain: 'https://www.google.com'}
        }, sender);
    }

    beforeEach(function () {

        new BackgroundApi();

        chrome.permissions.request.yields(true);
        sandbox.spy(BackgroundApi, "onStartGenerator");
        sandbox.stub(CenteredPopup, 'open');
        CenteredPopup.open.resolves(1);

        // reset alert value
        window.alertValue = null;

        // override timeout behavior
        Libs.bindTimeoutBehavior();

        window.alert = onAlert;

    });

    afterEach(function () {
        BackgroundApi.onCrawlComplete();
    });


    it('clicking browser action opens setup page', function () {

        expect(CenteredPopup.open.notCalled, 'window not opened').to.be.true;
        chrome.browserAction.onClicked.dispatch({url: "https://www.google.com"});

        expect(CenteredPopup.open.calledOnce, 'window opened').to.be.true;
        chrome.browserAction.onClicked.dispatch(null)

        expect(CenteredPopup.open.calledTwice, '2nd window opened').to.be.true;
    });

    it('launch request starts generator', function () {

        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        chrome.runtime.onMessage.dispatch({wrongLaunchRequest: true});

        expect(BackgroundApi.onStartGenerator.notCalled, 'launch only on start request').to.be.true;
        launchRequest({tab: {id: 1}});

        expect(chrome.permissions.request.calledOnce, 'permissions requested').to.be.true;
        expect(BackgroundApi.onStartGenerator.calledOnce, 'method launched').to.be.true;
    });

    it('launch does not occur when permission not granted', function () {

        chrome.permissions.request.yields(false);
        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;

        launchRequest();

        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        expect(window.alertValue, 'window alert shows').to.equal(getCalled());
    });

    it('only 1 generator allowed to run concurrently', function () {
        chrome.permissions.request.yields(true);

        expect(BackgroundApi.onStartGenerator.notCalled, 'launch method not called').to.be.true;
        launchRequest();

        expect(BackgroundApi.onStartGenerator.calledOnce, 'launch occurred').to.be.true;
        launchRequest();

        expect(BackgroundApi.onStartGenerator.calledOnce, '2nd launch does not occur').to.be.true;
        expect(window.alertValue, 'window alert shows').to.equal(getCalled());
    });

});

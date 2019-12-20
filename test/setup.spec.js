import Setup from '../src/setup/setup';

describe('Setup Page', function () {

    before(function () {
        window.pageHTML = require('fs')
            .readFileSync('./src/setup/setup.html',
                'utf8');
    });

    beforeEach(function () {
        document.documentElement.innerHTML = window.pageHTML;
        window.urlInput = document.getElementsByName('url')[0];
        window.startButton = document.getElementById('start');
        window.startClick = () => dispatchEvent(window.startButton, mouseEvent('click'));
        new Setup();
    });

    after(function () {
        delete window.pageHTML;
        delete window.startButton;
        delete window.startClick;
        delete window.urlInput;
    });

    it('getParameterByName parses querystring params correctly', () => {
        let testUrl = 'https://www.google.com';

        expect(Setup.getParameterByName('id', 't.com?id=' + testUrl),
            'key has value').to.equal(testUrl);

        expect(Setup.getParameterByName('id', 't.com?id='),
            'key matches empty value').to.be.empty;

        expect(Setup.getParameterByName('u', 't.com?id='),
            'key does not exist').to.be.empty;
    });

    it('Start page sends launch request on valid url input', () => {

        expect(chrome.runtime.sendMessage.notCalled, 'request sent').to.be.true;
        window.urlInput.value = '';
        window.startClick();

        expect(chrome.runtime.sendMessage.notCalled, 'not sent on empty url').to.be.true;
        window.urlInput.value = 'google.com';
        window.startClick();

        expect(chrome.runtime.sendMessage.notCalled, 'not sent on incomplete url').to.be.true;
        window.urlInput.value = 'https://www.google.com/';
        window.startClick();

        expect(chrome.runtime.sendMessage.calledOnce, 'request sent').to.be.true;
    });

    it('Multiple concurrent start clicks is disabled', () => {
        window.urlInput.value = 'https://www.google.com/with/some/path#nonsense';

        // first click -- should be ok
        expect(chrome.runtime.sendMessage.notCalled, 'no clicked').to.be.true;
        window.startClick();

        // second click -- should fail
        expect(chrome.runtime.sendMessage.calledOnce, 'clicked once').to.be.true;
        window.startClick();

        expect(chrome.runtime.sendMessage.calledOnce, 'occurred only once').to.be.true;
    });
});

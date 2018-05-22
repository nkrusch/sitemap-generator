import Setup from '../src/setup/setup';
const fs = require('fs');

describe('Setup Page', function () {

    before(function () {
        global.pageHTML = fs.readFileSync('./src/setup/setup.html', 'utf8');
    });

    beforeEach(function () {
        document.documentElement.innerHTML = global.pageHTML;
        global.urlInput = document.getElementsByName('url')[0];
        global.startButton = document.getElementById('start');
        global.startClick = () => {
            dispatchEvent(global.startButton, mouseEvent("click"));
        }
        new Setup();
    });

    afterEach(function () {
        chrome.flush();
        sandbox.restore();
    })

    after(function () {
        delete global.pageHTML;
        delete global.startButton;
        delete global.startClick;
        delete global.urlInput;
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

    it('Start page send launch request', () => {
        expect(chrome.runtime.sendMessage.notCalled, 'request sent').to.be.true;
        urlInput.value = '';
        startClick();
        expect(chrome.runtime.sendMessage.notCalled, 'not sent on empty url').to.be.true;
        urlInput.value = 'google.com';
        startClick();
        expect(chrome.runtime.sendMessage.notCalled, 'not sent on incomplete url').to.be.true;
        urlInput.value = 'https://www.google.com/';
        startClick();
        expect(chrome.runtime.sendMessage.calledOnce, 'request sent').to.be.true;
    });

    it('Prevent multiple start clicks', () => {
        expect(chrome.runtime.sendMessage.notCalled, 'no clicked').to.be.true;
        urlInput.value = 'https://www.google.com/with/some/path#nonsense';
        startClick();
        expect(chrome.runtime.sendMessage.calledOnce, 'clicked once').to.be.true;
        startClick();
        expect(chrome.runtime.sendMessage.calledOnce, 'clicked only once').to.be.true;
    });
});

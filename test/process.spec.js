import Process from '../src/process/process';
const fs = require('fs');

describe('Process Page', () => {

    before(function () {
        global.pageHTML = fs.readFileSync(
            './src/process/process.html', 'utf8');
        window.ga = () => { };
    });

    beforeEach(function () {
        document.documentElement.innerHTML = global.pageHTML;
        global.stopButton = document.getElementById('close');
        global.stopButtonClick = () => {
            dispatchEvent(global.stopButton, mouseEvent("click"));
        }
        new Process();
    });

    afterEach(function () {
        chrome.flush();
        sandbox.restore();
    })

    after(function () {
        delete global.pageHTML;
        delete window.ga;
        delete global.stopButtonClick;
        delete global.stopButton;
    })

    it('Stop button terminates processing', () => {
        expect(chrome.runtime.sendMessage.notCalled, 'before click').to.be.true;
        stopButtonClick();
        expect(chrome.runtime.sendMessage.calledOnce, 'button clicked').to.be.true;
    });

    it('Renders status on page', () => {
        let numQueue = 2, numCompleted = 3;
        window.chrome.runtime.sendMessage.yields({ queue: numQueue, completed: numCompleted, someNonsense: 34 });
        Process.checkStatus();
        expect(document.getElementById('queue').innerText, 'queue display').to.equal(numQueue);
        expect(document.getElementById('completed').innerText, 'queue display').to.equal(numCompleted);
    });    
});

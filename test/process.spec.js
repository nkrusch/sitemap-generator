import Process from '../src/process/process';
import Libs from './_mock';

const fs = require('fs');

describe('Process Page', () => {

    before(function () {
        window.ga = Libs.Analytics;

        // read the page HTML
        window.pageHTML = fs.readFileSync('./src/process/process.html', 'utf8');
    });

    beforeEach(function () {

        // reset page HTML
        document.documentElement.innerHTML = window.pageHTML;

        // override timeout behavior
        Libs.bindTimeoutBehavior();

        // add page script
        new Process();
    });

    after(function () {
        delete window.pageHTML;
        delete window.ga;
    });

    it('Clicking stop button terminates processing', () => {

        Process.stopButton.click();

        expect(chrome.runtime.sendMessage.withArgs({terminate: true})
            .called, 'button clicked').to.be.true;
    });

    it('Renders status on page during processing', () => {
        let queue = 2, completed = 3;

        window.chrome.runtime.sendMessage.yields({queue, completed, someNonsense: 34});

        Process.checkStatus();

        expect(document.getElementById('queue').innerText,
            'queue display').to.equal(queue);

        expect(document.getElementById('completed').innerText,
            'queue display').to.equal(completed);
    });
});

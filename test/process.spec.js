import chrome from 'sinon-chrome';
import chai from 'chai';
import 'jsdom-global';

const expect = chai.expect;

let Process;

describe('Process Page', () => {
    before(() => {
        window.chrome = chrome;
        document.documentElement.innerHTML = require('fs')
            .readFileSync('./src/process/process.html', 'utf8');
        global.setTimeout = () => {
        };
        global.setInterval = () => {
        };
        window.ga = () => {
        };
        Process = require('../src/process/process.js');
    });
    beforeEach(function () {
        chrome.flush();
    });
    it('close button sends message to terminate processing', () => {
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
        document.getElementById('close').click();
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.false;
    });
    it('status request dispatches request for status', () => {
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
        Process.checkStatus();
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.false;
    });
    it('status response updates ui', () => {
        document.documentElement.innerHTML = "<div id='me'></div>";
        let value = 10, uifield = document.getElementById('me');

        Process.handleStatusResponse({me: value, too: value + 1});
        expect(uifield.innerText.toString()).to.have.string(value.toString())
    });
});
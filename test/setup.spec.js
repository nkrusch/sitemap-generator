import chrome from 'sinon-chrome';
import chai from 'chai';
import 'jsdom-global';

const expect = chai.expect;

let Setup;

describe('Setup Page', () => {
    before(() => {
        window.chrome = chrome;
        document.documentElement.innerHTML = require('fs')
            .readFileSync('./src/setup/setup.html', 'utf8');
        Setup = require('../src/setup/setup.js');
        chrome.flush();
    });
    beforeEach(function () {
        chrome.flush();
    });
    it('initializes without error', () => {
        expect(() => { new Setup() }).to.not.throw();
    });
    it('getParameterByName returns value if it exists', () => {
        expect(Setup.getParameterByName('id', 't.com?id=5')).to.equal('5');
    });
    it('getParameterByName returns empty if querystring param has no value', () => {
        expect(Setup.getParameterByName('id', 't.com?id=')).to.be.empty;
    });
    it('getParameterByName returns empty if querystring param has no value', () => {
        expect(Setup.getParameterByName('id', 't.com?id=')).to.be.empty;
    });
    it('removePageFromUrl removes query string', () => {
        let initial = "https://www.google.com/app/?what";
        let expected = "https://www.google.com/app";
        expect(Setup.removePageFromUrl(initial)).to.equal(expected);
    });
    it('click handler does not send message if url is empty', () => {
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
        document.getElementsByName('url')[0].value = '';
        document.getElementById('start').click();
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
    });
    it('click handler does not send message if url does not start with http', () => {
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
        document.getElementsByName('url')[0].value = 'google.com';
        document.getElementById('start').click();
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
    });
    it('click handler sends message if valid url is set', () => {
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
        document.getElementsByName('url')[0].value = 'https://t.co';
        document.getElementById('start').click();
        expect(window.chrome.runtime.sendMessage.notCalled).to.be.false;
    });
});
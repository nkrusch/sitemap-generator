// import chrome from 'sinon-chrome';
// import chai from 'chai';
// import 'jsdom-global';
//
// const expect = chai.expect;
//
// let Setup;
//
// describe('Setup Page', () => {
//     before(() => {
//         window.chrome = chrome;
//         document.documentElement.innerHTML = require('fs')
//             .readFileSync('./src/setup/setup.html', 'utf8');
//         Setup = require('../src/setup/setup.js');
//         chrome.flush();
//     });
//     beforeEach(function () {
//         chrome.flush();
//     });
//     it('click handler sends message if valid url is set', () => {
//         expect(window.chrome.runtime.sendMessage.notCalled).to.be.true;
//         document.getElementsByName('url')[0].value = 'https://t.co';
//         document.getElementById('start').click();
//         expect(window.chrome.runtime.sendMessage.notCalled).to.be.false;
//     });
// });

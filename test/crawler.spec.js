import Crawler from '../src/crawler/crawler';
const fs = require('fs');

let pageHTML;

describe('Page Crawler', () => {

    before(() => {
        pageHTML = "<html><head></head><body><a href='home.html'>Home</a></body>";
        window.setTimeout = () => {
        };
        window.setInterval = () => {
        };
    });

    beforeEach(function () {
        document.documentElement.innerHTML = pageHTML;
    });

    it('Page crawler initializes without error', () => {
        expect(() => new Crawler()).to.not.throw();
    });
});

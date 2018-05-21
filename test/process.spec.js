import Process from '../src/process/process';
const fs = require('fs');

let pageHTML;

describe('Process Page', () => {

    before(() => {
        pageHTML = fs.readFileSync('./src/process/process.html', 'utf8');
        window.ga = () => { };
    });

    beforeEach(function () {
        document.documentElement.innerHTML = pageHTML;
    });
    
    it('Process page initializes without error', () => {
        expect(() => new Process()).to.not.throw();
    });
});

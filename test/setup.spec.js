import Setup from '../src/setup/setup';
const fs = require('fs');

let pageHTML;

describe('Setup Page', () => {

    before(() => {
        pageHTML = fs.readFileSync('./src/setup/setup.html', 'utf8');
    });

    beforeEach(function () {
        document.documentElement.innerHTML = pageHTML;
    });

    it('Setup page initializes without error', () => {
        expect(() => new Setup()).to.not.throw();
    });
    
});

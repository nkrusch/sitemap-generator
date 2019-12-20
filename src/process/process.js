/**
 * @class
 * @description This module is used to communicate with the generator while crawling is ongoing.
 */
export default class Process {

    constructor() {

        // initially check status every 1 second
        for (let i = 0; i < 10; i++) {
            window.setTimeout(Process.checkStatus, i * 1000);
        }

        // after first 10x increase the interval
        let inv = window.setInterval(Process.checkStatus, 10000);

        // bind event handlers
        Process.stopButton.onclick = e => {
            window.chrome.runtime.sendMessage({terminate: true});
            e.target.innerText = 'Terminating....';
            window.clearInterval(inv);
        };

        window.ga('send', 'event', 'sitemap-generator', 'runner', null, 1);
    }

    static get stopButton() {
        return document.getElementById('close');
    }

    /**
     * @description Request information about current
     * processing status from the background
     */
    static checkStatus() {
        window.chrome.runtime.sendMessage({status: true},
            Process.handleStatusResponse);
    }

    /**
     * @description When status response from generator is received,
     * update the UI to display the information
     */
    static handleStatusResponse(response) {
        for (let k in response) {
            let elem = document.getElementById(k);

            if (elem) elem.innerText = response[k];
        }
    }
}

/**
 * @class
 * @description This module is used to communicate with the generator while crawling is ongoing.
 */
class Process {

    constructor() {

        // bind event handlers
        document.getElementById('close').onclick = (e) => {
            window.chrome.runtime.sendMessage({ terminate: true });
            e.target.innerText = 'Terminating....';
        };

        // initially check status every 1 second
        for (let i = 0; i < 10; i++) {
            setTimeout(Process.checkStatus, i * 1000);
        }

        // after first 10x increase the interval
        setInterval(Process.checkStatus, 10000);
    }

    /**
     * @description Request information about current processing status from the background
     */
    static checkStatus() {
        window.chrome.runtime.sendMessage({ status: true }, Process.handleStatusResponse);
    }

    /**
     * @ignore
     * @description When status response is received, update the UI to reflect the information
     */
    static handleStatusResponse(response) {
        for (let k in response) {
            let elem = document.getElementById(k);

            if (elem) elem.innerText = response[k];
        }
    }
}

(() => new Process())();

export default Process;

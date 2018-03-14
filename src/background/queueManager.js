class SimpleQueue {

    constructor() {
        this.queue = [];
    }

    get length() {
        return this.queue.length;
    }

    get empty() {
        return this.queue.length === 0;
    }

    get items() {
        return this.queue.slice();
    }

    get first() {
        return this.queue.shift();
    }

    contains(url) {
        return this.queue.indexOf(url) >= 0;
    }

    add(url) {
        if (this.queue.indexOf(url) < 0) {
            this.queue.push(url);
        }
    };

    remove(url) {
        let index = this.queue.indexOf(url);

        if (index >= 0) {
            this.queue.splice(index, 1);
        }
    }
}

class QueueManager {

    constructor() {
        this.processQueue = new SimpleQueue();
        this.completedUrls = new SimpleQueue();
        this.errorHeaders = new SimpleQueue();
        this.successUrls = new SimpleQueue();
    }

    get success() {
        return this.successUrls;
    }

    get pending() {
        return this.processQueue;
    }

    get error() {
        return this.errorHeaders;
    }

    get complete() {
        return this.completedUrls;
    }
}

export default QueueManager;

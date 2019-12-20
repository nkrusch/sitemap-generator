export default class Libs {

    static get systemDisplay() {
        return {
            getInfo: (cb) => {
                cb({workarea: {width: 100, height: 100}});
            }
        };
    }

    static get Analytics() {
        return () => {
        }
    }

    static bindTimeoutBehavior() {
        window.intervalAction = null;

        window.setTimeout = function (action) {
            return action();
        };
        window.clearInterval = () => {
            window.intervalAction = null;
        };
        window.setInterval = function (action) {
            window.intervalAction = action;
            return window.intervalAction ? window.intervalAction() : null;
        };
    }
}

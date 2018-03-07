/**
 * @namespace
 */
export default class centeredPopup {

    /**
     * @namespace
     * @description Create centered popup window in the middle of user's monitor viewport.
     * If user has multiple monitors this method launches window in the first/leftmost monitor.
     * This method requires `system.display` permission in `manifest.json`
     * @param {number} width - width of the new window (px)
     * @param {number} height - height of the new window (px)
     * @param {String} url - url to open
     * @param {String} type - "popup" or "normal"
     * @param {boolean} focused - if window should be focused
     * @returns {Promise}
     */
    static open(width, height, url, type, focused) {

        return new Promise(function (resolve) {

            /**
             * @ignore
             * computes 1D center given preferred size and max width
             */
            function center(max, size) {
                return parseInt(Math.max(0, Math.round(0.5 * (max - size))), 0);
            }

            /**
             * @ignore
             * requests the users desktop monitor size
             * */
            function getBounds() {
                return new Promise(function (resolve) {
                    window.chrome.system.display.getInfo(function (info) {
                        resolve(info[0].workArea);
                    });
                });
            }

            /**
             * @ignore
             * @param area open the window
             */
            function openWindow(area) {
                window.chrome.windows.create({
                    url: url, width: width, height: height, type: type || 'popup',
                    focused: focused !== undefined ? focused : true,
                    left: center(area.width, width),
                    top: center(area.height, height)
                }, resolve);
            }

            getBounds().then(openWindow).catch(function () {
                openWindow({ width: 0, height: 0 });
            });
        });
    }
}

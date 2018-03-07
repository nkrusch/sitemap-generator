/**
* @class
*/
class CenteredPopup {

    /**
     * @description Create centered popup window in the middle of user's monitor viewport.
     * If user has multiple monitors this method launches window in the first/leftmost monitor.
     * This method requires `system.display` permission in `manifest.json`
     * @param {number} width - width of the new window (px)
     * @param {number} height - height of the new window (px)
     * @param {String} url - url to open
     * @returns {Promise}
     */
    static open(width, height, url) {

        return new Promise(function (resolve) {

            /**
             * @private
             */
            function center(max, size) {
                return parseInt(Math.max(0, Math.round(0.5 * (max - size))), 0);
            }

            /**
             * @private
             * */
            function getBounds() {
                return new Promise(function (resolve) {
                    window.chrome.system.display.getInfo(function (info) {
                        resolve(info[0].workArea);
                    });
                });
            }

            /**
             * @private
             */
            function openWindow(area) {
                window.chrome.windows.create({
                    url: url, width: width, height: height,
                    focused: true, type: 'popup',
                    left: center(area.width, width),
                    top: center(area.height, height)
                }, resolve);
            }

            getBounds().then(openWindow).catch(function () {
                    openWindow({width: 0, height: 0});
                });
        });
    }
}

export default CenteredPopup;

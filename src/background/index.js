import BackgroundApi from './backgroundApi';
import OnInstallHandler from '../components/onInstallHandler';

(() => new OnInstallHandler({
    action: OnInstallHandler.options.openUri,
    uri: window.chrome.runtime.getURL('intro.html')
}))();

(() => new BackgroundApi())();

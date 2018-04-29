import BackgroundApi from './backgroundApi';
import {OnInstallHandler} from 'pm-boot-extension';

(() => new OnInstallHandler({
    action: OnInstallHandler.options.openUri,
    uri: window.chrome.runtime.getURL('intro.html')
}))();

(() => new BackgroundApi())();

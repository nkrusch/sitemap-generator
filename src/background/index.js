import BackgroundApi from './backgroundApi';
import {OnInstallHandler} from 'pm-components';

(() => new OnInstallHandler({
    action: OnInstallHandler.options.openUri,
    uri: window.chrome.runtime.getURL('intro.html')
}))();

(() => new BackgroundApi())();

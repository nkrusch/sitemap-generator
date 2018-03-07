import BackgroundApi from './backgroundApi.js';
import BackgroundEvents from './events.js';
import Generator from './generator.js';

(() => new BackgroundApi())();
(() => new BackgroundEvents())();

export { BackgroundApi, BackgroundEvents, Generator };

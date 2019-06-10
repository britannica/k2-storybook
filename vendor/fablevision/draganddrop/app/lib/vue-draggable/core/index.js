import { attachListeners } from './listeners/index.js';
import { setInitialAtributes } from './helpers/index.js';
import { getOptions } from './options.js';
import { getState } from './state.js';

export class VueDraggable {
  constructor(el, componentInstance, options) {
    Object.assign(
      this,
      getState(),
      {
        defaultOptions: getOptions(componentInstance, options)
      },
      { el }
    );

    this.registerListeners(el);
    this.initiate(el);
  }

  registerListeners(el) {
    attachListeners.bind(this)(el);
  }

  initiate(el) {
    setInitialAtributes.bind(this)(el);
  }
};

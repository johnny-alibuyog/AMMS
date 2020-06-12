import { Container } from 'aurelia-framework';
// import 'assets/css/tailwind.css';

/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'izitoast/dist/css/iziToast.css';
import environment from './environment';
import * as Bluebird from 'bluebird';
import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { DialogConfiguration } from 'aurelia-dialog';
import { initialState } from './kernel/state/models';
import { auth } from 'features/membership/auth';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia): Aurelia {
  aurelia.use
    .developmentLogging()
    .standardConfiguration()
    .feature(PLATFORM.moduleName('common/index'))
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-animator-css'))
    .plugin(PLATFORM.moduleName('aurelia-store'), {
      initialState,
      propagateError: true,
      measurePerformance: 'all'
    })
    .plugin(PLATFORM.moduleName('aurelia-dialog'), (config: DialogConfiguration) => {
      config.useDefaults();
      // config.useCSS('');
      // config.settings.lock = true;
      // config.settings.centerVerticalOnly = true;
      // config.settings.startingZIndex = 5;
      // config.settings.keyboard = true; //['Enter', 'Escape'];
    });

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start()
    .then(() => auth.getState())
    .then((auth) => {
      const root = (auth?.signedIn)
        ? PLATFORM.moduleName('app')
        : PLATFORM.moduleName('features/membership/auth/signin');
      return aurelia.setRoot(root);
    });

    return aurelia;
}

// type Root = 'signin' | 'dashboard';
// const rootModules: Map<Root, string> = new Map([
//   ['dashboard', PLATFORM.moduleName('app')],
//   ['signin'   , PLATFORM.moduleName('membership/users/signin')]
// ]);

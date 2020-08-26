// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyA1x3tVoEUH04TTh8ETlTTpycvVEVUikas',
    authDomain: 'cmrm-1.firebaseapp.com',
    databaseURL: 'https://cmrm-1.firebaseio.com',
    projectId: 'cmrm-1',
    storageBucket: 'cmrm-1.appspot.com',
    messagingSenderId: '834220791023',
    appId: '1:834220791023:web:b7bf0087d37b9a60e6771a',
    measurementId: 'G-TMLNR884V3'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

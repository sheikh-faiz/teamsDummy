// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASE_URL: 'https://cloudlabs-practice-test-api-qa.azurewebsites.net/',
  UserGUID: 'ae1cb727-4bbe-4ee8-be33-1901642df461',
  clientId: 'e10ffc23-2045-42a7-b9ee-d48b6e2b8ee2',
  // authority: 'https://login.microsoftonline.com/common',
  authority: 'https://login.microsoftonline.com/common',
  redirectUri: 'http://localhost:4200/',
  productId: ['QuickTest', 'Test123', 'AZ900', 'CaseStudyDemoTest', 'PerformanceQuizwithVM'],
  activationCode: 'BUILD2021'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

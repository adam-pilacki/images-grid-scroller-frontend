/** @ngInject */
const appConfig = (
  $httpProvider,
  $urlRouterProvider,
  $stateProvider,
  $locationProvider
) => {
  // For any unmatched url
  $urlRouterProvider.otherwise('/');

  // HTML5 mode on
  $locationProvider.html5Mode({ enabled: true, requireBase: true });

  // Now set up the app abstract state
  $stateProvider.state('app', {
    abstract: true,
    component: 'app',
    params: {
      headerVisible: true,
    },
  });
};

export default appConfig;

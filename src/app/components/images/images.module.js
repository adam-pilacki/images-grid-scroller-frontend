import Images from './images.component';

/** @ngInject */
function routesConfig($stateProvider) {
  $stateProvider.state('app.imagesComponent', {
    template: '<images-component/>',
    url: '/',
  });
}

export default angular
  .module('ImagesGridScrollerApp.components.images', [])
  .component('imagesComponent', Images)
  .config(routesConfig).name;

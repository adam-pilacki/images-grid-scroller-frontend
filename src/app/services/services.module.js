import angular from 'angular';

import RestService from './rest.service';
import ImagesService from './images.service';

export default angular
  .module('ImagesGridScrollerApp.services', [])
  .service('rest', RestService)
  .service('images', ImagesService).name;

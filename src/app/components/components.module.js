import angular from 'angular';

import headerComponent from './header/header.module';
import imagesComponent from './images/images.module';
import footerComponent from './footer/footer.module';

export default angular.module('ImagesGridScrollerApp.components', [
  headerComponent,
  imagesComponent,
  footerComponent,
]).name;

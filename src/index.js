import angular from 'angular';

import uiRouter from '@uirouter/angularjs';
import angularLoadingBar from 'angular-loading-bar';
import angularMaterial from 'angular-material';

import config from './app/app.config';
import run from './app/app.run';
import appComponent from './app/app.component';
import servicesModule from './app/services/services.module';

import componentsModule from './app/components/components.module';

import './app/app.scss';

const vendors = [uiRouter, angularLoadingBar, angularMaterial];

const appDependencies = [servicesModule, componentsModule];

angular
  .module('ImagesGridScrollerApp', vendors.concat(appDependencies))
  .factory('debounce', $timeout => {
    return (callback, interval) => {
      let timeout = null;
      return () => {
        $timeout.cancel(timeout);
        timeout = $timeout(callback, interval);
      };
    };
  })
  .component('app', appComponent)
  .config(config)
  .run(run);

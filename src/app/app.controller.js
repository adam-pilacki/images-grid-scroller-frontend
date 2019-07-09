class AppController {
  constructor($state) {
    this.$state = $state;
    this.headerVisible = this.isHeaderVisible();
  }

  $doCheck() {
    this.headerVisible = this.isHeaderVisible();
  }

  isHeaderVisible() {
    // just an example: header can be hidden with state param
    return this.$state.params.headerVisible;
  }
}

AppController.$inject = ['$state'];

export default AppController;

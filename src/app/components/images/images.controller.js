class ImagesController {
  constructor(images, $window, debounce) {
    this.imagesService = images;
    this.$window = $window;
    this.debounce = debounce;
  }

  $onInit() {
    this.imageBoxDimensions = this.imagesService.getImageBoxDimensions();

    this.resetPagination();

    this.isLoading = true;

    this.triggerLoadImages = () => {
      if (!this.getImagesContainer()) {
        return this.triggerLoadImagesDebounced();
      }

      this.setLimits();

      if (this.next === 0 || this.next > this.currentOffset) {
        this.loadImages(this.offsetLimit);
      }
    };

    this.getImagesPerRow = this.getImagesPerRow.bind(this);
    this.loadImages = this.loadImages.bind(this);
    this.scrollListener = this.scrollListener.bind(this);
    this.mousewheelListener = this.mousewheelListener.bind(this);

    this.triggerLoadImagesDebounced = this.debounce(
      this.triggerLoadImages,
      200
    );

    this.addEventListeners();

    // init loading...
    this.triggerLoadImagesDebounced();
  }

  $onDestroy() {
    this.removeEventListeners();
  }

  addEventListeners() {
    this.$window.addEventListener(
      'resize',
      this.triggerLoadImagesDebounced
    );
    this.$window.addEventListener('scroll', this.scrollListener);
    this.$window.addEventListener('mousewheel', this.mousewheelListener);
  }

  removeEventListeners() {
    this.$window.removeEventListener(
      'resize',
      this.triggerLoadImagesDebounced
    );
    this.$window.removeEventListener('scroll', this.scrollListener);
    this.$window.removeEventListener('mousewheel', this.mousewheelListener);
  }

  scrollListener() {
    if (!this.imagesData.length || !this.next || this.isLoading) {
      return;
    }

    const el = this.getImagesContainer();
    const doc =
      document.documentElement || document.body.parentNode || document.body;

    const scrollTop =
      this.$window.pageYOffset !== undefined
        ? this.$window.pageYOffset
        : doc.scrollTop;

    const offset = this.imagesService.calculateOffset(el, scrollTop);

    // check offset and element's visibility
    if (offset < 200 && (el && el.offsetParent !== null)) {
      this.triggerLoadImagesDebounced();
    }
  }

  mousewheelListener(e) {
    // Prevents Chrome hangups
    // See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
    if (e.deltaY === 1 && !this.imagesService.isPassiveSupported()) {
      e.preventDefault();
    }
  }

  getLimit() {
    const imagesPerRow = this.getImagesPerRow();
    const rowsPerView = this.getVisibleRowsMaxNumber();
    return Math.ceil(imagesPerRow * rowsPerView);
  }

  loadImages(limit = this.offsetLimit) {
    if (this.currentOffset === 0) {
      this.resetPagination();
    }

    this.isLoading = true;

    this.imagesService
      .load(this.currentOffset, limit)
      .then(res => {
        this.currentOffset += limit;

        if (res.next) {
          this.next = res.next;
        }

        this.imagesData = [...this.imagesData, ...res.results];

        this.isLoading = false;

        // check if more images can be loaded on the screen...
        this.scrollListener();
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  resetPagination() {
    this.imagesData = [];
    this.currentOffset = 0;
    this.next = 0;

    this.setLimits();
  }

  getImagesContainer() {
    return document.getElementById('images-container');
  }

  getImagesPerRow() {
    const imagesContainer = this.getImagesContainer();

    if (!imagesContainer) {
      return 0;
    }
    return Math.floor(
      this.imagesContainerMaxWidth / (this.imageBoxDimensions.imgWidth + 60)
    );
  }

  getVisibleRowsMaxNumber() {
    return Math.floor(
      this.$window.screen.height / (this.imageBoxDimensions.boxHeight + 100)
    );
  }

  setLimits() {
    this.imagesContainerMaxWidth = this.$window.screen.width - 100;
    this.offsetLimit = this.getLimit();
  }
}

ImagesController.$inject = ['images', '$window', 'debounce'];

export default ImagesController;

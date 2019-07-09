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

    this.triggerLoadImages = (rebuildImagesRows = false) => {
      if (!this.getImagesContainer()) {
        return this.triggerLoadImagesDebounced();
      }

      this.setLimits();

      if (rebuildImagesRows) {
        this.rebuildImagesRows();
      }

      if (this.next === 0 || this.next > this.currentOffset) {
        this.loadImages(this.offsetLimit);
        this.isLoading = true;
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

    this.triggerLoadImagesWithReuildDebounced = this.debounce(
      () => this.triggerLoadImages(true),
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
      this.triggerLoadImagesWithReuildDebounced
    );
    this.$window.addEventListener('scroll', this.scrollListener);
    this.$window.addEventListener('mousewheel', this.mousewheelListener);
  }

  removeEventListeners() {
    this.$window.removeEventListener(
      'resize',
      this.triggerLoadImagesWithReuildDebounced
    );
    this.$window.removeEventListener('scroll', this.scrollListener);
    this.$window.removeEventListener('mousewheel', this.mousewheelListener);
  }

  scrollListener() {
    if (!this.imagesRows.length || !this.next || this.isLoading) {
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

  getLimit(secondCall = false) {
    const imagesPerRow = this.getImagesPerRow();
    const rowsPerView = this.getVisibleRowsMaxNumber();
    return Math.ceil(imagesPerRow * rowsPerView * (secondCall ? 0.7 : 0.9));
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

        this.addImagesToRows(res.results);

        this.isLoading = false;

        // check if more images can be loaded on the screen...
        this.scrollListener();
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  resetPagination() {
    this.imagesRows = [];
    this.currentOffset = 0;
    this.next = 0;

    this.setLimits();
  }

  /**
   * Rebuild the imagesRows buffer according to the current screen size
   * Truncate buffer (memory, performance)
   */
  rebuildImagesRows() {
    const flatImages = [];

    this.imagesRows.forEach(rowWithImages => {
      rowWithImages.forEach(image => {
        if (flatImages.length < 550) {
          flatImages.push(image);
        }
      });
    });

    this.currentOffset = flatImages.length;
    this.next = flatImages.length + 1;

    this.imagesRows = [];

    this.addImagesToRows(flatImages);
  }

  addImagesToRows(imagesToAdd) {
    if (!this.imagesPerRow) {
      return;
    }

    let row = [];

    for (let i = 1; i <= imagesToAdd.length; i++) {
      row = [...row, imagesToAdd[i - 1]];

      if (i % this.imagesPerRow === 0) {
        this.imagesRows = [...this.imagesRows, row];
        row = [];
      }
    }
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
      imagesContainer.offsetWidth / (this.imageBoxDimensions.imgWidth + 60)
    );
  }

  getVisibleRowsMaxNumber() {
    return Math.floor(
      this.$window.screen.height / (this.imageBoxDimensions.boxHeight + 100)
    );
  }

  setLimits() {
    this.offsetLimit = this.getLimit();
    this.imagesPerRow = this.getImagesPerRow();
  }
}

ImagesController.$inject = ['images', '$window', 'debounce'];

export default ImagesController;

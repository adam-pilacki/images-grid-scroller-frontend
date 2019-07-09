// use symbols to make object fields/props private
const REST = Symbol('rest');
const $LOG = Symbol('$log');

/**
 * Service itself - put here any API calls and other methods...
 */
class ImagesService {
  constructor(rest, $log) {
    this[REST] = rest;
    this[$LOG] = $log;
  }

  /**
   * Get images data
   *
   * @param limit
   * @param offset
   *
   * @return Promise
   */
  load(offset, limit) {
    return this[REST].get('/images', {
      limit,
      offset,
      imgWidth: GRID_IMAGE_WIDTH,
      imgHeight: GRID_IMAGE_HEIGHT,
    })
      .then(images => images.data)
      .catch(error => {
        this[$LOG].error('Images.load error.');
        this[$LOG].error(error);

        return {
          results: [],
        };
      });
  }

  getImageBoxDimensions() {
    return {
      imgWidth: GRID_IMAGE_WIDTH,
      imgHeight: GRID_IMAGE_HEIGHT,
      boxHeight: GRID_IMAGE_HEIGHT + 100,
    };
  }

  calculateOffset(el, scrollTop) {
    if (!el) {
      return 0;
    }

    return (
      this.calculateTopPosition(el) +
      (el.offsetHeight - scrollTop - window.innerHeight)
    );
  }

  calculateTopPosition(el) {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  /**
   * This should in other service
   *
   * @return {boolean}
   */
  isPassiveSupported() {
    let passive = false;

    const testOptions = {
      get passive() {
        passive = true;
      },
    };

    try {
      document.addEventListener('test', null, testOptions);
      document.removeEventListener('test', null, testOptions);
    } catch (e) {
      // ignore
    }
    return passive;
  }
}

ImagesService.$inject = ['rest', '$log'];

export default ImagesService;

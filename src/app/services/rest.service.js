class RestService {
  constructor($http, $httpParamSerializer) {
    this.$http = $http;
    this.$httpParamSerializer = $httpParamSerializer;
  }

  get(url, params) {
    return this.$http({
      method: 'GET',
      url: API_BASE_URL + url,
      params,
    });
  }

  post(url, data, params = {}) {
    let preparedUrl = url;
    if (Object.keys(params).length) {
      preparedUrl += `?${this.$httpParamSerializer(params)}`;
    }

    return this.$http({
      method: 'POST',
      url:
        API_BASE_URL +
        url +
        (Object.keys(params).length
          ? `?${this.$httpParamSerializer(params)}`
          : ''),
      data,
    });
  }

  delete(url, headers = {}) {
    return this.$http({
      method: 'DELETE',
      url: API_BASE_URL + url,
    });
  }
}

RestService.$inject = ['$http', '$httpParamSerializer'];

export default RestService;

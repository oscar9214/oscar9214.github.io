import Vue from "vue";
import moment from "moment";

Vue.filter('dateInDeltaTime', function (value) {
  return moment(value*1000).fromNow();
});

Vue.filter('getThumbnailUrl', function (entry) {
  const url = entry.data.preview ? entry.data.preview.images[0].resolutions[0].url.replace(/amp;/g, "") : '/assets/placeholder-image.png';
  return url;
});

Vue.filter('getFullSizeImagelUrl', function (entry) {
  if (!entry) {
    return '';
  }
  const url = entry.data.preview ? entry.data.preview.images[0].source.url.replace(/amp;/g, "") : '/assets/placeholder-image.png';
  return url;
});
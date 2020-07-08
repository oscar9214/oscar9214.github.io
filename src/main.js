import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import moment from "moment";

Vue.config.productionTip = false;

Vue.filter('dateInDeltaTime', function (value) {
  return moment(value*1000).fromNow();
});

Vue.filter('getThumbnailUrl', function (entry) {
  const url = entry.data.preview ? entry.data.preview.images[0].resolutions[0].url.replace(/amp;/g, "") : '/assets/placeholder-image.png';
  return url;
});

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");

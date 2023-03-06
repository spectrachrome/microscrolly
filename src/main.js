import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "img-comparison-slider";

import App from "./App.vue";

Vue.config.ignoredElements = [/img-comparison-slider/];

Vue.use(Vuetify);

new Vue({
  vuetify: new Vuetify(),
  render: (h) => h(App),
}).$mount("#app");

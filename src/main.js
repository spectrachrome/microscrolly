import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import App from "./App";

Vue.use(Vuetify);

new Vue({
  vuetify: new Vuetify(),
  render: h => h(App)
}).$mount("#app");

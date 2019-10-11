/* eslint-disable */

import Vue from 'vue';
import VueRouter from 'vue-router';
// import MovieDetail from "./components/MovieDetail";
// import MovieFinder from './components/MovieFinder';

import App from './App.vue';
import router from "./Router";

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);
Vue.use(VueRouter);

Vue.config.productionTip = true;

new Vue({
    render: (h) => h(App),
    router: router
}).$mount('#app');

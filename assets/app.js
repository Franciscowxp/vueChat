import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import routes from './route/routes';
import store from './store/index';
import App from './App.vue';

import 'sass/pages/index.scss';
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.http.options.emulateJSON = true;

const router = new VueRouter({
    mode: 'history',
    routes
});

new Vue({
    store,
    router,
    ...App
}).$mount("#app");
import Vue from 'vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueTouch from 'vue-touch';
import routes from './route/routes';
import App from './App.vue';
import store from 'store/index';
import 'sass/pages/index.scss';
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueTouch);
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